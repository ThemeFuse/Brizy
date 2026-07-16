import { Obj } from "@brizy/readers";
import type { CheerioAPI } from "cheerio";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { MigrationRichText } from "./types";

type JQueryType = typeof $;
type CheerioType = CheerioAPI;

const changeRichText = (html: string, renderContext: RenderType): string => {
  if (isEditor(renderContext)) {
    // Editor mode: use jQuery
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const $ = require("jquery") as JQueryType;
    const $wrapper = $("<div>").html(html);

    // Find .ql-editor elements, unwrap children (move to parent, remove wrapper)
    $wrapper.find(".ql-editor").each(function () {
      const $editor = $(this);
      $editor.children().unwrap();
    });

    // Remove .ql-clipboard elements
    $wrapper.find(".ql-clipboard").remove();

    return $wrapper.html() || "";
  } else {
    // View mode: use Cheerio
    // eslint-disable-next-line @typescript-eslint/no-require-imports
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
