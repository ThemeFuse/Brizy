import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

test.each([
  ["", {}],
  ["test:1", { test: "1" }],
  ["test1:1\ntest2:2", { test1: "1", test2: "2" }],
  ["data-test1:1\ndata_test2:2", { "data-test1": "1", data_test2: "2" }],
  ["data-test1_test2:abc", { "data-test1_test2": "abc" }],
  ["test=xyz", { test: "xyz" }] // '=' as separator
])("Testing 'parseCustomAttributes' function", (s, expected) => {
  expect(parseCustomAttributes(s)).toEqual(expected);
});
