import Quill from "quill";

let Parchment = Quill.import("parchment");

class BlockColor extends Parchment.Attributor.Style {
  value(node) {
    let value = super.value(node);

    if (!value.startsWith("rgb(")) return value;

    value = value.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");

    return (
      "#" +
      value
        .split(",")
        .map(function(component) {
          return ("00" + parseInt(component, 10).toString(16)).slice(-2);
        })
        .join("")
    );
  }
}

const ColorAttributor = new BlockColor("block-color", "color", {
  scope: Parchment.Scope.BLOCK
});

export { ColorAttributor as default };
