import { inlineStylesToClasses } from "../inlineStylesToClasses";

describe("inlineStylesToClasses", () => {
  it.each([
    {
      case: "color and opacity on a span",
      in: '<p><span style="color: rgb(24, 28, 37); opacity: 0.8;">a</span></p>',
      out: '<p><span class="c-0">a</span></p>',
      registered: ["color:rgb(24, 28, 37);opacity:0.8"]
    },
    {
      case: "the same declarations in another order",
      in: '<span style="opacity: 0.8; color: rgb(24, 28, 37);">a</span>',
      out: '<span class="c-0">a</span>',
      registered: ["color:rgb(24, 28, 37);opacity:0.8"]
    },
    {
      case: "two nodes with the same style",
      in: '<span style="color: red">a</span><span style="COLOR:red;">b</span>',
      out: '<span class="c-0">a</span><span class="c-0">b</span>',
      registered: ["color:red"]
    },
    {
      case: "two nodes with different styles",
      in: '<span style="color: red">a</span><span style="color: blue">b</span>',
      out: '<span class="c-0">a</span><span class="c-1">b</span>',
      registered: ["color:red", "color:blue"]
    },
    {
      case: "a node that already has classes",
      in: '<span class="brz-cp-color7 brz-span" style="opacity: 1">a</span>',
      out: '<span class="brz-cp-color7 brz-span c-0">a</span>',
      registered: ["opacity:1"]
    },
    {
      case: "a text shadow and a gradient",
      in: '<span style="text-shadow: rgba(0, 0, 0, 0.5) 1px 2px 4px; background-image: linear-gradient(90deg, rgb(0, 153, 0) 0%, rgb(5, 39, 202) 100%);">a</span>',
      out: '<span class="c-0">a</span>',
      registered: [
        "background-image:linear-gradient(90deg, rgb(0, 153, 0) 0%, rgb(5, 39, 202) 100%);text-shadow:rgba(0, 0, 0, 0.5) 1px 2px 4px"
      ]
    },
    {
      case: "a url holding a semicolon",
      in: `<span style="background-image: url('data:image/png;base64,AAA'); background-position: 50% 50%;">a</span>`,
      out: '<span class="c-0">a</span>',
      registered: [
        "background-image:url('data:image/png;base64,AAA');background-position:50% 50%"
      ]
    },
    {
      case: "a custom property",
      in: '<span style="--brz-text-sm-Color: #fff; color: red">a</span>',
      out: '<span class="c-0">a</span>',
      registered: ["--brz-text-sm-Color:#fff;color:red"]
    },
    {
      case: "a repeated property",
      in: '<span style="color: red; background: blue; color: green">a</span>',
      out: '<span class="c-0">a</span>',
      registered: ["color:red;background:blue;color:green"]
    },
    {
      case: "an important value",
      in: '<span style="color: red !important">a</span>',
      out: '<span class="c-0">a</span>',
      registered: ["color:red !important"]
    },
    {
      case: "an empty style",
      in: '<span style="">a</span><span style="  ;  ">b</span>',
      out: "<span>a</span><span>b</span>",
      registered: []
    },
    {
      case: "a value that would break out of the rule",
      in: '<span style="color: red} .x{color: blue">a</span>',
      out: '<span style="color: red} .x{color: blue">a</span>',
      registered: []
    },
    {
      case: "a node without style",
      in: '<p class="brz-tp-paragraph">a</p>',
      out: '<p class="brz-tp-paragraph">a</p>',
      registered: []
    }
  ])("handles $case", ({ in: input, out, registered }) => {
    const calls: string[] = [];
    const register = (declarations: string): string => {
      if (!calls.includes(declarations)) {
        calls.push(declarations);
      }

      return `c-${calls.indexOf(declarations)}`;
    };

    expect(inlineStylesToClasses(input, register)).toBe(out);
    expect(calls).toEqual(registered);
  });
});
