import React, { useEffect, useRef } from "react";
import { extractHighlightByKeyword, ITextFormat } from "../../utils/highlight/highlight-text";
import './index.css'
interface DropdownSuggestionProps {
  keyword: string;
  suggestions: string[];
  highlightIndex: number;
  onSelect: (value: string) => void;
  onHover: (index: number) => void;
  onCloseSuggestion: () => void;
  symnonyms: string[];
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
  highlightIndex,
  onSelect,
  onHover,
  onCloseSuggestion,
  symnonyms = [],
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onCloseSuggestion();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCloseSuggestion]);

  return (
    <div className="suggestion-wrapper" ref={wrapperRef}>
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

      {symnonyms.length > 0 && (
        <div className="symnonym-wrapper">
          <h3 className="symnonym-header">Other Results</h3>
          <ul>
            {symnonyms.map((symnonym, index) => {
              const synonymIndex = suggestions.length + index;

              return (
                <li
                  key={symnonym}
                  className={`symnonym-item ${highlightIndex === synonymIndex ? "selected-item" : ""
                    }`}
                  onMouseEnter={() => onHover(synonymIndex)}
                  onClick={() => onSelect(symnonym)}
                >
                  {symnonym}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownSuggestion;
