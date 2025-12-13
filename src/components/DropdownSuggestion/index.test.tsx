import { render, screen, fireEvent } from "@testing-library/react";
import DropdownSuggestion from "../DropdownSuggestion";

describe("DropdownSuggestion", () => {
  const suggestions = [
    "apple",
    "banana",
    "cat",
    "dog",
    "elephant",
    "fish",
  ];

  const setup = (props = {}) => {
    const defaultProps = {
      keyword: "app",
      suggestions,
      visible: true,
      highlightIndex: -1,
      onSelect: jest.fn(),
      onHover: jest.fn(),
      onCloseSuggestion: jest.fn(),
      ...props,
    };
    return render(<DropdownSuggestion {...defaultProps} />);
  };

  test("does not render when visible = false", () => {
    setup({ visible: false });
    expect(screen.queryByText("apple")).toBeNull();
  });

  test("does not render when keyword length < 3", () => {
    setup({ keyword: "a" });
    expect(screen.queryByText("apple")).toBeNull();
  });

  test("renders max 6 suggestions only", () => {
    setup();
    const items = screen.getAllByText(/./);
    expect(items.length).toBe(6);
  });

  test("calls onSelect when suggestion is clicked", () => {
    const onSelect = jest.fn();
    setup({ onSelect });

    fireEvent.click(screen.getByText("apple"));
    expect(onSelect).toHaveBeenCalledWith("apple");
  });

  test("calls onHover when mouse enters suggestion", () => {
    const onHover = jest.fn();
    setup({ onHover });

    fireEvent.mouseEnter(screen.getByText("banana"));
    expect(onHover).toHaveBeenCalledWith(1);
  });

  test("applies highlight style for highlightIndex", () => {
    setup({ highlightIndex: 0 });
    const first = screen.getByText("apple");

    expect(first).toHaveStyle("background: #f0f7ff");
  });
});
