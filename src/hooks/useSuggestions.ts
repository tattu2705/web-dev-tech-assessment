import { useState, useEffect } from "react";
import { fetchSuggestions } from "../services/suggestion-service";

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSuggestions();
        setSuggestions(res.suggestions);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return suggestions;
};