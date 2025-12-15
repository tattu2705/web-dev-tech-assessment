import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from './index';
import { useSearchResults } from '../../hooks/useSearchResults';

jest.mock('../../hooks/useSearchResults');

jest.mock('../../components/SearchBar', () => (props: any) => (
  <button
    data-testid="search-bar"
    onClick={() => props.onSearch('child')}
  >
    SearchBar
  </button>
));

jest.mock('../../components/SearchResults', () => (props: any) => (
  <div data-testid="search-result">
    Results: {props.total}
  </div>
));

jest.mock('../../components/Banner', () => () => (
  <div data-testid="banner">Banner</div>
));

jest.mock('antd', () => ({
  Spin: () => <div data-testid="spinner">Loading...</div>,
}));

//test

const mockFetchResults = jest.fn();
const mockClear = jest.fn();

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render banner and search bar', () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      fetchResults: mockFetchResults,
      searchPhrase: '',
      clear: mockClear,
    });

    render(<HomePage />);

    expect(screen.getByTestId('banner')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('should show loading spinner when loading is true', () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      fetchResults: mockFetchResults,
      searchPhrase: '',
      clear: mockClear,
    });

    render(<HomePage />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render SearchResult when data exists and not loading', () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      loading: false,
      fetchResults: mockFetchResults,
      searchPhrase: 'child',
      clear: mockClear,
      data: {
        TotalNumberOfResults: 10,
        Page: 1,
        PageSize: 10,
        ResultItems: [],
      },
    });

    render(<HomePage />);

    expect(screen.getByTestId('search-result')).toBeInTheDocument();
    expect(screen.getByText('Results: 10')).toBeInTheDocument();
  });

  it('should call fetchResults when search is triggered', () => {
    (useSearchResults as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      fetchResults: mockFetchResults,
      searchPhrase: '',
      clear: mockClear,
    });

    render(<HomePage />);

    fireEvent.click(screen.getByTestId('search-bar'));

    expect(mockFetchResults).toHaveBeenCalledWith('child');
  });
});
