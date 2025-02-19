// @ts-nocheck
import { identity } from "es-toolkit";
import { times } from "es-toolkit/compat";
import {
  Image,
  getExtension,
  getHeight,
  getSrc,
  getWidth,
  getX,
  getY,
  setExtension,
  setHeight,
  setSrc,
  setWidth,
  setX,
  setY
} from "visual/component/Options/types/dev/ImageUpload/model";
import {
  testGetterValidation,
  testSetterValidation
} from "visual/utils/model/utilities.test";

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

describe("Testing 'getExtension' function", function () {
  testGetterValidation(
    getExtension,
    "extension",
    validExtension,
    invalidExtension
  );
});

describe("Testing 'patchExtension' function", function () {
  testSetterValidation(
    setExtension,
    getExtension,
    {},
    validExtension,
    invalidExtension
  );

  test("Should patch empty string", () => {
    expect(setExtension("", image)).toMatchObject({ extension: "" });
  });
});

describe("Testing 'getSrc' function", function () {
  testGetterValidation(getSrc, "src", validSrc, invalidSrc);
});

describe("Testing 'patchSrc' function", function () {
  testSetterValidation(setSrc, getSrc, {}, validSrc, invalidSrc);

  test("Should patch empty string", () => {
    expect(setSrc("", image)).toMatchObject({ src: "" });
  });
});

describe("Testing 'getWidth' function", function () {
  testGetterValidation(getWidth, "width", validPositive, invalidPositive);
});

describe("Testing 'patchWidth' function", function () {
  testSetterValidation(setWidth, getWidth, {}, validPositive, invalidPositive);
});

describe("Testing 'getHeight' function", function () {
  testGetterValidation(getHeight, "height", validPositive, invalidPositive);
});

describe("Testing 'patchHeight' function", function () {
  testSetterValidation(
    setHeight,
    getHeight,
    {},
    validPositive,
    invalidPositive
  );
});

describe("Testing 'getX' function", function () {
  testGetterValidation(getX, "x", validPositive, invalidPositive);
});

describe("Testing 'setX' function", function () {
  testSetterValidation(setX, getX, {}, validPositive, invalidPositive);
});

describe("Testing 'getY' function", function () {
  testGetterValidation(getY, "y", validPositive, invalidPositive);
});

describe("Testing 'setY' function", function () {
  testSetterValidation(setY, getY, {}, validPositive, invalidPositive);
});
