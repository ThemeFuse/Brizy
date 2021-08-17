import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

test.each([
  ["", {}],
  ["test:1", { test: "1" }],
  ["test1:1\ntest2:2", { test1: "1", test2: "2" }],
  ["data-test1:1\ndata_test2:2", { "data-test1": "1", data_test2: "2" }],
  ["data-test1_test2:abc", { "data-test1_test2": "abc" }],
  ["test=xyz", { test: "xyz" }], // '=' as separator,
  [
    `
data-invalid1:'customValue"
data-invalid2:"customValue'
data-invalid3:'customValue
data-invalid4:'customValue"
data-valid1:customValue
data-valid2:customValue111222
data-valid3:'customValue'
data-valid4:"customValue"
data-valid5:'custom Value'
data-valid6:"custom   Value"
data-valid7:aaa/.!:+?$#&%=@*()-
data-valid8:"aaa/.!:+?$#&%=@*()-"
data-valid9:custom--__--Value
on-Click:"return gtag_report_conversion('http://example.com/your-link')"
`,
    {
      "data-valid1": "customValue",
      "data-valid2": "customValue111222",
      "data-valid3": "customValue",
      "data-valid4": "customValue",
      "data-valid5": "custom Value",
      "data-valid6": "custom   Value",
      "data-valid7": "aaa/.!:+?$#&%=@*()-",
      "data-valid8": "aaa/.!:+?$#&%=@*()-",
      "data-valid9": "custom--__--Value",
      "on-Click":
        "return gtag_report_conversion('http://example.com/your-link')"
    }
  ]
])("Testing 'parseCustomAttributes' function", (s, expected) => {
  expect(parseCustomAttributes(s)).toEqual(expected);
});
