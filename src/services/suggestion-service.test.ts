import axios from 'axios';
import { fetchSuggestions } from './suggestion-service';
import { SuggestionsResponse } from '../types/promise-type';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchSuggestions', () => {
  const mockData: SuggestionsResponse = {
    suggestions: ['apple', 'banana', 'cherry'],
    stemmedQueryTerm: 'app',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data when axios.get succeeds', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await fetchSuggestions();
    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json'
    );
  });

  it('should throw error when axios.get fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(fetchSuggestions()).rejects.toThrow('Failed to fetch suggestions');
  });

  it('should call console.error on failure', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    await expect(fetchSuggestions()).rejects.toThrow('Failed to fetch suggestions');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching suggestions:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
