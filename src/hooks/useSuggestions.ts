import { useState, useRef, useCallback } from "react";
import { fetchSuggestions } from "../services/suggestion-service";
import { notifyError } from "../utils/notify";
import { filterSearchSuggestions, getOtherResultsFromSymnonyms } from "../utils/filter/filter";

const DEBOUNCE_DELAY = 300;

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [symnonyms, setSymnonyms] = useState<string[]>([]);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const clearSuggestions = () => {
    setSuggestions([]);
    setSymnonyms([]);
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

        const otherResults = getOtherResultsFromSymnonyms(
          res.synonyms,
          keyword
        );

        setSuggestions(filteredSuggestions);
        setSymnonyms(otherResults);
      } catch (err) {
        notifyError("Error", "Failed to fetch suggestions");
      }
    }, DEBOUNCE_DELAY);
  }, []);

  return {
    suggestions,
    symnonyms,
    fetchDebouncedSuggestions,
    clearSuggestions,
  };
};
