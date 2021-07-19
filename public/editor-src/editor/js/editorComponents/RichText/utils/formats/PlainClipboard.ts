import Quill from "quill";

const Clipboard = Quill.import("modules/clipboard");
const Delta = Quill.import("delta");

type Header = 1 | 2 | 3 | 4 | 5 | 6;
type OPSItem = {
  insert: string;
  attributes?: {
    italic?: boolean | null;
    bold?: boolean | null;
    color?: string | null;
    colorPalette?: string | null;
    header?: Header | null;
    typographyFontStyle?: string;
  };
};

export default class PlainClipboard extends Clipboard {
  onPaste(e: ClipboardEvent): void {
    if (e.defaultPrevented || !this.quill.isEnabled()) return;
    const range = this.quill.getSelection();
    let delta = new Delta().retain(range.index);
    const scrollTop = this.quill.scrollingContainer.scrollTop;
    this.container.focus();
    this.quill.selection.update(Quill.sources.SILENT);
    setTimeout(() => {
      delta = delta.concat(this.convert()).delete(range.length);

      delta.ops.forEach((d: OPSItem) => {
        if (typeof d.insert === "string") {
          const header: Header | null = d?.attributes?.header ?? null;

          d.attributes = {
            italic: d?.attributes?.italic ?? null,
            bold: d?.attributes?.bold ?? null,
            color: d?.attributes?.color ?? null,
            colorPalette: d?.attributes?.colorPalette ?? null,
            header,

            typographyFontStyle: header ? `heading${header}` : "paragraph"
          };
        }

        return d;
      });

      this.quill.updateContents(delta, Quill.sources.USER);
      // range.length contributes to delta.length()
      this.quill.setSelection(
        delta.length() - range.length,
        Quill.sources.SILENT
      );
      this.quill.scrollingContainer.scrollTop = scrollTop;
      this.quill.focus();
    }, 1);
  }
}
