import { getFileFormat } from "../utils";

describe("getFileFormat", () => {
  it("returns the correct file format when a valid file path is provided", () => {
    const imagePath = "/path/to/image.jpg";
    const expectedFormat = "jpg";
    expect(getFileFormat(imagePath)).toBe(expectedFormat);
  });

  it("returns undefined for empty input", () => {
    expect(getFileFormat("")).toBeUndefined();
  });

  it("handles file paths with multiple dots correctly", () => {
    const filePath = "/path/to/image.with.dots.jpg";
    const expectedFormat = "jpg";
    expect(getFileFormat(filePath)).toBe(expectedFormat);
  });

  it("ignores leading and trailing spaces in the file path", () => {
    const filePathWithSpaces = "   /path/to/image.png    ";
    const expectedFormat = "png";
    expect(getFileFormat(filePathWithSpaces)).toBe(expectedFormat);
  });

  it("handles uppercase file extensions by converting to lowercase", () => {
    const filePathWithUppercaseExt = "/path/to/IMAGE.JPG";
    const expectedFormat = "jpg";
    expect(getFileFormat(filePathWithUppercaseExt)).toBe(expectedFormat);
  });
});
