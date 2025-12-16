import { renderHook, act } from '@testing-library/react';
import { useSearchResults } from './useSearchResults';
import { fetchSearchResults } from '../services/search-service';
import { notifyError } from '../utils/notify';

jest.mock('../services/search-service');
jest.mock('../utils/notify');

const mockedFetchSearchResults = fetchSearchResults as jest.Mock;
const mockedNotifyError = notifyError as jest.Mock;

describe('useSearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useSearchResults());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.searchPhrase).toBe('');
  });

  it('should fetch results successfully', async () => {
    const mockResponse = {
      TotalNumberOfResults: 1,
      Page: 1,
      PageSize: 10,
      ResultItems: [],
    };

    mockedFetchSearchResults.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSearchResults());

    await act(async () => {
      await result.current.fetchResults('child care');
    });

    expect(mockedFetchSearchResults).toHaveBeenCalledWith('child care');
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.searchPhrase).toBe('child care');
    expect(result.current.loading).toBe(false);
  });

  it('should handle fetch error and notify', async () => {
    mockedFetchSearchResults.mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useSearchResults());

    await act(async () => {
      await result.current.fetchResults('error case');
    });

    expect(mockedNotifyError).toHaveBeenCalledWith(
      'Error',
      'Failed to fetch search results'
    );

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

});
