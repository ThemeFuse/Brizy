import { getPlaceholders } from "..";

describe("getPlaceholders", () => {
  test("should return placeholders", () => {
    const pattern =
      "http://brizy.local/?brizy_media={{ [fileName] }}&brizy_crop={{ iW%3D[iW] }}%26{{ iH%3D[iH] }}%26{{ oX%3D[oX]  }}%26{{ oY%3D[oY] }}%26{{ cW%3D[cW] }}%26{{ cH%3D[cH] }}";
    const result = getPlaceholders(pattern);

    expect(result).toStrictEqual([
      "[fileName]",
      "[iW]",
      "[iH]",
      "[oX]",
      "[oY]",
      "[cW]",
      "[cH]"
    ]);
  });

  test("should return placeholders 2", () => {
    const pattern =
      "http://brizy.local/?brizy_media={{ [fileName] }}&brizy_crop={{ [sizeType] }}";
    const result = getPlaceholders(pattern);

    expect(result).toStrictEqual(["[fileName]", "[sizeType]"]);
  });

  test("should return placeholders 3", () => {
    const pattern =
      "http://brizy.local/?brizy_media={{ [fileName] }}&brizy_crop={{ iW%3D[iW] }}%26{{ iH%3D[iH] }}";
    const result = getPlaceholders(pattern);

    expect(result).toStrictEqual(["[fileName]", "[iW]", "[iH]"]);
  });
});
