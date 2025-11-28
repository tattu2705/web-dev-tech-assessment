import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from ".";

// Mock components
jest.mock("../../components/SearchBar", () => (props: any) => (
  <input
    data-testid="search-bar"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    onKeyDown={props.onKeyDown}
  />
));

jest.mock("../../components/DropdownSuggestion", () => (props: any) => (
  props.visible ? (
    <ul data-testid="dropdown">
      {props.suggestions.map((s: string, i: number) => (
        <li
          key={s}
          data-testid={`suggestion-${i}`}
          onClick={() => props.onSelect(s)}
          onMouseEnter={() => props.onHover(i)}
        >
          {s}
        </li>
      ))}
    </ul>
  ) : null
));

jest.mock("../../components/SearchResults", () => (props: any) => (
  <div data-testid="results">
    results: {props.total}
  </div>
));

// Mock hooks
const mockSearch = jest.fn();
jest.mock("../../hooks/useSuggestions", () => ({
  useSuggestions: () => ["apple", "banana", "apricot", "berry", "orange"],
}));

jest.mock("../../hooks/useSearchResults", () => ({
  useSearchResults: () => ({
    loading: false,
    data: {
      TotalNumberOfResults: 5,
      Page: 1,
      PageSize: 10,
      ResultItems: [],
    },
    search: mockSearch,
  }),
}));

describe("HomePage", () => {

  beforeEach(() => {
    mockSearch.mockClear();
  });

  test("renders main UI elements", () => {
    render(<HomePage />);
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  test("shows dropdown when typing >=3 chars", () => {
    render(<HomePage />);

    const input = screen.getByTestId("search-bar");
    fireEvent.change(input, { target: { value: "app" } });

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    expect(screen.getByTestId("suggestion-0").textContent).toBe("apple");
  });

  test("press Enter triggers search()", async () => {
    render(<HomePage />);

    const input = screen.getByTestId("search-bar");
    fireEvent.change(input, { target: { value: "hello" } });

    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith("hello");
    });
  });

  test("selecting suggestion triggers search()", async () => {
    render(<HomePage />);

    const input = screen.getByTestId("search-bar");
    fireEvent.change(input, { target: { value: "app" } });

    fireEvent.click(screen.getByTestId("suggestion-0"));

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith("apple");
    });
  });

  test("renders SearchResult when data available", () => {
    render(<HomePage />);

    expect(screen.getByTestId("results")).toHaveTextContent("results: 5");
  });

});
