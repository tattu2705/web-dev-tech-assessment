import { useState, useEffect } from "react";
import { fetchSuggestions } from "../services/suggestion-service";
import { notifyError } from "../utils/notify";
export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const clearSuggestions = () => {
    setSuggestions([])
  }
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSuggestions();
        setSuggestions(res.suggestions);
      } catch (err) {
        notifyError("Error", "Failed to fetch suggestions");
      }
    };
    load();
  }, []);

  return {suggestions, clearSuggestions};
};