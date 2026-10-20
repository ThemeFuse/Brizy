import { Obj } from "@brizy/readers";
import type { CheerioAPI } from "cheerio";
import { isEditor, type RenderType } from "visual/providers/RenderProvider";
import type { MigrationRichText } from "./types";

type CheerioType = CheerioAPI;

interface TableWrap {
  depth: number;
  before: string;
  after: string;
}

const tableSection: TableWrap = {
  depth: 1,
  before: "<table>",
  after: "</table>"
};
const tableCell: TableWrap = {
  depth: 3,
  before: "<table><tbody><tr>",
  after: "</tr></tbody></table>"
};

// Markup that starts with a table part only parses inside a table.
const tableWraps = new Map<string, TableWrap>([
  ["thead", tableSection],
  ["tbody", tableSection],
  ["tfoot", tableSection],
  ["colgroup", tableSection],
  ["caption", tableSection],
  [
    "col",
    { depth: 2, before: "<table><colgroup>", after: "</colgroup></table>" }
  ],
  ["tr", { depth: 2, before: "<table><tbody>", after: "</tbody></table>" }],
  ["td", tableCell],
  ["th", tableCell]
]);

const FIRST_TAG = /<([a-z][^/\0>\x20\t\r\n\f]*)/i;

function parseHtml(html: string): HTMLElement {
  const wrapper = document.createElement("div");
  const tag = FIRST_TAG.exec(html)?.[1].toLowerCase() ?? "";
  const wrap = tableWraps.get(tag);

  if (!wrap) {
    wrapper.innerHTML = html;

    return wrapper;
  }

  const holder = document.createElement("div");
  let parent: Node = holder;

  holder.innerHTML = wrap.before + html + wrap.after;

  for (let level = 0; level < wrap.depth; level++) {
    const child = parent.lastChild;

    if (!child) {
      throw new TypeError("RichText text migration failed");
    }
    parent = child;
  }

  wrapper.append(...Array.from(parent.childNodes));

  return wrapper;
}

const changeRichText = (html: string, renderContext: RenderType): string => {
  if (isEditor(renderContext)) {
    const wrapper = parseHtml(html);

    // Find .ql-editor elements, unwrap children (move to parent, remove wrapper)
    wrapper.querySelectorAll(".ql-editor").forEach((editor) => {
      if (editor.children.length > 0) {
        editor.replaceWith(...Array.from(editor.childNodes));
      }
    });

    // Remove .ql-clipboard elements
    wrapper.querySelectorAll(".ql-clipboard").forEach((clipboard) => {
      clipboard.remove();
    });

    return wrapper.innerHTML;
  } else {
    // View mode: use Cheerio
    // biome-ignore lint/style/noCommonJs: environment branch — cheerio only exists in the view; a static import would bundle it into the editor build too
    const cheerioMod = require("cheerio") as { load: CheerioType["load"] };
    // 3rd arg `false` parses fragment without wrapping in <html><body>.
    const $ = cheerioMod.load(html, undefined, false);
    const $root = $.root();

    // Find .ql-editor elements, unwrap children (move to parent, remove wrapper)
    $root.find(".ql-editor").each((_, el) => {
      const $qlEditor = $(el);
      $qlEditor.replaceWith($qlEditor.contents());
    });

    // Remove .ql-clipboard elements
    $root.find(".ql-clipboard").remove();

    return $.root().html() ?? "";
  }
};

export const m3: MigrationRichText = {
  version: 3,
  cb({ v, renderContext }) {
    const model = Obj.read(v);
    if (!model) {
      throw new Error(`RichText text migration failed ${v}`);
    }

    const text = model.text;
    if (typeof text === "string" && text.length > 0) {
      const context: RenderType = renderContext ?? "editor";

      return {
        ...model,
        text: changeRichText(text, context)
      };
    }

    return v;
  }
};
