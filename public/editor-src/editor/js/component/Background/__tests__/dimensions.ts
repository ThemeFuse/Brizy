import $ from "jquery";
import { setRect } from "../__fixtures__/env";
import {
  height,
  offsetTop,
  outerHeight,
  setContentSize,
  width
} from "../lib/dimensions";

// `lib/dimensions.ts` is a port of jQuery's dimension code, so the only expectation worth writing
// is "the same number jQuery returns". Each row is run through both implementations; the fixtures
// deliberately cover the cases a shortcut translation gets wrong — border-box with padding and
// border, an element hidden by `display: none`, a percentage inside a hidden parent.

function mount(css: string, parentCss: string): HTMLElement {
  const parent = document.createElement("div");
  const element = document.createElement("div");

  parent.style.cssText = parentCss;
  element.style.cssText = css;
  parent.append(element);
  document.body.append(parent);

  return element;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("reading", () => {
  it.each([
    {
      case: "a plain pixel height",
      css: "height:900px;width:400px",
      parent: ""
    },
    {
      case: "a fractional height",
      css: "height:100.5px;width:400px",
      parent: ""
    },
    {
      case: "a border box with padding and border",
      css: "box-sizing:border-box;height:100px;width:200px;padding:10px;border:2px solid",
      parent: ""
    },
    {
      case: "a content box with padding and border",
      css: "box-sizing:content-box;height:100px;width:200px;padding:10px;border:2px solid",
      parent: ""
    },
    {
      case: "an element hidden by display none",
      css: "display:none;height:50px;width:80px",
      parent: ""
    },
    {
      case: "a percentage inside a hidden parent",
      css: "height:100%;width:100%",
      parent: "display:none"
    },
    {
      case: "a percentage inside a visible parent",
      css: "height:50%;width:50%",
      parent: "height:400px;width:400px"
    },
    { case: "no size at all", css: "", parent: "" },
    { case: "an auto height", css: "height:auto;width:auto", parent: "" }
  ])("measures $case exactly as jQuery does", ({ css, parent }) => {
    const element = mount(css, parent);

    expect(height(element)).toBe($(element).height());
    expect(width(element)).toBe($(element).width());
    expect(outerHeight(element)).toBe($(element).outerHeight());
  });
});

describe("writing", () => {
  it.each([
    {
      case: "a content box",
      css: "box-sizing:content-box;padding:10px;border:2px solid",
      value: 321
    },
    {
      case: "a border box",
      css: "box-sizing:border-box;padding:10px;border:2px solid",
      value: 321
    },
    { case: "a bare element", css: "", value: 180 },
    { case: "a negative size", css: "", value: -5 },
    { case: "a fractional size", css: "", value: 180.5 }
  ])("sizes $case exactly as jQuery does", ({ css, value }) => {
    const ported = mount(css, "");
    const jquery = mount(css, "");

    setContentSize(ported, "width", value);
    setContentSize(ported, "height", value);
    $(jquery).width(value).height(value);

    expect(ported.style.width).toBe(jquery.style.width);
    expect(ported.style.height).toBe(jquery.style.height);
  });

  it("ignores a size that is not a number", () => {
    const element = mount("", "");

    element.style.width = "100px";
    setContentSize(element, "width", Number.NaN);

    expect(element.style.width).toBe("100px");
  });
});

describe("positioning", () => {
  it.each([
    { case: "an element with a box", top: 500, rect: true, scroll: 0 },
    { case: "a scrolled page", top: 500, rect: true, scroll: 120 },
    { case: "an element with no box", top: 0, rect: false, scroll: 0 }
  ])("reports the document offset of $case", ({ top, rect, scroll }) => {
    const element = mount("height:100px", "");

    if (rect) {
      setRect(element, { top, height: 100 });
    }

    Object.defineProperty(window, "pageYOffset", {
      configurable: true,
      writable: true,
      value: scroll
    });

    expect(offsetTop(element)).toBe($(element).offset()?.top);

    Reflect.deleteProperty(window, "pageYOffset");
  });
});
