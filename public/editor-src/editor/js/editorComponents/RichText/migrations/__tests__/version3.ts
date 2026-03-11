import { ElementModel } from "visual/component/Elements/Types";
import { m3 } from "../version3";

describe("Testing RichText migration v3", () => {
  test.each<[ElementModel, ElementModel]>([
    [{}, {}],
    [{ text: "" }, { text: "" }],
    [{ text: null as unknown as string }, { text: null as unknown as string }],
    [{ text: 0 as unknown as string }, { text: 0 as unknown as string }]
  ])(
    "does not change model when text is not a non-empty string %#",
    (v, expected) => {
      const migrated = m3.cb({ v, vs: v, vd: v, renderContext: "editor" });
      expect(migrated).toStrictEqual(expected);
    }
  );

  test("unwraps .ql-editor and removes .ql-clipboard in editor context", () => {
    const v: ElementModel = {
      text: `<div><div class="ql-editor"><p>Editor text</p></div><div class="ql-clipboard">clipboard</div></div>`,
      someOtherProp: "keep-me"
    };

    const migrated = m3.cb({ v, vs: v, vd: v, renderContext: "editor" });

    expect(typeof migrated.text).toBe("string");
    expect(migrated.someOtherProp).toBe("keep-me");

    const html = migrated.text as string;

    expect(html).not.toContain("ql-editor");
    expect(html).not.toContain("ql-clipboard");
    expect(html).toStrictEqual("<div><p>Editor text</p></div>");
  });

  test("unwraps .ql-editor and removes .ql-clipboard in view context", () => {
    const v: ElementModel = {
      text: `<div><div class="ql-editor"><p>View text</p></div><div class="ql-clipboard">clipboard</div></div>`,
      anotherProp: 42
    };

    const migrated = m3.cb({ v, vs: v, vd: v, renderContext: "view" });

    expect(typeof migrated.text).toBe("string");
    expect(migrated.anotherProp).toBe(42);

    const html = migrated.text as string;

    expect(html).not.toContain("ql-editor");
    expect(html).not.toContain("ql-clipboard");
    expect(html).toStrictEqual("<div><p>View text</p></div>");
  });
});
