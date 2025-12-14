export interface SuggestionsResponse {
  suggestions: Record<string, number>;
  synonyms: Record<string, string[]>;
}

export interface SuggestionItem {
  text: string;
  score: number;
}

export interface ApiResponse {
  TotalNumberOfResults: number;
  Page: number;
  PageSize: number;
  ResultItems: any[];
}
