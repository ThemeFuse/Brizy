import Quill from "quill";
import { decodeFromString } from "visual/utils/string";
const Link = Quill.import("formats/link");

export default class linkType extends Link {
  static create(link) {
    let node = super.create(link);
    link = this.sanitize(link);
    this.setAttributes(node, link);

    return node;
  }
  static formats(domNode) {
    return domNode.getAttribute("data-href");
  }
  static setAttributes(node, link) {
    const value = decodeFromString(link);
    const { type } = value;

    node.removeAttribute("href");
    node.removeAttribute("target");
    node.setAttribute("data-href", link);
    node.classList.remove(
      "link--anchor",
      "link--external",
      "link--popup",
      "is-empty"
    );

    if (type === "anchor") {
      node.classList.add("link--anchor");
    }
    if (type === "external") {
      node.classList.add("link--external");
    }
    if (type === "popup") {
      node.classList.add("link--popup");
    }

    if (!value[type]) {
      node.classList.add("is-empty");
    }
  }
  format(name, value) {
    if (name !== this.statics.blotName || !value)
      return super.format(name, value);
    value = this.constructor.sanitize(value);
    this.constructor.setAttributes(this.domNode, value);
  }
}
