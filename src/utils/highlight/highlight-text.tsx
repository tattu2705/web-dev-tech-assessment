export interface ITextFormat {
  text: string;
  type: "bold" | "normal";
}

/**
 * Extracts highlighted text from a document given offset ranges.
 * Returns an array of text segments with "bold" or "normal" formatting.
 */
export const extractHighlightFromDocument = (
  text: string,
  searchKeyword: string
): ITextFormat[] => {
  if (!searchKeyword.trim()) return [{ text, type: "normal" }];

  const words = searchKeyword.toLowerCase().split(/\s+/).filter((word) => word.length >= 3);
  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const result: ITextFormat[] = [];
  let lastIndex = 0;

  text.replace(regex, (match, _, offset) => {
    if (offset > lastIndex) {
      result.push({
        text: text.substring(lastIndex, offset),
        type: "normal",
      });
    }

    result.push({
      text: match,
      type: "bold",
    });

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    result.push({ text: text.substring(lastIndex), type: "normal" });
  }

  return result;
};

/**
 * Highlights occurrences of a keyword in a given text.
 * Returns an array of text segments with "bold" or "normal" formatting.
 */
export const extractHighlightByKeyword = (
  text: string,
  keyword: string
): ITextFormat[] => {
  if (!keyword.trim()) return [{ text, type: "normal" }];

  const words = keyword.toLowerCase().split(/\s+/);
  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const result: ITextFormat[] = [];
  let lastIndex = 0;

  text.replace(regex, (match, _, offset) => {
    if (offset > lastIndex) {
      result.push({
        text: text.substring(lastIndex, offset),
        type: "normal",
      });
    }

    result.push({
      text: match,
      type: "bold",
    });

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    result.push({ text: text.substring(lastIndex), type: "normal" });
  }

  return result;
};

export const renderWithHighlights = (
  text: string,
  keyword: string
): React.ReactNode => {
  if (!keyword.trim()) return text;

  const words = keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (words.length === 0) return text;

  const escapedWords = words.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const regex = new RegExp(`(${escapedWords.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        words.some((w) => part.toLowerCase() === w) ? (
          <span key={index} style={{fontWeight: 700}}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};