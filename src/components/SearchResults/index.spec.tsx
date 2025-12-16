import { render, screen } from '@testing-library/react';
import SearchResult from './index';

// mock highlight util
jest.mock('../../utils/highlight/highlight-text', () => ({
  renderWithHighlights: jest.fn(() => <span>highlighted text</span>),
}));

describe('SearchResult', () => {
  const baseProps = {
    total: 1,
    page: 1,
    pageSize: 10,
    searchKeyword: 'child',
  };

  const mockResults = [{
    "DocumentId": "8f09d0d0898e5470189120415158f7b5",
    "DocumentTitle": {
      "Text": "Child Care Policy",
      "Highlights": [{
        "BeginOffset": 9,
        "EndOffset": 14
      }]
    },
    "DocumentExcerpt": {
      "Text": "This document is about child care.",
      "Highlights": [{
        "BeginOffset": 31,
        "EndOffset": 36
      },
      {
        "BeginOffset": 106,
        "EndOffset": 111
      },
      {
        "BeginOffset": 133,
        "EndOffset": 138
      },
      {
        "BeginOffset": 167,
        "EndOffset": 172
      },
      {
        "BeginOffset": 223,
        "EndOffset": 228
      }
      ]
    },
    "DocumentURI": "https://example.com/doc1"
  },
  ]

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders results correctly when results exist', () => {
    render(
      <SearchResult
        {...baseProps}
        results={mockResults}
      />
    );

    // Showing info
    expect(
      screen.getByText('Showing 1-1 of 1 result')
    ).toBeInTheDocument();

    // Title link
    const titleLink = screen.getByRole('link', {
      name: 'Child Care Policy',
    });

    expect(titleLink).toHaveAttribute(
      'href',
      'https://example.com/doc1'
    );

    // Highlighted excerpt
    expect(screen.getByText('highlighted text')).toBeInTheDocument();

    // URI
    expect(
      screen.getByText('https://example.com/doc1')
    ).toBeInTheDocument();
  });

  it('calls renderWithHighlights with correct arguments', () => {
    const { renderWithHighlights } =
      require('../../utils/highlight/highlight-text');

    render(
      <SearchResult
        {...baseProps}
        results={mockResults}
      />
    );

    expect(renderWithHighlights).toHaveBeenCalledWith(
      'This document is about child care.',
      'child'
    );
  });

  it('shows not found message when no results', () => {
    render(
      <SearchResult
        {...baseProps}
        total={0}
        results={[]}
      />
    );

    expect(
      screen.getByTestId('error-msg')
    ).toBeInTheDocument();

    expect(
      screen.getByText(/No results found for your search/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText('"child"')
    ).toBeInTheDocument();
  });
});
