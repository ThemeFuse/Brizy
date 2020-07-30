import { testReader } from "visual/utils/types/Type.test";
import { eq, Post, read } from "./Post";
import { testEq } from "visual/utils/types/Eq.test";

describe("Testing 'read' function", function() {
  const valid = [
    {
      id: 1,
      title: "Test"
    },
    {
      id: "2",
      title: "Test 2"
    }
  ];
  const invalid = [
    undefined,
    null,
    [],
    "",
    3,
    {},
    { id: "test", title: "test" }
  ];

  testReader(read, valid, invalid);
});

describe("Testing 'eq' function", function() {
  const a: Post = { id: 1, title: "test 1" };
  const b: Post = { id: 1, title: "test 2" };
  const c: Post = { id: 2, title: "test 2" };
  testEq(eq, a, b, c);
});
