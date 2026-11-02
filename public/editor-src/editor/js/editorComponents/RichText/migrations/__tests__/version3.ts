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

  test.each([
    {
      case: "text without Quill wrappers",
      in: `<p class="brz-tp-lg-paragraph"><span class="brz-cp-color7">Hello</span></p>`,
      out: `<p class="brz-tp-lg-paragraph"><span class="brz-cp-color7">Hello</span></p>`
    },
    {
      case: "a saved Quill container",
      in: `<div class="ql-editor" contenteditable="true"><p class="brz-tp-lg-paragraph">One</p><p>Two</p></div><div class="ql-clipboard" contenteditable="true" tabindex="-1"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview"></a></div>`,
      out: `<p class="brz-tp-lg-paragraph">One</p><p>Two</p><div class="ql-tooltip ql-hidden"><a class="ql-preview"></a></div>`
    },
    {
      case: "a wrapper inside a wrapper",
      in: `<div class="ql-editor"><div class="ql-editor"><p>Deep</p></div><p>Outer</p></div>`,
      out: `<p>Deep</p><p>Outer</p>`
    },
    {
      case: "two wrappers side by side",
      in: `<div class="ql-editor"><p>A</p></div><div class="ql-editor"><h2>B</h2></div>`,
      out: `<p>A</p><h2>B</h2>`
    },
    {
      case: "text between the wrapped blocks",
      in: `<div class="ql-editor">lead <p>A</p> middle <span>B</span> tail</div>`,
      out: `lead <p>A</p> middle <span>B</span> tail`
    },
    {
      case: "entities and quoted attributes",
      in: `<div class="ql-editor"><p data-x='a "q" b'>Tom &amp; Jerry&nbsp;&lt;3 &copy; <br>é 😀</p></div>`,
      out: `<p data-x="a &quot;q&quot; b">Tom &amp; Jerry&nbsp;&lt;3 © <br>é 😀</p>`
    },
    {
      case: "upper-case tags, bare attributes and self-closing breaks",
      in: `<DIV CLASS="ql-editor"><P class=one>x<br/>y</P><img src="a.png"></DIV>`,
      out: `<p class="one">x<br>y</p><img src="a.png">`
    },
    {
      case: "a link holding a placeholder",
      in: `<div class="ql-editor"><p><a data-href="%7B%22type%22%3A%22external%22%7D" class="link--external">{{placeholder content='e3twb3N0X3RpdGxlfX0='}}</a></p></div>`,
      out: `<p><a data-href="%7B%22type%22%3A%22external%22%7D" class="link--external">{{placeholder content='e3twb3N0X3RpdGxlfX0='}}</a></p>`
    },
    {
      case: "a style tag",
      in: `<div class="ql-editor"><style>.a > .b { color: red }</style><p>S</p></div>`,
      out: `<style>.a > .b { color: red }</style><p>S</p>`
    },
    {
      case: "a script tag",
      in: `<div class="ql-editor"><script>var a = 1 < 2;</script><p>J</p></div>`,
      out: `<script>var a = 1 < 2;</script><p>J</p>`
    },
    {
      case: "a clipboard inside the wrapper",
      in: `<div class="ql-editor"><p>A</p><div class="ql-clipboard">c</div></div>`,
      out: `<p>A</p>`
    },
    {
      case: "a clipboard inside a clipboard",
      in: `<p>Keep</p><div class="ql-clipboard"><div class="ql-clipboard">x</div></div>`,
      out: `<p>Keep</p>`
    },
    {
      case: "text without tags",
      in: `Just text &amp; more`,
      out: `Just text &amp; more`
    },
    {
      case: "text starting with a table cell",
      in: `<td>Cell <div class="ql-editor"><p>In</p></div></td><td>Next</td>`,
      out: `<td>Cell <p>In</p></td><td>Next</td>`
    },
    {
      case: "text starting with a table row",
      in: `<tr><td><div class="ql-clipboard">x</div>Row</td></tr>`,
      out: `<tr><td>Row</td></tr>`
    },
    {
      case: "text starting with a table body",
      in: `<tbody><tr><td><div class="ql-editor"><p>B</p></div></td></tr></tbody>`,
      out: `<tbody><tr><td><p>B</p></td></tr></tbody>`
    },
    {
      case: "text starting with a table column",
      in: `<col span="2"><col>`,
      out: `<col span="2"><col>`
    }
  ])("rewrites $case in editor context", ({ in: text, out }) => {
    const v: ElementModel = { text };

    const migrated = m3.cb({ v, vs: v, vd: v, renderContext: "editor" });

    expect(migrated).toStrictEqual({ text: out });
  });
});
