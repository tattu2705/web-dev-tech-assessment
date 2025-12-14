import React, { useEffect, useState } from 'react'
import { SearchBarProps } from '../../types/search-bar'
import DOMPurify from 'dompurify'
import CrossIcon from '../../assets/icons/CrossIcon'
import { useSuggestions } from '../../hooks/useSuggestions'
import SearchIcon from '../../assets/icons/SearchIcon'
import './index.css'
import DropdownSuggestion from '../DropdownSuggestion'
const MAX_INPUT_LEN = 100

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear }) => {
  const { suggestions, clearSuggestions, symnonyms, fetchDebouncedSuggestions } = useSuggestions()
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input).replace(/[^a-zA-Z0-9\s]/g, "")
  }

  useEffect(() => {
    if (!isDropdownOpen) setActiveSuggestionIndex(-1);
  }, [isDropdownOpen]);

  const handleClear = () => {
    onClear()
    clearSuggestions()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = suggestions.length + symnonyms.length;
    if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0) {
        if (activeSuggestionIndex < suggestions.length) {
          selectSuggestion(suggestions[activeSuggestionIndex]);
        } else {
          const relatedIndex = activeSuggestionIndex - suggestions.length;
          selectSuggestion(symnonyms[relatedIndex]);
        }
      } else {
        handleSubmit();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev + 1 < totalItems ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleInputChange = (input: string) => {
    if (input.length > MAX_INPUT_LEN) {
      setError("Input is too long")
      return;
    }
    else {
      setError(null)
    }

    const sanitizedInput = sanitizeInput(input)
    setInputValue(sanitizedInput)
    if (sanitizedInput.length > 2) {
      setIsDropdownOpen(true)
      fetchDebouncedSuggestions(sanitizedInput)
    }
    else {
      clearSuggestions()
      setIsDropdownOpen(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    handleSubmit(suggestion);
  }

  const handleSubmit = (keyword?: string) => {
    const searchValue = keyword ?? inputValue
    if (!searchValue) return;

    clearSuggestions()
    onSearch(searchValue)
  }
  return (
    <div className='searchbar-wrapper'>
      <div className='searchbar-input-wrapper'>
        <input
          type='text'
          value={inputValue}
          className='searchbar-input'
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => handleInputChange(e.target.value)}
        />

        {error && <div className='error'>{error}</div>}

        {
          inputValue.length > 0 && (
            <button className='searchbar-clear' aria-label='clear-search' onClick={handleClear}>
              <CrossIcon />
            </button>
          )
        }

        {isDropdownOpen &&
          (suggestions.length > 0 ||
            symnonyms.length > 0) && (
            <DropdownSuggestion
              suggestions={suggestions}
              symnonyms={symnonyms}
              highlightIndex={activeSuggestionIndex}
              keyword={inputValue}
              onSelect={selectSuggestion}
              onHover={setActiveSuggestionIndex}
              onCloseSuggestion={() => setIsDropdownOpen(false)}
            />
          )}
      </div>

      <button className='search-btn' aria-label='search-btn' onClick={() => handleSubmit()}>
        <SearchIcon />
        <span>
          Search
        </span>
      </button>
    </div>
  )
}

export default SearchBar