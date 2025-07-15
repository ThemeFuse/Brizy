import { parseUrlParameters } from "../parseUrlParameters";

describe("parseUrlParameters", () => {
  describe("Basic URL parsing", () => {
    it("should return empty object for URL without parameters", () => {
      expect(parseUrlParameters("https://example.com")).toEqual({});
      expect(parseUrlParameters("https://example.com/")).toEqual({});
      expect(parseUrlParameters("https://example.com/path")).toEqual({});
    });

    it("should parse single parameter", () => {
      expect(parseUrlParameters("https://example.com?name=value")).toEqual({
        name: "value"
      });
    });

    it("should parse multiple parameters", () => {
      expect(
        parseUrlParameters("https://example.com?param1=value1&param2=value2")
      ).toEqual({
        param1: "value1",
        param2: "value2"
      });
    });

    it("should parse multiple parameters, test2", () => {
      expect(
        parseUrlParameters(
          "https://example.com/shop/search?inventory=instock&attribute_Brand=Brand+SAMPLE.+Black+Dress&attribute_Custom+Attr=Custom+attribute+SAMPLE.+Black+Dress"
        )
      ).toEqual({
        inventory: "instock",
        attribute_Brand: "Brand SAMPLE. Black Dress",
        "attribute_Custom Attr": "Custom attribute SAMPLE. Black Dress"
      });
    });
  });

  describe("Parameter value handling", () => {
    it("should handle numeric values as strings", () => {
      expect(parseUrlParameters("https://example.com?num=123")).toEqual({
        num: "123"
      });
      expect(parseUrlParameters("https://example.com?num=-3.14")).toEqual({
        num: "-3.14"
      });
    });

    it("should handle boolean-like values as strings", () => {
      expect(parseUrlParameters("https://example.com?flag=true")).toEqual({
        flag: "true"
      });
      expect(parseUrlParameters("https://example.com?flag=false")).toEqual({
        flag: "false"
      });
    });

    it("should handle empty parameter values", () => {
      expect(parseUrlParameters("https://example.com?empty=")).toEqual({
        empty: ""
      });
    });

    it("should preserve encoded characters", () => {
      expect(
        parseUrlParameters("https://example.com?query=hello%20world")
      ).toEqual({ query: "hello world" });
      expect(
        parseUrlParameters("https://example.com?symbol=%24%26%40")
      ).toEqual({ symbol: "$&@" });
    });
  });

  describe("Edge cases", () => {
    it("should handle multiple parameters with same name (last value wins)", () => {
      expect(
        parseUrlParameters("https://example.com?repeat=1&repeat=2")
      ).toEqual({ repeat: "2" });
    });

    it("should handle parameters without values", () => {
      expect(parseUrlParameters("https://example.com?novalue")).toEqual({
        novalue: ""
      });
    });

    it("should handle complex URLs with ports and paths", () => {
      expect(
        parseUrlParameters(
          "https://example.com:8080/path/to/resource?param=value"
        )
      ).toEqual({
        param: "value"
      });
    });

    it("should handle special characters in parameter names", () => {
      expect(parseUrlParameters("https://example.com?%24name=value")).toEqual({
        $name: "value"
      });
    });

    it("should handle very long parameter values", () => {
      const longValue = "a".repeat(1000);
      expect(
        parseUrlParameters(`https://example.com?long=${longValue}`)
      ).toEqual({
        long: longValue
      });
    });
  });

  describe("Error handling", () => {
    it("should throw error for invalid URLs", () => {
      expect(() => parseUrlParameters("not-a-url")).toThrow();
      expect(() => parseUrlParameters("")).toThrow();
      expect(() => parseUrlParameters("http://?param=value")).toThrow();
    });
  });

  describe("Type safety", () => {
    it("should maintain correct TypeScript types", () => {
      const result = parseUrlParameters(
        "https://example.com?str=text&num=123&bool=true"
      );
      // These type assertions would be caught by TypeScript compiler
      expect(typeof result.str).toBe("string");
      expect(typeof result.num).toBe("string");
      expect(typeof result.bool).toBe("string");
    });
  });
});
