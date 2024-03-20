import Quill from "quill";

// import { getStyle } from "./BackgroundGradient";

let Parchment = Quill.import("parchment");
const List = Quill.import("formats/list");
const ListItemBlot = Quill.import("formats/list/item");

class CustomListItem extends ListItemBlot {
  format(name, value) {
    if (name === List.blotName && !value) {
      this.replaceWith(Parchment.create(this.statics.scope));
    } else {
      super.format(name, value);

      this.copyFormatToParent("color", "block-color");
      this.copyFormatToParent("opacity", "block-opacity");
      this.copyFormatToParent("colorPalette", "block-colorPalette");
    }
  }

  copyFormatToParent(oldName, newName) {
    if (this.children.length === 1) {
      const child = this.children.head;
      const { attributes = {} } = child.attributes || {};

      if (attributes[oldName]) {
        const value = attributes[oldName].value(child.domNode);
        super.format(newName, value);
      }
    } else {
      if (this.attributes.hasOwnProperty(newName)) {
        super.format(newName, null);
      }
    }
  }
}

export { CustomListItem as default };
