import Quill from "quill";

let Block = Quill.import("blots/block");

class Div extends Block {
  static create() {
    const node = super.create();
    node.classList.add("brz-tp__dc-block");
    node.classList.add("brz-tp__dc-block-st1");
    return node;
  }
}

Div.blotName = "div";
Div.tagName = "div";

export default Div;
