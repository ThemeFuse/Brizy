import * as Arr from "visual/utils/reader/array";
import * as Json from "visual/utils/reader/json";
import * as Str from "visual/utils/reader/string";
import { mPipe } from "./mPipe";

test("Testing 'mPipe' function", function () {
  const jsonToStrArr = mPipe(Json.read, Arr.readWithItemReader(Str.read));
  const strReadRepeat = mPipe(Str.read, (s: string) => s.repeat(3));

  expect(jsonToStrArr('["a","b","c"]')).toEqual(["a", "b", "c"]);
  expect(jsonToStrArr("invalid str")).toEqual(undefined);
  expect(strReadRepeat("a")).toEqual("aaa");
  expect(strReadRepeat([1, 2, 3])).toEqual(undefined);
});
