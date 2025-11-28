import { renderHook, waitFor } from '@testing-library/react';
import { useSuggestions } from './useSuggestions';
import { fetchSuggestions } from '../services/suggestion-service';

jest.mock('../services/suggestion-service');
const mockedFetch = fetchSuggestions as jest.MockedFunction<typeof fetchSuggestions>;

describe('useSuggestions hook', () => {
  const mockData = {
    suggestions: ['apple', 'banana', 'cherry'],
    stemmedQueryTerm: 'app',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load suggestions successfully', async () => {
    mockedFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() => useSuggestions());

    await waitFor(() => {
      expect(result.current).toEqual(mockData.suggestions);
    });

    expect(mockedFetch).toHaveBeenCalled();
  });

  it('should handle fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedFetch.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useSuggestions());

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });

    expect(mockedFetch).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleSpy.mockRestore();
  });
});
