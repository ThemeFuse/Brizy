import { identity, times } from "underscore";
import * as FontWeight from "visual/utils/fonts/Weight";
import { Weight } from "visual/utils/fonts/Weight";
import * as SizeSuffix from "visual/utils/fonts/SizeSuffix";
import * as Positive from "visual/utils/math/Positive";
import { testSetterValidation } from "visual/utils/model/utilities.test";
import * as FamilyType from "visual/utils/fonts/familyType";
import { FontFamilyType } from "visual/utils/fonts/familyType";
import {
  getFontFamily,
  getFontFamilyType,
  getFontSize,
  getFontSizeSuffix,
  getFontStyle,
  getFontWeight,
  getLetterSpacing,
  getLineHeight,
  patchFontFamily,
  patchFontFamilyType,
  patchFontSize,
  patchFontSizeSuffix,
  patchFontStyle,
  patchFontWeight,
  patchLetterSpacing,
  patchLineHeight,
  setFontFamily,
  setFontFamilyType,
  setFontSize,
  setFontSizeSuffix,
  setFontStyle,
  setFontWeight,
  setLetterSpacing,
  setLineHeight
} from "visual/component/Options/types/dev/Typography/model";
import { testPatchFunction } from "visual/utils/patch/index.test";
import { Patcher } from "visual/utils/patch";
import {
  FontSettings,
  Value
} from "visual/component/Options/types/dev/Typography/types/Value";
import { DEFAULT_VALUE } from "visual/component/Options/types/dev/Typography/componentUtils";

const validFontFamily = ["arial", "test"];
const validFontStyle = ["custom", "test"];

const validPositive = times(100, i => i + 1).map(Positive.unsafe);

const validNumber = [...times(50, i => i * -1 || 0), ...times(50, identity)];

const testFontSettingsPatch = <K extends keyof FontSettings>(
  patch: Patcher<FontSettings[K], Value, FontSettings>,
  k: K,
  v: FontSettings[K]
) => {
  test("Should patch fontSize, fontSizeSuffix, fontWeight, letterSpacing, lineHeight", () => {
    const m: Value = {
      ...DEFAULT_VALUE,
      fontSize: Positive.unsafe(1),
      fontSizeSuffix: SizeSuffix.empty,
      fontWeight: FontWeight.empty,
      letterSpacing: 1,
      lineHeight: Positive.unsafe(1)
    };

    expect(patch(v, m)).toEqual({
      fontSize: 1,
      fontSizeSuffix: SizeSuffix.empty,
      fontWeight: FontWeight.empty,
      letterSpacing: 1,
      lineHeight: 1,
      [k]: v
    });
  });
};

describe("Testing 'patchFontFamily' function", function() {
  testPatchFunction(
    patchFontFamily,
    getFontFamily,
    validFontFamily,
    DEFAULT_VALUE
  );

  test("Should patch fontFamily and fontFamilyType", () => {
    expect(
      patchFontFamily("arial", {
        ...DEFAULT_VALUE,
        fontFamilyType: FontFamilyType.google,
        fontWeight: Weight.EXTRA_LIGHT
      })
    ).toEqual({
      fontFamilyType: FontFamilyType.google,
      fontFamily: "arial",
      fontWeight: Weight.EXTRA_LIGHT
    });
  });
});

describe("Testing 'setFontFamily' function", function() {
  testSetterValidation(
    setFontFamily,
    getFontFamily,
    DEFAULT_VALUE,
    validFontFamily
  );
});

describe("Testing 'patchFontFamilyType' function", function() {
  testPatchFunction(
    patchFontFamilyType,
    getFontFamilyType,
    FamilyType.types,
    DEFAULT_VALUE
  );

  test("Should patch fontFamily and fontFamilyType", () => {
    expect(
      patchFontFamilyType(FontFamilyType.upload, {
        ...DEFAULT_VALUE,
        fontFamily: "arial",
        fontWeight: Weight.EXTRA_LIGHT
      })
    ).toStrictEqual({
      fontFamilyType: FontFamilyType.upload,
      fontFamily: "arial",
      fontWeight: Weight.EXTRA_LIGHT
    });
  });
});

describe("Testing 'setFontFamilyType' function", function() {
  testSetterValidation(
    setFontFamilyType,
    getFontFamilyType,
    DEFAULT_VALUE,
    FamilyType.types
  );
});

describe("Testing 'patchFontStyle' function", function() {
  testPatchFunction(
    patchFontStyle,
    getFontStyle,
    validFontStyle,
    DEFAULT_VALUE
  );
});

describe("Testing 'setFontStyle' function", function() {
  testSetterValidation(
    setFontStyle,
    getFontStyle,
    DEFAULT_VALUE,
    validFontStyle
  );
});

describe("Testing 'patchFontSize' function", function() {
  testPatchFunction(patchFontSize, getFontSize, validPositive, DEFAULT_VALUE);

  testFontSettingsPatch(patchFontSize, "fontSize", Positive.unsafe(14));
});

describe("Testing 'setFontSize' function", function() {
  testSetterValidation(setFontSize, getFontSize, DEFAULT_VALUE, validPositive);
});

describe("Testing 'patchFontWeight' function", function() {
  testPatchFunction(
    patchFontWeight,
    getFontWeight,
    FontWeight.weights,
    DEFAULT_VALUE
  );

  testFontSettingsPatch(patchFontWeight, "fontWeight", FontWeight.Weight.BLACK);
});

describe("Testing 'setFontWeight' function", function() {
  testSetterValidation(
    setFontWeight,
    getFontWeight,
    DEFAULT_VALUE,
    FontWeight.weights
  );
});

describe("Testing 'patchFontSizeSuffix' function", function() {
  testPatchFunction(
    patchFontSizeSuffix,
    getFontSizeSuffix,
    SizeSuffix.suffixes,
    DEFAULT_VALUE
  );

  testFontSettingsPatch(
    patchFontSizeSuffix,
    "fontSizeSuffix",
    SizeSuffix.SizeSuffix.em
  );
});

describe("Testing 'setFontSizeSuffix' function", function() {
  testSetterValidation(
    setFontSizeSuffix,
    getFontSizeSuffix,
    DEFAULT_VALUE,
    SizeSuffix.suffixes
  );
});

describe("Testing 'patchLetterSpacing' function", function() {
  testPatchFunction(
    patchLetterSpacing,
    getLetterSpacing,
    validNumber,
    DEFAULT_VALUE
  );

  testFontSettingsPatch(patchLetterSpacing, "letterSpacing", 14);
});

describe("Testing 'setLetterSpacing' function", function() {
  testSetterValidation(
    setLetterSpacing,
    getLetterSpacing,
    DEFAULT_VALUE,
    validNumber
  );
});

describe("Testing 'patchLineHeight' function", function() {
  testPatchFunction(
    patchLineHeight,
    getLineHeight,
    validPositive,
    DEFAULT_VALUE
  );

  testFontSettingsPatch(patchLineHeight, "lineHeight", Positive.unsafe(1.2));
});

describe("Testing 'setLineHeight' function", function() {
  testSetterValidation(
    setLineHeight,
    getLineHeight,
    DEFAULT_VALUE,
    validPositive
  );
});
