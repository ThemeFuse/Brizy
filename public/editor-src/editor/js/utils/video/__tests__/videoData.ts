import getVideoData from "../videoData";

describe("Testing 'getVideoData' function", () => {
  describe("YouTube URLs", () => {
    test("standard watch URL", () => {
      const result = getVideoData(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      );
      expect(result).toEqual({ type: "youtube", key: "dQw4w9WgXcQ" });
    });

    test("short youtu.be URL", () => {
      const result = getVideoData("https://youtu.be/dQw4w9WgXcQ");
      expect(result).toEqual({ type: "youtube", key: "dQw4w9WgXcQ" });
    });

    test("embed URL", () => {
      const result = getVideoData("https://www.youtube.com/embed/dQw4w9WgXcQ");
      expect(result).toEqual({ type: "youtube", key: "dQw4w9WgXcQ" });
    });

    test("shorts URL is converted to embed format", () => {
      const result = getVideoData("https://www.youtube.com/shorts/dQw4w9WgXcQ");
      expect(result).toEqual({ type: "youtube", key: "dQw4w9WgXcQ" });
    });

    test("URL with extra query params", () => {
      const result = getVideoData(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120"
      );
      expect(result).toEqual({ type: "youtube", key: "dQw4w9WgXcQ" });
    });
  });

  describe("Vimeo URLs", () => {
    test("standard vimeo URL", () => {
      const result = getVideoData("https://vimeo.com/123456789");
      expect(result).toEqual({ type: "vimeo", key: "123456789" });
    });

    test("vimeo player URL", () => {
      const result = getVideoData("https://player.vimeo.com/video/123456789");
      expect(result).toEqual({ type: "vimeo", key: "123456789" });
    });
  });

  describe("returns undefined for non-matching URLs", () => {
    test("direct mp4 URL", () => {
      expect(getVideoData("https://example.com/video.mp4")).toBeUndefined();
    });

    test("empty string", () => {
      expect(getVideoData("")).toBeUndefined();
    });

    test("random string", () => {
      expect(getVideoData("not a video url")).toBeUndefined();
    });

    test("YouTube domain without valid key", () => {
      expect(getVideoData("https://www.youtube.com/")).toBeUndefined();
    });
  });
});
