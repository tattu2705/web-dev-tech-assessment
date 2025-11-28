import React from "react";
import { render, screen } from "@testing-library/react";
import SearchResult from ".";

const mockResults = [
  {
    DocumentId: "1",
    DocumentTitle: {
      Text: "Child Care Services",
      Highlights: [],
    },
    DocumentExcerpt: {
      Text: "This is child care information",
      Highlights: [
        { BeginOffset: 8, EndOffset: 13 }, // "child"
      ],
    },
    DocumentURI: "https://example.com/doc1",
  },
  {
    DocumentId: "2",
    DocumentTitle: {
      Text: "Education Support",
      Highlights: [],
    },
    DocumentExcerpt: {
      Text: "Education program for children",
      Highlights: [],
    },
    DocumentURI: "https://example.com/doc2",
  },
];

describe("SearchResult Component", () => {
  test("renders correct summary text", () => {
    render(
      <SearchResult
        total={20}
        page={1}
        pageSize={10}
        results={mockResults}
      />
    );

    expect(
      screen.getByText("Showing 1-10 of 20 results")
    ).toBeInTheDocument();
  });

  test("renders document titles as clickable links", () => {
    render(
      <SearchResult
        total={2}
        page={1}
        pageSize={10}
        results={mockResults}
      />
    );

    const link = screen.getByRole("link", {
      name: "Child Care Services",
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com/doc1");
  });

  test("renders excerpts with highlights", () => {
    render(
      <SearchResult
        total={2}
        page={1}
        pageSize={10}
        results={mockResults}
      />
    );

    // Highlighted text should be rendered as <span>
    const highlighted = screen.getByText("child");
    expect(highlighted.tagName.toLowerCase()).toBe("span");
    expect(highlighted).toHaveStyle("font-weight: bold");
  });

  test("renders document URI", () => {
    render(
      <SearchResult
        total={2}
        page={1}
        pageSize={10}
        results={mockResults}
      />
    );

    expect(
      screen.getByText("https://example.com/doc1")
    ).toBeInTheDocument();
    expect(
      screen.getByText("https://example.com/doc2")
    ).toBeInTheDocument();
  });

  test("renders correct result count", () => {
    render(
      <SearchResult
        total={5}
        page={2}
        pageSize={2}
        results={mockResults}
      />
    );

    expect(
      screen.getByText("Showing 3-4 of 5 results")
    ).toBeInTheDocument();
  });
});
