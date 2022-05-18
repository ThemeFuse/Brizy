import { M, hasMultiLanguage } from "../index";

describe("Testing 'hasMultiLanguage' constant", function() {
  test("Return true if element has multilanguage = 'on' and at least one item in list", () => {
    [
      { m: "on", mLanguages: '["English","Russian"]' },
      { m: "on", mLanguages: '["English","Russian","French"]' },
      { m: "on", mLanguages: '["English","Italian"]' }
    ].map(a => expect(hasMultiLanguage(a.m as M, a.mLanguages)).toBe(true));
  });

  test("Return false if values not valid", () => {
    [
      { m: "off", mLanguages: '["English","Russian","asdasdasdasd"]' },
      { m: "off", mLanguages: "[]" },
      { m: "on", mLanguages: "[]" },
      { m: "on", mLanguages: "asd" },
      { m: "on", mLanguages: '["Italian]' },
      { m: "on", mLanguages: "1234" }
    ].map(a => expect(hasMultiLanguage(a.m as M, a.mLanguages)).toBe(false));
  });
});
