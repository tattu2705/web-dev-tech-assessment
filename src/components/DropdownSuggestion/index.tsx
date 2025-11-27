import React, { useRef } from "react";

interface SuggestionItem {
  text: string;
  importance: number;
}

interface DropdownSuggestionProps {
  keyword: string;
  suggestions: SuggestionItem[];
  visible: boolean;
  highlightIndex: number;
  onSelect: (value: string) => void;
  onHover: (index: number) => void;
  maxItems?: number;
}

const DropdownSuggestion: React.FC<DropdownSuggestionProps> = ({
  keyword,
  suggestions,
  visible,
  highlightIndex,
  onSelect,
  onHover,
  maxItems = 6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!visible || keyword.length < 3) return null;

  const filtered = suggestions
    .filter((s) =>
      s.text.toLowerCase().includes(keyword.toLowerCase())
    )
    .sort((a, b) => b.importance - a.importance)
    .slice(0, maxItems);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "48px",
        width: "400px",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        zIndex: 30,
        padding: "6px 0",
      }}
    >
      {filtered.map((item, index) => (
        <div
          key={index}
          onMouseEnter={() => onHover(index)}
          onClick={() => onSelect(item.text)}
          style={{
            padding: "10px 14px",
            cursor: "pointer",
            background:
              index === highlightIndex ? "#f0f7ff" : "#fff",
            fontSize: "15px",
            color: "#333",
          }}
        >
          {item.text}
        </div>
      ))}

      {filtered.length === 0 && (
        <div
          style={{
            padding: "10px 14px",
            color: "#999",
            fontSize: "14px",
          }}
        >
          No suggestions found
        </div>
      )}
    </div>
  );
};

export default DropdownSuggestion;
