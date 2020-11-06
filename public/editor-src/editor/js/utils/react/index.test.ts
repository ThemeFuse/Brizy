import { attachRef } from "visual/utils/react/index";
import { createRef, Ref } from "react";

describe("Testing 'attachRef' function", function() {
  test("Attach ref on function ref", () => {
    let refVal = undefined;
    const ref: Ref<object> = (v: object) => (refVal = v);
    const o = {};

    attachRef(o, ref);

    expect(refVal).toBe(o);
  });

  test("Attach ref on object ref", () => {
    const ref: Ref<object> = createRef<object>();
    const o = {};

    attachRef(o, ref);

    expect(ref.current).toBe(o);
  });
});
