import React from "react";
import { Highlight, SearchResultProps } from "../../types/search-result";

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
}) => {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div style={{ width: "100%", padding: "20px 40px" }}>
      <div
        style={{
          fontSize: "22px",
          color: "#282828",
          marginBottom: "20px",
          fontWeight: 600,
        }}
      >
        Showing {start}-{end} of {total} results
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {results.map((item) => (
          <div key={item.DocumentId}>

            {/* Title - CLICKABLE */}
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

            {/* Excerpt */}
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

            {/* URL */}
            <div style={{ fontSize: "14px", color: "#686868" }}>
              {item.DocumentURI}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
