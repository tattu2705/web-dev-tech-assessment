import { renderHook, act } from '@testing-library/react';
import { useSuggestions } from './useSuggestions';
import { fetchSuggestions } from '../services/suggestion-service';
import { notifyError } from '../utils/notify';
import {
  filterSearchSuggestions,
  getOtherResultsFromSynonyms,
} from '../utils/filter/filter';

jest.useFakeTimers();

jest.mock('../services/suggestion-service');
jest.mock('../utils/notify');
jest.mock('../utils/filter/filter');

const mockedFetchSuggestions = fetchSuggestions as jest.Mock;
const mockedNotifyError = notifyError as jest.Mock;
const mockedFilterSuggestions = filterSearchSuggestions as jest.Mock;
const mockedGetOtherResults = getOtherResultsFromSynonyms as jest.Mock;

describe('useSuggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useSuggestions());

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.synonyms).toEqual([]);
  });

  it('should clear suggestions if keyword length < 3', () => {
    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.fetchDebouncedSuggestions('ab');
    });

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.synonyms).toEqual([]);
    expect(mockedFetchSuggestions).not.toHaveBeenCalled();
  });

  it('should fetch suggestions after debounce delay', async () => {
    const mockApiResponse = {
      suggestions: { child: 10 },
      synonyms: { child: ['kids'] },
    };

    mockedFetchSuggestions.mockResolvedValueOnce(mockApiResponse);
    mockedFilterSuggestions.mockReturnValue(['child care']);
    mockedGetOtherResults.mockReturnValue(['kids care']);

    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.fetchDebouncedSuggestions('child');
    });

    expect(mockedFetchSuggestions).not.toHaveBeenCalled();

    // Fast-forward time
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(mockedFetchSuggestions).toHaveBeenCalledWith('child');
    expect(result.current.suggestions).toEqual(['child care']);
    expect(result.current.synonyms).toEqual(['kids care']);
  });

  it('should debounce multiple calls and only fetch once', async () => {
    mockedFetchSuggestions.mockResolvedValueOnce({
      suggestions: {},
      synonyms: {},
    });
    mockedFilterSuggestions.mockReturnValue([]);
    mockedGetOtherResults.mockReturnValue([]);

    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.fetchDebouncedSuggestions('chi');
      result.current.fetchDebouncedSuggestions('chil');
      result.current.fetchDebouncedSuggestions('child');
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(mockedFetchSuggestions).toHaveBeenCalledTimes(1);
    expect(mockedFetchSuggestions).toHaveBeenCalledWith('child');
  });

  it('should notify error when fetchSuggestions fails', async () => {
    mockedFetchSuggestions.mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useSuggestions());

    act(() => {
      result.current.fetchDebouncedSuggestions('child');
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(mockedNotifyError).toHaveBeenCalledWith(
      'Error',
      'Failed to fetch suggestions'
    );
  });
});
