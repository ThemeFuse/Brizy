import { times, identity } from "underscore";
import * as FontWeightTest from "visual/utils/fonts/weight.test";
import * as FontWeight from "visual/utils/fonts/weight";
import {
  testGetterValidation,
  testSetterValidation
} from "visual/utils/model/utilities.test";
import * as FamilyType from "visual/utils/fonts/familyType";
import {
  getFontFamily,
  getFontFamilyType,
  getFontSize,
  getFontStyle,
  getFontWeight,
  getLetterSpacing,
  getLineHeight,
  patchFontFamily,
  patchFontFamilyType,
  patchFontSize,
  patchFontStyle,
  patchFontWeight,
  patchLetterSpacing,
  patchLineHeight,
  setFontFamily,
  setFontFamilyType,
  setFontSize,
  setFontStyle,
  setFontWeight,
  setLetterSpacing,
  setLineHeight
} from "visual/component/Options/types/dev/Typography/model";
import { testPatchFunction } from "visual/utils/patch/index.test";

const validFontFamily = ["arial", "test"];
const invalidFontFamily = [undefined, null, {}, 1, () => ({})];

const invalidFontFamilyType = invalidFontFamily;

const validFontStyle = ["custom", "test"];
const invalidFontStyle = [undefined, null, {}, 1, () => ({})];

const validPositive = times(100, i => i + 1);
const invalidPositive = [undefined, null, 0, -1, -2, "", "0"];

const validNumber = [...times(50, i => i * -1), ...times(50, identity)];
const invalidNumber = [undefined, null, "", "0"];

const testFontStylePatch = (patch, valid) => {
  describe("Testing fontStyle patching", function() {
    test("If font style is not custom, patch it as custom", () => {
      expect(patch(valid, { fontStyle: "test" })).toMatchObject({
        fontStyle: ""
      });
    });
  });
};

const testFontSettingsPatch = (patch, k, v) => {
  test("Should patch fontSize, fontWeight, letterSpacing, lineHeight", () => {
    const m = {
      fontSize: 1,
      fontWeight: FontWeight.empty,
      letterSpacing: 1,
      lineHeight: 1,
      fontStyle: ""
    };

    expect(patch(v, m)).toEqual({
      fontSize: 1,
      fontWeight: FontWeight.empty,
      letterSpacing: 1,
      lineHeight: 1,
      fontStyle: "",
      [k]: v
    });
  });
};

describe("Testing 'getFontFamily' function", function() {
  testGetterValidation(
    getFontFamily,
    "fontFamily",
    validFontFamily,
    invalidFontFamily
  );
});

describe("Testing 'patchFontFamily' function", function() {
  testPatchFunction(
    patchFontFamily,
    getFontFamily,
    validFontFamily,
    invalidFontFamily
  );

  testFontStylePatch(patchFontFamily, "arial");

  test("Should patch fontFamily and fontFamilyType", () => {
    expect(
      patchFontFamily("arial", { fontFamilyType: "google", fontStyle: "" })
    ).toEqual({ fontFamilyType: "google", fontFamily: "arial", fontStyle: "" });
  });
});

describe("Testing 'setFontFamily' function", function() {
  testSetterValidation(
    setFontFamily,
    getFontFamily,
    {},
    validFontFamily,
    invalidFontFamily
  );
});

describe("Testing 'getFontFamilyType' function", function() {
  testGetterValidation(
    getFontFamilyType,
    "fontFamilyType",
    FamilyType.types,
    invalidFontFamilyType
  );
});

describe("Testing 'patchFontFamilyType' function", function() {
  testPatchFunction(
    patchFontFamilyType,
    getFontFamilyType,
    FamilyType.types,
    invalidFontFamilyType
  );

  testFontStylePatch(patchFontFamilyType, FamilyType.GOOGLE);

  test("Should patch fontFamily and fontFamilyType", () => {
    expect(
      patchFontFamilyType(FamilyType.GOOGLE, {
        fontFamily: "arial",
        fontStyle: ""
      })
    ).toEqual({
      fontFamilyType: FamilyType.GOOGLE,
      fontFamily: "arial",
      fontStyle: ""
    });
  });
});

describe("Testing 'setFontFamilyType' function", function() {
  testSetterValidation(
    setFontFamilyType,
    getFontFamilyType,
    {},
    FamilyType.types,
    invalidFontFamilyType
  );
});

describe("Testing 'getFontStyle' function", function() {
  testGetterValidation(
    getFontStyle,
    "fontStyle",
    validFontStyle,
    invalidFontStyle
  );
});

describe("Testing 'patchFontStyle' function", function() {
  testPatchFunction(
    patchFontStyle,
    getFontStyle,
    validFontStyle,
    invalidFontStyle
  );
});

describe("Testing 'setFontStyle' function", function() {
  testSetterValidation(
    setFontStyle,
    getFontStyle,
    {},
    validFontStyle,
    invalidFontStyle
  );
});

describe("Testing 'getFontSize' function", function() {
  testGetterValidation(getFontSize, "fontSize", validPositive, invalidPositive);
});

describe("Testing 'patchFontSize' function", function() {
  testPatchFunction(patchFontSize, getFontSize, validPositive, invalidPositive);

  testFontStylePatch(patchFontSize, 14);

  testFontSettingsPatch(patchFontSize, "fontSize", 14);
});

describe("Testing 'setFontSize' function", function() {
  testSetterValidation(
    setFontSize,
    getFontSize,
    {},
    validPositive,
    invalidPositive
  );
});

describe("Testing 'getFontWeight' function", function() {
  testGetterValidation(
    getFontWeight,
    "fontWeight",
    FontWeightTest.valid,
    FontWeightTest.invalid
  );
});

describe("Testing 'patchFontWeight' function", function() {
  testPatchFunction(
    patchFontWeight,
    getFontWeight,
    FontWeightTest.valid,
    FontWeightTest.invalid
  );

  testFontStylePatch(patchFontWeight, FontWeight.BLACK);

  testFontSettingsPatch(patchFontWeight, "fontWeight", FontWeight.BLACK);
});

describe("Testing 'setFontWeight' function", function() {
  testSetterValidation(
    setFontWeight,
    getFontWeight,
    {},
    FontWeightTest.valid,
    FontWeightTest.invalid
  );
});

describe("Testing 'getLetterSpacing' function", function() {
  testGetterValidation(
    getLetterSpacing,
    "letterSpacing",
    validNumber,
    invalidNumber
  );
});

describe("Testing 'patchLetterSpacing' function", function() {
  testPatchFunction(
    patchLetterSpacing,
    getLetterSpacing,
    validNumber,
    invalidNumber
  );

  testFontStylePatch(patchLetterSpacing, 14);

  testFontSettingsPatch(patchLetterSpacing, "letterSpacing", 14);
});

describe("Testing 'setLetterSpacing' function", function() {
  testSetterValidation(
    setLetterSpacing,
    getLetterSpacing,
    {},
    validNumber,
    invalidNumber
  );
});

describe("Testing 'getLineHeight' function", function() {
  testGetterValidation(
    getLineHeight,
    "lineHeight",
    validPositive,
    invalidPositive
  );
});

describe("Testing 'patchLineHeight' function", function() {
  testPatchFunction(
    patchLineHeight,
    getLineHeight,
    validPositive,
    invalidPositive
  );

  testFontStylePatch(patchLineHeight, 1.2);

  testFontSettingsPatch(patchLineHeight, "lineHeight", 1.2);
});

describe("Testing 'setLineHeight' function", function() {
  testSetterValidation(
    setLineHeight,
    getLineHeight,
    {},
    validPositive,
    invalidPositive
  );
});
