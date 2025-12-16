import SearchBar from "@/components/SearchBar";
import SearchResult from "@/components/SearchResults";
import { Spin } from "antd";
import { useSearchResults } from "@/hooks/useSearchResults";
import Banner from "@/components/Banner";
import "./index.css";

const HomePage = () => {
  const { data, loading, fetchResults, searchPhrase } = useSearchResults();

  const handleSearch = async (value: string) => {
    await fetchResults(value);
  };

  return (
    <div>
      <div className="header-shadow">
        <Banner />
        <div className="homepage-search-inner">
          <SearchBar
            onSearch={handleSearch}
          />

        </div>
      </div>

      {loading && (
        <div className="homepage-loading">
          <Spin />
        </div>
      )}

      {!loading && data && (
        <SearchResult
          total={data.TotalNumberOfResults}
          page={data.Page}
          pageSize={data.PageSize}
          results={data.ResultItems}
          searchKeyword={searchPhrase}
        />
      )}
    </div>
  );
};

export default HomePage;
