import React from "react";
import { Highlight, SearchResultProps } from "../../types/search-result";
import './index.css'

function renderWithHighlights(text: string, highlights: Highlight[]) {
  if (!highlights || highlights.length === 0) return text;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  highlights.forEach((h, i) => {
    if (lastIndex < h.BeginOffset) {
      parts.push(text.slice(lastIndex, h.BeginOffset));
    }

    parts.push(
      <span
        key={i}
        style={{
          padding: "0 2px",
          borderRadius: "2px",
          fontWeight: "bold"
        }}
      >
        {text.slice(h.BeginOffset, h.EndOffset)}
      </span>
    );

    lastIndex = h.EndOffset;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

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
                    style={{
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "#0d6efd",
                      marginBottom: "6px",
                      display: "inline-block",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
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
                      item.DocumentExcerpt.Highlights
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
