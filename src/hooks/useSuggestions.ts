import { useState, useRef, useCallback } from "react";
import { fetchSuggestions } from "@/services/suggestion-service";
import { notifyError } from "@/utils/notify";
import { filterSearchSuggestions, getOtherResultsFromSynonyms } from "@/utils/filter/filter";

const DEBOUNCE_DELAY = 300;

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [synonyms, setSynonyms] = useState<string[]>([]);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const clearSuggestions = () => {
    setSuggestions([]);
    setSynonyms([]);
  };

  const fetchDebouncedSuggestions = useCallback((keyword: string) => {
    if (!keyword || keyword.length < 3) {
      clearSuggestions();
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetchSuggestions(keyword);

        const filteredSuggestions = filterSearchSuggestions(
          res.suggestions,
          keyword
        );

        const otherResults = getOtherResultsFromSynonyms(
          res.synonyms,
          keyword
        );

        setSuggestions(filteredSuggestions);
        setSynonyms(otherResults);
      } catch (err) {
        notifyError("Error", "Failed to fetch suggestions");
      }
    }, DEBOUNCE_DELAY);
  }, []);

  return {
    suggestions,
    synonyms,
    fetchDebouncedSuggestions,
    clearSuggestions,
  };
};
