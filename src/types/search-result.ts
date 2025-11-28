export interface Highlight {
  BeginOffset: number;
  EndOffset: number;
}

export interface ResultItem {
  DocumentId: string;
  DocumentTitle: {
    Text: string;
    Highlights: Highlight[];
  };
  DocumentExcerpt: {
    Text: string;
    Highlights: Highlight[];
  };
  DocumentURI: string;
}

export interface SearchResultProps {
  total: number;
  page: number;
  pageSize: number;
  results: ResultItem[];
}