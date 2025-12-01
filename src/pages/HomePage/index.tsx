import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import SearchResult from "../../components/SearchResults";
import { Button, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import DropdownSuggestion from "../../components/DropdownSuggestion";
import { useSuggestions } from "../../hooks/useSuggestions";
import { useSearchResults } from "../../hooks/useSearchResults";

const HomePage = () => {
  const [keyword, setKeyword] = useState("");
  const suggestionList = useSuggestions();
  const [filtered, setFiltered] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const { data, loading, search } = useSearchResults();

  const enterButton = (
    <Button type="primary" style={{ width: "160px", backgroundColor: "#1C76D5", borderColor: "#1C76D5" }}>
      <SearchOutlined /> Search
    </Button>
  );

  useEffect(() => {
    if (keyword.length < 3) {
      setShowDropdown(false);
      return;
    }

    const lower = keyword.toLowerCase();
    const top6 = suggestionList.filter((s) => s.toLowerCase().includes(lower)).slice(0, 6);

    setFiltered(top6);
    setShowDropdown(top6.length > 0);
  }, [keyword, suggestionList]);

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
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
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
            onChange={(s) => setKeyword(s)}
            onKeyDown={handleKeyDown}
            onClear={handleClear}
          />

          <DropdownSuggestion
            visible={showDropdown}
            keyword={keyword}
            suggestions={filtered}
            highlightIndex={highlightIndex}
            onSelect={handleSelectSuggestion}
            onHover={(i) => setHighlightIndex(i)}
          />
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", fontSize: 16, justifyContent: "center" }}>
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
