import React, { useEffect, useRef } from "react";
import { extractHighlightByKeyword, ITextFormat } from "../../utils/highlight/highlight-text";

interface DropdownSuggestionProps {
  keyword: string;
  suggestions: string[];
  visible: boolean;
  highlightIndex: number;
  onSelect: (value: string) => void;
  onHover: (index: number) => void;
  onCloseSuggestion: () => void;
  maxItems?: number;
}

interface IProps {
  textFormats: ITextFormat[];
}

function HighlightText(props: IProps) {
  const { textFormats } = props;

  return (
    <>
      {textFormats.map(({ text, type }, index) => (
        <span key={index} className={type === "bold" ? "font-bold" : ""}>
          {text}
        </span>
      ))}
    </>
  );
}

const DropdownSuggestion: React.FC<DropdownSuggestionProps> = ({
  keyword,
  suggestions,
  visible,
  highlightIndex,
  onSelect,
  onHover,
  onCloseSuggestion,
  maxItems = 6,
}) => {
  
  return (
    <div className="suggestion-wrapper">
      <ul aria-label="suggestion-dropdown">
        {
          suggestions.map((suggestion, index) => {
            const highlightText = extractHighlightByKeyword(suggestion, keyword);
            return (
              <li
                key={index}
                className={`dropdown-item ${highlightIndex === index ? "selected-item" : ""}`}
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect(suggestion)}
              >
                <HighlightText textFormats={highlightText} />
              </li>
            )
          })
        }
      </ul>
    </div>
  );
};

export default DropdownSuggestion;
