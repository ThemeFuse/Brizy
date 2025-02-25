import { DataUrl, ResizeData } from "visual/utils/image/types";
import {
  generateUrl,
  getPlaceholders,
  replacePlaceholders
} from "visual/utils/image/utils";

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

describe("replacePlaceholders", () => {
  test("should replace placeholders in the pattern with actual values 1", () => {
    const options: ResizeData = {
      pattern:
        "{{ [baseUrl] }}/?brizy_media={{ [fileName] }}&brizy_crop={{ [sizeType] }}",
      baseUrl: "https://brizy.local",
      fileName: "some-image.jpg",
      uid: "123",
      sizeType: "original",
      crop: { iW: 500, iH: 500, oX: 100, oY: 0, cW: 400, cH: 450 }
    };

    const result = replacePlaceholders(options);
    expect(result).toBe(
      "https://brizy.local/?brizy_media=some-image.jpg&brizy_crop=original"
    );
  });

  test("should replace placeholders in the pattern with actual values 2", () => {
    const options: ResizeData = {
      pattern:
        "{{ [baseUrl] }}/?brizy_media={{ [fileName] }}&brizy_crop={{ iW%3D[iW] }}%26{{ iH%3D[iH] }}%26{{ oX%3D[oX]  }}%26{{ oY%3D[oY] }}%26{{ cW%3D[cW] }}%26{{ cH%3D[cH] }}%26{{ 123=[123] }}",
      baseUrl: "https://brizy.local",
      fileName: "some-image.jpg",
      uid: "123",
      sizeType: "custom",
      crop: { iW: 500, iH: 500, oX: 100, oY: 0, cW: 400, cH: 450 }
    };

    const result = replacePlaceholders(options);
    expect(result).toBe(
      "https://brizy.local/?brizy_media=some-image.jpg&brizy_crop=iW%3D500%26iH%3D500%26oX%3D100%26oY%3D0%26cW%3D400%26cH%3D450%26123=[123]"
    );
  });

  test("should replace placeholders in the pattern with actual values 3", () => {
    const options: ResizeData = {
      pattern:
        "{{ [baseUrl] }}/?brizy_media={{ [fileName] }}&brizy_crop={{ iW%3D[iW] }}%26{{ iH%3D[iH] }}",
      baseUrl: "https://brizy.local",
      fileName: "",
      uid: "123",
      sizeType: "custom",
      crop: { iW: 500, iH: "any", oX: 100, oY: 0, cW: 400, cH: 450 }
    };

    const result = replacePlaceholders(options);
    expect(result).toBe(
      "https://brizy.local/?brizy_media=&brizy_crop=iW%3D500%26iH%3Dany"
    );
  });

  test("should replace placeholders in the pattern with actual values if they exist", () => {
    const options: ResizeData = {
      pattern:
        "{{ [baseUrl] }}/?brizy_media={{ [fileName____] }}&brizy_crop={{ i____%3D[iW] }}%26{{ i____%3D[iH] }}",
      baseUrl: "https://brizy.local",
      fileName: "some-image.jpg",
      uid: "123",
      sizeType: "custom",
      crop: { iW: 500, iH: "any", oX: 100, oY: 0, cW: 400, cH: 450 }
    };

    const result = replacePlaceholders(options);
    expect(result).toBe(
      "https://brizy.local/?brizy_media=[fileName____]&brizy_crop=i____%3D500%26i____%3Dany"
    );
  });

  test("should replace placeholders in the pattern with actual values if they exist 2", () => {
    const options: ResizeData = {
      pattern:
        "{{ [baseUrl] }}/?brizy_media={{ [fileName] }}&xxx={{ zxc[cxz] }}&brizy_crop={{ iW%3D[iWw] }}%26{{ iH%3D[iHh] }}",
      baseUrl: "https://brizy.local",
      fileName: "some-image.jpg",
      uid: "123",
      sizeType: "custom",
      crop: { iW: 500, iH: "any", oX: 100, oY: 0, cW: 400, cH: 450 }
    };

    const result = replacePlaceholders(options);
    expect(result).toBe(
      "https://brizy.local/?brizy_media=some-image.jpg&xxx=zxc[cxz]&brizy_crop=iW%3D[iWw]%26iH%3D[iHh]"
    );
  });

  test("testing stripWWW param, should preserve www", () => {
    const options: ResizeData = {
      pattern: "{{ [baseUrl] }}",
      baseUrl: "https://www.brizy.local",
      fileName: "image.jpg",
      uid: "1",
      sizeType: "custom",
      crop: { iW: 500, iH: "any" }
    };

    const result = replacePlaceholders(options);
    expect(result).toBe("https://www.brizy.local");
  });

  test("testing stripWWW param with more baseUrl params, should preserve www", () => {
    const options: ResizeData = {
      pattern:
        "{{ [baseUrl] }}/brizy_crop={{ iW%3D[iW] }}%26{{ iH%3D[iH] }}%26{{ oX%3D[oX]  }}%26{{ oY%3D[oY] }}%26{{ cW%3D[cW] }}%26{{ cH%3D[cH] }}%26{{ 123=[123] }}",
      baseUrl: "https://www.brizy.local",
      fileName: "image.jpg",
      uid: "1",
      sizeType: "custom",
      crop: { iW: 500, iH: "any", oX: 50, oY: 60, cW: 70, cH: 80 }
    };

    const result = replacePlaceholders(options);
    expect(result).toBe(
      "https://www.brizy.local/brizy_crop=iW%3D500%26iH%3Dany%26oX%3D50%26oY%3D60%26cW%3D70%26cH%3D80%26123=[123]"
    );
  });
});

test("testing removeTrailingSlash param, should preserve trailingSlash", () => {
  const options: ResizeData = {
    pattern:
      "{{ [baseUrl] }}/?brizy_media={{ [fileName] }}&brizy_crop={{ [sizeType] }}",
    baseUrl: "https://www.brizy.local/media",
    fileName: "image.jpg",
    sizeType: "custom"
  };

  const result = replacePlaceholders(options);
  expect(result).toBe(
    "https://www.brizy.local/media/?brizy_media=image.jpg&brizy_crop=custom"
  );
});

describe("generateUrl", () => {
  test("should generate valid url", () => {
    const options: DataUrl = {
      baseUrl: "https://test-beta1.b-cdn.net/media",
      fileName: "image.jpg",
      patterns: {
        full: "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}&{{ oX=…cW] }}&{{ cH=[cH] }}/{{ [uid] }}/{{ [fileName] }}/{{ [A] }}",
        split:
          "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}/{{ [uid] }}/{{ [fileName] }}/{{ [A] }}",
        original:
          "{{ [baseUrl] }}/{{ [sizeType] }}/{{ [uid] }}/{{ [fileName] }}/{{ [A] }}"
      },
      sizeType: "custom",
      uid: "d03-Color-2-1"
    };

    const result = generateUrl(options);
    expect(result).toBe(
      "https://test-beta1.b-cdn.net/media/iW=5000&iH=any/d03-Color-2-1/image.jpg/[A]"
    );
  });

  test("should generate valid url 2", () => {
    const options: DataUrl = {
      baseUrl: "https://test-beta1.b-cdn.net/media",
      uid: "f3ec03db44d2c32dcc395ab8e833ae27",
      fileName: "f3ec03db44d2c32dcc395ab8e833ae27.jpg",
      sizeType: "custom",
      patterns: {
        full: "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}&{{ oX=[oX] }}&{{ oY=[oY] }}&{{ cW=[cW] }}&{{ cH=[cH] }}/{{ [uid] }}/{{ [fileName] }}",
        split:
          "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}/{{ [uid] }}/{{ [123Xx~.] }}/{{ [fileName] }}",
        original:
          "{{ [baseUrl] }}/{{ [sizeType] }}/{{ [uid] }}/{{ [123Xx~.] }}/{{ [fileName] }}"
      }
    };

    const result = generateUrl(options);
    expect(result).toBe(
      "https://test-beta1.b-cdn.net/media/iW=5000&iH=any/f3ec03db44d2c32dcc395ab8e833ae27/[123Xx~.]/f3ec03db44d2c32dcc395ab8e833ae27.jpg"
    );
  });

  test("should generate valid url 3", () => {
    const options: DataUrl = {
      baseUrl: "https://beta1.brizydemo.com/media",
      fileName: "dcb951568c02c72d72903d0218e67547.jpg",
      sizeType: "custom",
      patterns: {
        full: "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}&{{ oX=[oX] }}&{{ oY=[oY] }}&{{ cW=[cW] }}&{{ cH=[cH] }}/{{ [uid] }}/{{ [fileName] }}",
        split:
          "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}/{{ [uid] }}/{{ [fileName] }}",
        original:
          "{{ [baseUrl] }}/{{ [sizeType] }}/{{ [uid] }}/{{ [fileName] }}"
      },
      crop: { iW: 1540, iH: 1074, oX: 0, oY: 172, cW: 1110, cH: 902 }
    };

    const result = generateUrl(options);
    expect(result).toBe(
      "https://beta1.brizydemo.com/media/iW=1540&iH=1074&oX=0&oY=172&cW=1110&cH=902/dcb951568c02c72d72903d0218e67547.jpg"
    );
  });

  test("should generate valid url 4", () => {
    const options: DataUrl = {
      baseUrl: "https://beta1.brizydemo.com/media",
      uid: "dcb951568c02c72d72903d0218e67547",
      fileName: "dcb951568c02c72d72903d0218e67547.jpg",
      sizeType: "custom",
      patterns: {
        full: "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}&{{ oX=[oX] }}&{{ oY=[oY] }}&{{ cW=[cW] }}&{{ cH=[cH] }}/{{ [uid] }}/{{ [fileName] }}/{{ [zxc] }}",
        split:
          "{{ [baseUrl] }}/{{ iW=[iW] }}&{{ iH=[iH] }}/{{ [uid] }}/{{ [fileName] }}/{{ [zxc] }}",
        original:
          "{{ [baseUrl] }}/{{ [sizeType] }}/{{ [uid] }}/{{ [fileName] }}/{{ [zxc] }}"
      },
      crop: { iW: 1540, iH: "any" }
    };

    const result = generateUrl(options);
    expect(result).toBe(
      "https://beta1.brizydemo.com/media/iW=1540&iH=any/dcb951568c02c72d72903d0218e67547/dcb951568c02c72d72903d0218e67547.jpg/[zxc]"
    );
  });
});
