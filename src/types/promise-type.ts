export interface SuggestionsResponse {
  suggestions: string[];
  stemmedQueryTerm: string;
}

export interface ApiResponse {
  TotalNumberOfResults: number;
  Page: number;
  PageSize: number;
  ResultItems: any[];
}
