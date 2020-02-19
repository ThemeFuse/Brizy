// @ts-nocheck

import { times, identity } from "underscore";
import { testGetterValidation } from "visual/utils/model/utilities.test";
import {
  getExtension,
  getHeight,
  getSrc,
  getWidth,
  getX,
  getY,
  Image,
  patchExtension,
  patchHeight,
  patchSrc,
  patchWidth,
  patchX,
  patchY
} from "visual/component/Options/types/dev/ImageUpload/model";
import { testPatchFunction } from "visual/utils/patch/index.test";

const validExtension = ["jpg", "png"];
const invalidExtension = [undefined, null, 1, {}];

const validSrc = ["test.jpg", "test2.png"];
const invalidSrc = [undefined, null, 1, {}];

const validPositive = times(100, identity);
const invalidPositive = [null, undefined, "1", -1];

const image: Image = {
  src: "test.jpg",
  extension: "jpg",
  width: 300,
  height: 300,
  x: 50,
  y: 50
};

describe("Testing 'getExtension' function", function() {
  testGetterValidation(
    getExtension,
    "extension",
    validExtension,
    invalidExtension
  );
});

describe("Testing 'patchExtension' function", function() {
  testPatchFunction(
    patchExtension,
    getExtension,
    validExtension,
    invalidExtension
  );

  test("Should patch empty string", () => {
    expect(patchExtension("", image)).toMatchObject({ extension: "" });
  });
});

describe("Testing 'getSrc' function", function() {
  testGetterValidation(getSrc, "src", validSrc, invalidSrc);
});

describe("Testing 'patchSrc' function", function() {
  testPatchFunction(patchSrc, getSrc, validSrc, invalidSrc);

  test("Should patch empty string", () => {
    expect(patchSrc("", image)).toMatchObject({ src: "" });
  });
});

describe("Testing 'getWidth' function", function() {
  testGetterValidation(getWidth, "width", validPositive, invalidPositive);
});

describe("Testing 'patchWidth' function", function() {
  testPatchFunction(patchWidth, getWidth, validPositive, invalidPositive);
});

describe("Testing 'getHeight' function", function() {
  testGetterValidation(getHeight, "height", validPositive, invalidPositive);
});

describe("Testing 'patchHeight' function", function() {
  testPatchFunction(patchHeight, getHeight, validPositive, invalidPositive);
});

describe("Testing 'getX' function", function() {
  testGetterValidation(getX, "x", validPositive, invalidPositive);
});

describe("Testing 'patchX' function", function() {
  testPatchFunction(patchX, getX, validPositive, invalidPositive);
});

describe("Testing 'getY' function", function() {
  testGetterValidation(getY, "y", validPositive, invalidPositive);
});

describe("Testing 'patchY' function", function() {
  testPatchFunction(patchY, getY, validPositive, invalidPositive);
});
