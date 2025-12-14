import axios from "axios";
import { ApiResponse } from "../types/promise-type";
import { filterSearchResult } from "../utils/filter/filter";

const SEARCH_API =
  "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json";

export async function fetchSearchResults(query: string): Promise<ApiResponse> {
  try {
    const response = await axios.get<ApiResponse>(SEARCH_API);
    return filterSearchResult(response.data, query);
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw new Error("Failed to fetch search results");
  }
}
