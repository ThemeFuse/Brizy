// @ts-nocheck
import { Image } from "visual/component/Options/types/dev/ImageUpload/model";
import {
  patchImageData,
  patchPosition
} from "visual/component/Options/types/dev/ImageUpload/utils";
import {
  PositionPatch,
  ImageDataPatch
} from "visual/component/Options/types/dev/ImageUpload/Types";

describe("Testing 'patchImageData' function", function() {
  test("Patch only ImageData fields", () => {
    const m: Image = {
      src: "test.jpg",
      extension: "jpg",
      width: 100,
      height: 200,
      x: 30,
      y: 40
    };
    const newM = {
      ...m,
      src: "test2.jpg",
      x: 40
    };
    const patch: ImageDataPatch = {
      imageSrc: "test2.jpg",
      imageExtension: "jpg",
      imageWidth: 100,
      imageHeight: 200
    };

    expect(patchImageData(newM, m)).toEqual(patch);
  });
});

describe("Testing 'patchPosition' function", function() {
  test("Patch only position fields", () => {
    const m: Image = {
      src: "test.jpg",
      extension: "jpg",
      width: 100,
      height: 200,
      x: 30,
      y: 40
    };
    const newM = {
      ...m,
      src: "test2.jpg",
      x: 50
    };
    const patch: PositionPatch = {
      positionX: 50,
      positionY: 40
    };

    const newM2 = {
      ...m,
      src: "test2.jpg",
      y: 50
    };
    const patch2: PositionPatch = {
      positionX: 30,
      positionY: 50
    };

    expect(patchPosition(newM, m)).toEqual(patch);
    expect(patchPosition(newM2, m)).toEqual(patch2);
  });
});
