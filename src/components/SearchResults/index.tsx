import React from "react";
import { SearchResultProps } from "../../types/search-result";
import { renderWithHighlights } from "../../utils/highlight/highlight-text";
import './index.css'

const SearchResult: React.FC<SearchResultProps> = ({
  total,
  page,
  results,
  pageSize,
  searchKeyword
}) => {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="search-result-container">
      {
        results.length ? (
          <>
            <div
              className="search-result-details"
            >
              Showing {start}-{end} of {total} results
            </div>

            <div className="search-result-wrapper">
              {results.map((item) => (
                <div key={item.DocumentId} className="search-result-item">
                  <a
                    href={item.DocumentURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="item-title"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    {item.DocumentTitle.Text}
                  </a>

                  <div
                    style={{
                      fontSize: "16px",
                      color: "#282828",
                      marginBottom: "6px",
                      lineHeight: 1.5,
                      maxWidth: "830px",
                    }}
                  >
                    {renderWithHighlights(
                      item.DocumentExcerpt.Text,
                      searchKeyword
                    )}
                  </div>

                  <div style={{ fontSize: "14px", color: "#686868" }}>
                    {item.DocumentURI}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="not-found-result" data-testid="error-msg">
            No results found for your search{" "}
            <span className="font-bold">"{searchKeyword}"</span>.
          </div>
        )
      }

    </div>
  );
};

export default SearchResult;
