import { urlContainsQueryString } from "../utils";

describe("Testing 'urlContainsQueryString' function", () => {
  const urls = [
    { url: "", expected: false },
    { url: "    ", expected: false },
    {
      url: "https://example.com",
      expected: false
    },
    {
      url: "https://example.com?",
      expected: true
    },
    {
      url: "https://example.com?query=1",
      expected: true
    },
    {
      url: "https://example.com#hash",
      expected: false
    },
    {
      url: "https://example.com?query=1#hash",
      expected: true
    }
  ];

  test.each(urls)("On %p, return %p", ({ url, expected }) => {
    expect(urlContainsQueryString(url)).toBe(expected);
  });
});
