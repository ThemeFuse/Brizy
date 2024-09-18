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

    const { type, linkToSlide, population } = value;

    node.removeAttribute("href");

    node.removeAttribute("target");
    node.setAttribute("data-href", link);
    node.classList.remove(
      "link--anchor",
      "link--external",
      "link--dynamic",
      "link--popup",
      "link--story",
      "link--upload",
      "link--page",
      "is-empty"
    );

    switch (type) {
      case "anchor":
        node.classList.add("link--anchor");
        break;
      case "external":
        node.classList.add("link--external");
        if (population) {
          node.classList.add("link--dynamic");
        }
        break;
      case "popup":
        node.classList.add("link--popup");
        break;
      case "upload":
        node.classList.add("link--upload");
        break;
      case "linkToSlide":
        node.classList.add("link--story");
        node.setAttribute("data-brz-link-story", linkToSlide);
        break;
      case "page":
        if (value.pageTitle) {
          node.classList.add("link--page");
        }
        return;
    }

    if (!value[type] && !population) {
      node.classList.add("is-empty");
    }
  }
  format(name, value) {
    if (name !== this.statics.blotName || !value) {
      return super.format(name, value);
    }
    value = this.constructor.sanitize(value);
    this.constructor.setAttributes(this.domNode, value);
  }
}
