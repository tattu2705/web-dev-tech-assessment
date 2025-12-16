import { useState } from "react";
import { fetchSearchResults } from "../services/search-service";
import { ApiResponse } from "../types/promise-type";
import { notifyError } from "../utils/notify";

export const useSearchResults = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState<string>("")

  const fetchResults = async (keyword: string) => {
    setLoading(true);
    try {
      const results = await fetchSearchResults(keyword);
      setData(results);
      setSearchPhrase(keyword)
    }
    catch (error) {
      notifyError("Error", "Failed to fetch search results");
    }
    finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    fetchResults,
    searchPhrase
  };
};
