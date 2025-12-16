import React, { useEffect, useRef } from "react";
import { extractHighlightByKeyword, ITextFormat } from "@/utils/highlight/highlight-text";
import './index.css'
interface DropdownSuggestionProps {
  keyword: string;
  suggestions: string[];
  highlightIndex: number;
  onSelect: (value: string) => void;
  onHover: (index: number) => void;
  onCloseSuggestion: () => void;
  synonyms: string[];
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
        <span key={index} style={{fontWeight: type === "bold" ? 700: "normal"}}>
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
  synonyms = [],
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

      {synonyms.length > 0 && (
        <div className="synonym-wrapper">
          <h3 className="synonym-header">Other Results</h3>
          <ul>
            {synonyms.map((synonym, index) => {
              const synonymIndex = suggestions.length + index;

              return (
                <li
                  key={synonym}
                  className={`synonym-item ${highlightIndex === synonymIndex ? "selected-item" : ""
                    }`}
                  onMouseEnter={() => onHover(synonymIndex)}
                  onClick={() => onSelect(synonym)}
                >
                  {synonym}
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
