import { detectVideoType } from "../detectVideoType";

describe("Testing 'detectVideoType' function", () => {
  test("returns 'youtube' for YouTube URLs", () => {
    expect(detectVideoType("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "youtube"
    );
    expect(detectVideoType("https://youtu.be/dQw4w9WgXcQ")).toBe("youtube");
    expect(detectVideoType("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "youtube"
    );
    expect(detectVideoType("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "youtube"
    );
  });

  test("returns 'vimeo' for Vimeo URLs", () => {
    expect(detectVideoType("https://vimeo.com/123456789")).toBe("vimeo");
    expect(detectVideoType("https://player.vimeo.com/video/123456789")).toBe(
      "vimeo"
    );
  });

  test("returns 'custom' for direct video URLs", () => {
    expect(detectVideoType("https://example.com/video.mp4")).toBe("custom");
    expect(detectVideoType("https://cdn.site.com/media/clip.webm")).toBe(
      "custom"
    );
    expect(detectVideoType("https://mysite.com/videos/intro.ogg")).toBe(
      "custom"
    );
    expect(detectVideoType("http://example.com/stream")).toBe("custom");
  });

  test("returns undefined for empty or invalid input", () => {
    expect(detectVideoType("")).toBeUndefined();
    expect(detectVideoType("not a url")).toBeUndefined();
  });
});
