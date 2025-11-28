// fetchSearchResults.test.ts
import { fetchSearchResults } from "./search-service";
import { ApiResponse } from "../types/promise-type";

const mockResponse: ApiResponse = {
  TotalNumberOfResults: 2,
  Page: 1,
  PageSize: 10,
  ResultItems: [{ id: 1, title: "Test" }, { id: 2, title: "Demo" }],
};

describe("fetchSearchResults", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return data when fetch succeeds", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    } as any);

    const result = await fetchSearchResults("test");
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json"
    );
  });

  it("should throw an error when response.ok is false", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    } as any);

    await expect(fetchSearchResults("test")).rejects.toThrow(
      "Failed to fetch search results"
    );
  });

  it("should throw an error on network failure", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(fetchSearchResults("test")).rejects.toThrow("Network error");
  });
});
