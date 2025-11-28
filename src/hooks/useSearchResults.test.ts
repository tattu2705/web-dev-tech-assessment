// useSearchResults.test.ts
import { renderHook, act } from '@testing-library/react';
import { useSearchResults } from './useSearchResults';
import { fetchSearchResults } from '../services/search-service';
import { ApiResponse } from '../types/promise-type';

jest.mock('../services/search-service');
const mockedFetch = fetchSearchResults as jest.MockedFunction<typeof fetchSearchResults>;

describe('useSearchResults hook', () => {
  const mockData: ApiResponse = {
    TotalNumberOfResults: 2,
    Page: 1,
    PageSize: 10,
    ResultItems: [{ id: 1, title: 'A' }, { id: 2, title: 'B' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSearchResults());
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should not call fetchSearchResults with empty keyword', async () => {
    const { result } = renderHook(() => useSearchResults());

    await act(async () => {
      await result.current.search('   ');
    });

    expect(mockedFetch).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should fetch data successfully', async () => {
    mockedFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() => useSearchResults());

    await act(async () => {
      const promise = result.current.search('test');
      await promise;
    });

    expect(mockedFetch).toHaveBeenCalledWith('test');
    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
  });

  it('should handle fetch error', async () => {
    mockedFetch.mockRejectedValue(new Error('Fetch failed'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useSearchResults());

    await act(async () => {
      await result.current.search('error-test');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Fetch error:', expect.any(Error));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should clear data', () => {
    const { result } = renderHook(() => useSearchResults());

    act(() => result.current.clear());

    expect(result.current.data).toBeNull();
  });
});
