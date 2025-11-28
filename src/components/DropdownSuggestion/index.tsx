import React, { useRef } from "react";

interface DropdownSuggestionProps {
  keyword: string;
  suggestions: string[];
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

  const filtered = suggestions.slice(0, maxItems);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "56px",
        left: 0,
        width: "calc(78vw - 145px)",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        zIndex: 30,
        padding: "6px 0",
      }}
    >
      {filtered.map((text, index) => (
        <div
          key={index}
          onMouseEnter={() => onHover(index)}
          onClick={() => onSelect(text)}
          style={{
            padding: "10px 14px",
            cursor: "pointer",
            background:
              index === highlightIndex ? "#f0f7ff" : "#fff",
            fontSize: "15px",
            color: "#333",
          }}
        >
          {text}
        </div>
      ))}

    </div>
  );
};

export default DropdownSuggestion;
