import { render, screen, fireEvent } from '@testing-library/react';
import DropdownSuggestion from './index';

// mock highlight util
jest.mock('../../utils/highlight/highlight-text', () => ({
  extractHighlightByKeyword: (text: string) => [
    { text, type: 'normal' }
  ]
}));

describe('DropdownSuggestion', () => {
  const baseProps = {
    keyword: 'child',
    suggestions: ['child care', 'child support'],
    synonyms: ['infant', 'baby'],
    highlightIndex: -1,
    onSelect: jest.fn(),
    onHover: jest.fn(),
    onCloseSuggestion: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders suggestions list', () => {
    render(<DropdownSuggestion {...baseProps} />);

    expect(screen.getByText('child care')).toBeInTheDocument();
    expect(screen.getByText('child support')).toBeInTheDocument();
  });

  it('renders synonyms section when provided', () => {
    render(<DropdownSuggestion {...baseProps} />);

    expect(screen.getByText('Other Results')).toBeInTheDocument();
    expect(screen.getByText('infant')).toBeInTheDocument();
    expect(screen.getByText('baby')).toBeInTheDocument();
  });

  it('calls onSelect when clicking a suggestion', () => {
    render(<DropdownSuggestion {...baseProps} />);

    fireEvent.click(screen.getByText('child care'));

    expect(baseProps.onSelect).toHaveBeenCalledWith('child care');
  });

  it('calls onSelect when clicking a synonym', () => {
    render(<DropdownSuggestion {...baseProps} />);

    fireEvent.click(screen.getByText('infant'));

    expect(baseProps.onSelect).toHaveBeenCalledWith('infant');
  });

  it('calls onHover when hovering suggestion', () => {
    render(<DropdownSuggestion {...baseProps} />);

    fireEvent.mouseEnter(screen.getByText('child support'));

    expect(baseProps.onHover).toHaveBeenCalledWith(1);
  });

  it('calls onCloseSuggestion when clicking outside', () => {
    render(
      <>
        <DropdownSuggestion {...baseProps} />
        <div data-testid="outside">Outside</div>
      </>
    );

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(baseProps.onCloseSuggestion).toHaveBeenCalled();
  });

  it('applies selected-item class when highlightIndex matches', () => {
    render(
      <DropdownSuggestion
        {...baseProps}
        highlightIndex={0}
      />
    );

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('selected-item');
  });
});
