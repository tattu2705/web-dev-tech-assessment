import { ApiResponse } from "@/types/promise-type";

export const filterSearchSuggestions = (
  suggestions: Record<string, number>,
  keyword: string
): string[] => {
  const normalizedKeyword = keyword.toLowerCase().trim();

  return Object.entries(suggestions)
    .filter(([text]) =>
      text.toLowerCase().includes(normalizedKeyword)
    )
    .sort((a, b) => b[1] - a[1])
    .map(([text]) => text);
};

export const getOtherResultsFromSynonyms = (
  synonyms: Record<string, string[]>,
  keyword: string,
  limit = 6
): string[] => {
  const words = keyword.toLowerCase().trim().split(/\s+/);
  const results = new Set<string>();

  words.forEach((word) => {
    if (synonyms[word]) {
      synonyms[word].forEach((syn) => results.add(syn));
    }

    Object.entries(synonyms).forEach(([key, values]) => {
      if (values.includes(word)) {
        results.add(key);
        values.forEach((v) => results.add(v));
      }
    });
  });

  words.forEach((w) => results.delete(w));

  return Array.from(results).slice(0, limit);
};


export const filterSearchResult = (
  data: ApiResponse,
  keyword: string
): ApiResponse => {
  if (!keyword.trim()) return data;

  const words = keyword
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3);

  if (words.length === 0) return data;

  const filteredItems = data.ResultItems.filter((item: any) => {
    const title = item?.DocumentTitle?.Text?.toLowerCase() ?? "";
    const excerpt = item?.DocumentExcerpt?.Text?.toLowerCase() ?? "";

    return words.every(
      word => title.includes(word) || excerpt.includes(word)
    );
  });

  return {
    ...data,
    ResultItems: filteredItems,
    TotalNumberOfResults: filteredItems.length
  };
};
