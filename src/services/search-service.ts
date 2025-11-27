export interface ApiResponse {
  TotalNumberOfResults: number;
  Page: number;
  PageSize: number;
  ResultItems: any[];
}

const SEARCH_API =
  "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json";

export async function fetchSearchResults(query: string): Promise<ApiResponse> {

  try {
    const response = await fetch(SEARCH_API);

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();
    return data as ApiResponse;
  } catch (err) {
    console.error("Error fetching search results:", err);
    throw err;
  }
}