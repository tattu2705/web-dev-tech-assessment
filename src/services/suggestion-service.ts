import axios from 'axios';
import { SuggestionsResponse } from '../types/promise-type';

// URL API
const SUGGESTION_API_URL =
  'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/47766bbcd842b2606334f4a8d4b5627539297560/suggestion.json';

export const fetchSuggestions = async (keyword: string): Promise<SuggestionsResponse> => {
  try {
    const response = await axios.get<SuggestionsResponse>(SUGGESTION_API_URL);
    return response.data
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw new Error('Failed to fetch suggestions');
  }
};