import Quill from "quill";

const Block = Quill.import("blots/block");

class DCBlock extends Block {
  static className = "text-block";
  static create(value) {
    // biome-ignore lint/complexity/noThisInStatic: parchment's ShadowBlot.create reads `this.tagName` and `this.className`; calling Block.create rebinds `this` to Quill's Block, emitting a <p> with no `brz-tp__dc-block` marker instead of this blot's registered <div>
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
