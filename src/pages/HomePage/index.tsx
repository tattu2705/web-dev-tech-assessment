import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import SearchResult from "../../components/SearchResults";
import { Spin } from "antd";
import DropdownSuggestion from "../../components/DropdownSuggestion";
import { useSuggestions } from "../../hooks/useSuggestions";
import { useSearchResults } from "../../hooks/useSearchResults";
import "./index.css";
import SearchIcon from "../../assets/icons/SearchIcon";
import Banner from "../../components/Banner";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const {suggestions} = useSuggestions();
  const [filtered, setFiltered] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const { data, loading, search } = useSearchResults();

  const enterButton = (
    <button
      // className="bg-primary-blue flex justify-center items-center gap-2 text-white py-2 px-5 rounded-md"
      className="search-btn"
      aria-label="search-btn"
    >
      <SearchIcon />
      <span className="hidden sm:block">Search</span>
    </button>
  );

  const onClose = () => {
    setShowDropdown(false);
    setHighlightIndex(-1);
  }

  useEffect(() => {
    if (keyword.length < 3) {
      setShowDropdown(false);
      return;
    }

    const lower = keyword.toLowerCase();
    const top6 = suggestions.filter((s) => s.toLowerCase().includes(lower)).slice(0, 6);

    setFiltered(top6);
    setShowDropdown(top6.length > 0);
  }, [keyword, suggestions]);

  const handleSearch = async (value: string) => {
    await search(value);
    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  const handleSelectSuggestion = (text: string) => {
    setKeyword(text);
    handleSearch(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < filtered.length - 1 ? i + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : filtered.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        handleSelectSuggestion(filtered[highlightIndex]);
      } else {
        handleSearch(keyword);
      }
    }
  };

  const handleClear = () => {
    setKeyword("");
    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  return (
    <div>
      <div className="header-shadow">
        <Banner />
        <div className="homepage-search-inner">
          <SearchBar
            allowClear
            onSearch={handleSearch}
            enterButton={enterButton}
            size="large"
            className="searchbar-wide"
            value={keyword}
            onChange={(s) => setKeyword(s)}
            onKeyDown={handleKeyDown}
            onClear={handleClear}
          />

          <DropdownSuggestion
            visible={showDropdown}
            keyword={keyword}
            onCloseSuggestion={onClose}
            suggestions={filtered}
            highlightIndex={highlightIndex}
            onSelect={handleSelectSuggestion}
            onHover={(i) => setHighlightIndex(i)}
          />
        </div>
      </div>

      {loading && (
        <div className="homepage-loading">
          <Spin />
        </div>
      )}

      {!loading && data && (
        <SearchResult
          total={data.TotalNumberOfResults}
          page={data.Page}
          pageSize={data.PageSize}
          results={data.ResultItems}
        />
      )}
    </div>
  );
};

export default HomePage;
