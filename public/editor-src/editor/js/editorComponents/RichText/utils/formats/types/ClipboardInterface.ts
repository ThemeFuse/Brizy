import Quill, { type Sources } from "quill";
import type Delta from "quill-delta";

declare class Selection {
  update(s: Sources): void;
}

declare class ExtendedQuill extends Quill {
  container: Element;
  scrollingContainer: Element;
  selection: Selection;
}

export declare class ClipboardInterface {
  public quill: ExtendedQuill;
  public container: HTMLElement;
  convert(): Delta;
}
