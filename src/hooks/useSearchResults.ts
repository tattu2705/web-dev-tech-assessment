import { useState } from "react";
import { fetchSearchResults } from "../services/search-service";
import { ApiResponse } from "../types/promise-type";
import { notifyError } from "../utils/notify";

export const useSearchResults = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (keyword: string) => {
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const results = await fetchSearchResults(keyword);
      setData(results);
    } catch (error) {
      notifyError("Error", "Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setData(null);
  };

  return {
    data,
    loading,
    search,
    clear,
  };
};
