import Quill from "quill";
import IDelta from "quill-delta";
import { ClipboardInterface } from "./types/ClipboardInterface";

const Clipboard: typeof ClipboardInterface = Quill.import("modules/clipboard");
const Delta: typeof IDelta = Quill.import("delta");
type Header = 1 | 2 | 3 | 4 | 5 | 6;
type OPSItem = {
  insert: string;
  attributes?: {
    italic?: boolean;
    bold?: boolean;
    color?: string;
    colorPalette?: string;
    header?: Header;
    typographyFontStyle?: string;
  };
};

export default class PlainClipboard extends Clipboard {
  onPaste(e: ClipboardEvent): void {
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    const range = this.quill.getSelection();

    if (!range) {
      return;
    }

    let delta = new Delta().retain(range.index);
    const scrollTop = this.quill.scrollingContainer.scrollTop;
    this.container.focus();
    this.quill.selection.update(Quill.sources.SILENT);

    const v = this.quill.getFormat(range);

    setTimeout(() => {
      delta = delta.concat(this.convert()).delete(range.length);

      // @ts-expect-error, we use an specific type for OPSItem
      delta.ops.forEach((d: OPSItem) => {
        if (typeof d.insert === "string") {
          const header: Header | null = d?.attributes?.header ?? null;

          d.attributes = {
            ...v,
            ...d?.attributes,
            ...(header ? { typographyFontStyle: `heading${header}` } : {})
          };
        }

        return d;
      });

      //@ts-expect-error: Quil problems:
      // Type string | object | undefined is not assignable to type string | Record<string, unknown> | undefined
      this.quill.updateContents(delta, Quill.sources.USER);
      // range.length contributes to delta.length()
      this.quill.setSelection(
        delta.length() - range.length,
        0,
        Quill.sources.SILENT
      );
      this.quill.scrollingContainer.scrollTop = scrollTop;
      this.quill.focus();
    }, 1);
  }
}
