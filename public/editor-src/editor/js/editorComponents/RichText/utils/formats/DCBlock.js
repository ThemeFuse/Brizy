import Quill from "quill";

let Block = Quill.import("blots/block");

class DCBlock extends Block {
  static className = "text-block";
  static create(value) {
    const node = super.create(value);
    node.classList.add("brz-tp__dc-block-st1");
    return node;
  }

  static formats() {
    return true;
  }

  format(name, value) {
    if (name !== this.statics.blotName || !value)
      return super.format(name, value);

    this.domNode.classList.add("brz-tp__dc-block-st1");
  }
}

DCBlock.blotName = "dcBlock";
DCBlock.tagName = "div";
DCBlock.className = "brz-tp__dc-block";

export default DCBlock;
