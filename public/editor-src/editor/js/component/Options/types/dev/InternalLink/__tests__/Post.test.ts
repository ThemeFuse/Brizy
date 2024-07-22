import { read } from "visual/utils/options/InternalLink/utils";
import { testEq } from "visual/utils/types/Eq.test";
import { testReader } from "visual/utils/types/Type.test";
import { ChoiceWithPermalink } from "../types";
import { eq } from "../types/Post";

describe("Testing 'read' function", function () {
  const valid = [
    {
      value: 1,
      title: "Test",
      source: "pages"
    },
    {
      value: "2",
      title: "Test 2",
      source: "posts"
    }
  ];
  const invalid = [undefined, null, [], "", 3, {}];

  testReader(read, valid, invalid);
});

describe("Testing 'eq' function", function () {
  const a: ChoiceWithPermalink = { title: "test 1", value: "1" };
  const b: ChoiceWithPermalink = { title: "test 2", value: "1" };
  const c: ChoiceWithPermalink = { title: "test 2", value: "3" };
  testEq(eq, a, b, c);
});
