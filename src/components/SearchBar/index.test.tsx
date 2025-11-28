import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../SearchBar";
import "@testing-library/jest-dom";

describe("SearchBar", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      value: "",
      onChange: jest.fn(),
      onSearch: jest.fn(),
      onKeyDown: jest.fn(),
      onClear: jest.fn(),
      placeholder: "Search...",
      allowClear: true,
      ...props,
    };
    return render(<SearchBar {...defaultProps} />);
  };

  test("renders without crashing", () => {
    setup();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  test("renders correct value", () => {
    setup({ value: "hello" });
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
  });

  test("calls onChange when typing", () => {
    const onChange = jest.fn();
    setup({ onChange });

    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "hi" } });

    expect(onChange).toHaveBeenCalledWith("hi");
  });

  test("calls onSearch when pressing Enter", () => {
    const onSearch = jest.fn();
    setup({ onSearch });

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSearch).toHaveBeenCalled();
  });

  test("calls onKeyDown event", () => {
    const onKeyDown = jest.fn();
    setup({ onKeyDown });

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.keyDown(input, { key: "A" });
    expect(onKeyDown).toHaveBeenCalled();
  });

  test("calls onClear when clear button clicked", () => {
    const onClear = jest.fn();
    setup({ value: "abc", onClear });

    const buttons = screen.getAllByRole("button");

    const clearBtn = buttons.find(btn => btn.getAttribute("aria-label") === null);

    fireEvent.click(clearBtn!);
    expect(onClear).toHaveBeenCalled();
  });

});
