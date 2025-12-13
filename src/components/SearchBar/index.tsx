import React, { useState } from 'react'
import { SearchBarProps } from '../../types/search-bar'
import DOMPurify from 'dompurify'
import CrossIcon from '../../assets/icons/CrossIcon'
import { useSuggestions } from '../../hooks/useSuggestions'
import SearchIcon from '../../assets/icons/SearchIcon'
import './index.css'
const MAX_INPUT_LEN = 100

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, allowClear, enterButton, size, onSearch, style, value, onChange, onKeyDown, onClear, className }) => {
  const { clearSuggestions } = useSuggestions()
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>("")

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input).replace(/[^a-zA-Z0-9\s]/g, "")
  }

  const handleClear = () => {
    setInputValue("")
    clearSuggestions()
  }

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

    }
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

        {
          // { isDropdownOpen && (suggestions.length > 0 || relatedResults.length > 0) && (
          //   <SuggestionDropdown
          //     suggestions={suggestions}
          //     relatedResults={relatedResults}
          //     activeIndex={activeSuggestionIndex}
          //     inputValue={inputValue}
          //     onSelect={selectSuggestion}
          //     onHover={setActiveSuggestionIndex}
          //   />
          // )}
        }
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