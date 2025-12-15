import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './index';

jest.mock('../../hooks/useSuggestions', () => ({
  useSuggestions: () => ({
    suggestions: ['child care', 'child support'],
    symnonyms: ['baby', 'infant'],
    clearSuggestions: jest.fn(),
    fetchDebouncedSuggestions: jest.fn(),
  }),
}));

describe('SearchBar', () => {
  const onSearch = jest.fn();
  const onClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<SearchBar onSearch={onSearch} onClear={onClear} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows clear button and clears input on click', () => {
    render(<SearchBar onSearch={onSearch} onClear={onClear} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'child' },
    });

    fireEvent.click(screen.getByLabelText('clear-search'));

    expect(onClear).toHaveBeenCalled();
  });

  it('calls onSearch when pressing Enter with no active suggestion', () => {
    render(<SearchBar onSearch={onSearch} onClear={onClear} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'child' },
    });

    fireEvent.keyDown(screen.getByRole('textbox'), {
      key: 'Enter',
      code: 'Enter',
    });

    expect(onSearch).toHaveBeenCalledWith('child');
  });

  it('selects suggestion using keyboard and triggers onSearch', () => {
    render(<SearchBar onSearch={onSearch} onClear={onClear} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, {
      target: { value: 'child' },
    });

    fireEvent.keyDown(input, { key: 'ArrowDown' });

    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onSearch).toHaveBeenCalledWith('child care');
  });

  it('renders DropdownSuggestion when dropdown is open and has data', () => {
    render(<SearchBar onSearch={onSearch} onClear={onClear} />);

    fireEvent.focus(screen.getByRole('textbox'));

    expect(screen.getByLabelText('suggestion-dropdown')).toBeInTheDocument();
  });
});
