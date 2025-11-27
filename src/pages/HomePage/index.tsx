import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import SearchResult from "../../components/SearchResults";
import { fetchSearchResults, ApiResponse } from "../../services/search-service";
import { fetchSuggestions } from "../../services/suggestion-service";
import { Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import DropdownSuggestion from "../../components/DropdownSuggestion";

interface SuggestionItem {
  text: string;
  importance: number;
}

const HomePage = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [suggestionList, setSuggestionList] = useState<SuggestionItem[]>([]);
  const [filtered, setFiltered] = useState<SuggestionItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const enterButton = (
    <Button
      type="primary"
      style={{ backgroundColor: "#1C76D5", borderColor: "#1C76D5" }}
    >
      <SearchOutlined /> Search
    </Button>
  );

  /** Load suggestion data one time */
  useEffect(() => {
    const loadSuggest = async () => {
      try {
        const res = await fetchSuggestions();

        const list: SuggestionItem[] = Object.entries(res.suggestions).map(
          ([text, importance]) => ({
            text,
            importance,
          })
        );

        setSuggestionList(list);
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    };

    loadSuggest();
  }, []);

  /** Filter suggestions when keyword changes */
  useEffect(() => {
    if (keyword.length < 3) {
      setShowDropdown(false);
      return;
    }

    const lower = keyword.toLowerCase();

    const top6 = suggestionList
      .filter((s) => s.text.toLowerCase().includes(lower))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 6);

    setFiltered(top6);
    setShowDropdown(top6.length > 0);
  }, [keyword, suggestionList]);

  /** Search API */
  const handleSearch = async (value: string) => {
    if (!value.trim()) return;

    setLoading(true);

    try {
      const results = await fetchSearchResults(value);
      setData(results);
      setShowDropdown(false);
      setHighlightIndex(-1);
    } catch (err) {
      console.error("Fetch error: ", err);
    } finally {
      setLoading(false);
    }
  };

  /** Select a suggestion */
  const handleSelectSuggestion = (text: string) => {
    setKeyword(text);
    handleSearch(text);
  };

  /** Handle keyboard ↑ ↓ Enter */
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
        handleSelectSuggestion(filtered[highlightIndex].text);
      } else {
        handleSearch(keyword);
      }
    }
  };

  /** Clear search input ('X' button) */
  const handleClear = () => {
    setKeyword("");
    setShowDropdown(false);
    setHighlightIndex(-1);
    setData(null);
  };

  return (
    <div style={{ width: "100%" }}>
      
      {/* Search Bar */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <SearchBar
          allowClear={true}
          onSearch={handleSearch}
          enterButton={enterButton}
          size="large"
          style={{ width: "78vw" }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          onClear={handleClear}
        />

        {/* Suggestion Dropdown */}
        <DropdownSuggestion
          visible={showDropdown}
          keyword={keyword}
          suggestions={filtered}
          highlightIndex={highlightIndex}
          onSelect={handleSelectSuggestion}
          onHover={(i) => setHighlightIndex(i)}
        />
      </div>

      {/* Loading */}
      {loading && <div style={{ fontSize: 16 }}>Loading...</div>}

      {/* Search Results */}
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
