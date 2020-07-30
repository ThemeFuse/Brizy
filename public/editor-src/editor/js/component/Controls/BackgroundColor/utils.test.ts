import { fromColorMeta } from "visual/component/Controls/BackgroundColor/utils";

describe("Testing 'fromColorMeta' function", function() {
  test("Rename 'select' field to 'type'", () => {
    expect(fromColorMeta({ isChanged: "select" })).toMatchObject({
      isChanged: "type"
    });
  });
});
