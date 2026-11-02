import Quill from "quill";

const Parchment = Quill.import("parchment");

class BlockOpacity extends Parchment.Attributor.Style {}

const OpacityAttributor = new BlockOpacity("block-opacity", "opacity", {
  scope: Parchment.Scope.BLOCK
});

export { OpacityAttributor as default };
