import { z } from "zod";
import {
  type DCGroups,
  DCTypes
} from "visual/global/Config/types/DynamicContent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import type { MValue } from "visual/utils/value";
import type { QuillFormat } from "../../types";
import { getFormats } from "..";

// The selected node, in the form `getFormats` takes it.
const selected = (element: HTMLElement): HTMLElement => element;

const postTitle = makePlaceholder({ content: "{{post_title}}" });

const dcGroups: DCGroups = {
  [DCTypes.image]: [],
  [DCTypes.link]: [],
  [DCTypes.richText]: [
    { label: "Post title", placeholder: "{{post_title}}", display: "block" }
  ]
};

function mount(html: string, attached: boolean): HTMLElement {
  const root = document.createElement("div");

  root.innerHTML = html;
  if (attached) {
    document.body.append(root);
  }

  return z.instanceof(HTMLElement).parse(root.querySelector("[data-target]"));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("getFormats", () => {
  it.each<{
    case: string;
    html: string;
    attached: boolean;
    format: QuillFormat;
    dcGroups: MValue<DCGroups>;
  }>([
    {
      case: "a span in a paragraph",
      html: `<p class="brz-tp-lg-paragraph brz-text-lg-center"><span data-target>text</span></p>`,
      attached: true,
      format: {},
      dcGroups
    },
    {
      case: "the paragraph itself",
      html: `<p data-target class="brz-tp-lg-heading1 brz-text-lg-right">text</p>`,
      attached: true,
      format: {},
      dcGroups
    },
    {
      case: "a node in a heading",
      html: `<h2 class="brz-tp-lg-heading2 brz-text-lg-left"><strong data-target>text</strong></h2>`,
      attached: true,
      format: {},
      dcGroups
    },
    {
      case: "a node in a preformatted block",
      html: `<pre class="brz-tp-lg-paragraph"><span data-target>text</span></pre>`,
      attached: true,
      format: {},
      dcGroups
    },
    {
      case: "a node in a list item",
      html: `<ul><li class="brz-tp-lg-paragraph brz-text-lg-justify"><span data-target>text</span></li></ul>`,
      attached: true,
      format: { list: "bullet" },
      dcGroups
    },
    {
      case: "a node in a dynamic content block",
      html: `<div class="brz-tp__dc-block brz-tp-lg-heading3"><span data-target>text</span></div>`,
      attached: true,
      format: {},
      dcGroups
    },
    {
      case: "a node in an unknown heading tag",
      html: `<h7 class="brz-tp-lg-heading4 brz-text-lg-center"><span data-target>text</span></h7>`,
      attached: true,
      format: {},
      dcGroups
    },
    {
      case: "a node with its own color and opacity",
      html: `<p class="brz-tp-lg-paragraph"><span data-target style="color: rgb(10, 20, 30); opacity: 0.5">text</span></p>`,
      attached: true,
      format: {},
      dcGroups
    },
    {
      case: "a format that names the color and opacity",
      html: `<p class="brz-tp-lg-paragraph"><span data-target style="color: rgb(10, 20, 30); opacity: 0.5">text</span></p>`,
      attached: true,
      format: { color: "rgb(1, 2, 3)", opacity: "0.3", bold: true },
      dcGroups
    },
    {
      case: "a node outside the document",
      html: `<p class="brz-tp-lg-paragraph"><span data-target style="color: rgb(40, 50, 60); opacity: 0.25">text</span></p>`,
      attached: false,
      format: {},
      dcGroups
    },
    {
      case: "a node in a population",
      html: `<p class="brz-tp-lg-paragraph"><span data-population="post_title">  Post title  <b data-target>x</b></span></p>`,
      attached: true,
      format: { population: postTitle },
      dcGroups
    },
    {
      case: "a population format outside a population node",
      html: `<p class="brz-tp-lg-paragraph"><span data-target>text</span></p>`,
      attached: true,
      format: { population: postTitle },
      dcGroups
    },
    {
      case: "a population without dynamic content groups",
      html: `<p class="brz-tp-lg-paragraph"><span data-population="post_title">Post title<b data-target>x</b></span></p>`,
      attached: true,
      format: { population: postTitle },
      dcGroups: undefined
    },
    {
      case: "a node in a visible prepopulation",
      html: `<p class="brz-tp-lg-paragraph"><span class="brz-pre-population-visible">#post<i data-target>x</i></span></p>`,
      attached: true,
      format: { prepopulation: "visible" },
      dcGroups
    },
    {
      case: "a prepopulation format outside a prepopulation node",
      html: `<p class="brz-tp-lg-paragraph"><span data-target>text</span></p>`,
      attached: true,
      format: { prepopulation: "visible" },
      dcGroups
    }
  ])("reads the formats of $case", ({ html, attached, format, dcGroups }) => {
    const target = mount(html, attached);

    expect(getFormats(selected(target), format, dcGroups)).toMatchSnapshot();
  });
});
