import axios from 'axios';

export interface SuggestionsResponse {
  suggestions: Record<string, number>;
  synonyms: Record<string, string[]>;
}

// URL API
const SUGGESTION_API_URL =
  'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json';

export const fetchSuggestions = async (): Promise<SuggestionsResponse> => {
  try {
    const response = await axios.get<SuggestionsResponse>(SUGGESTION_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw new Error('Failed to fetch suggestions');
  }
};