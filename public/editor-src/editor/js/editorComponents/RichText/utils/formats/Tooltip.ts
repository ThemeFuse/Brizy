import Quill from "quill";
import { encodeToString, parseFromString } from "visual/utils/string";
import { uuid } from "visual/utils/uuid";
import { TooltipFormat } from "../../types";

const Inline = Quill.import("blots/inline");

class TooltipBlot extends Inline {
  static create(value: string) {
    const node = super.create(value);

    const parsed = parseFromString<TooltipFormat>(value ?? "{}") ?? {};

    if (!parsed.tooltipId) {
      parsed.tooltipId = uuid();
    }

    this.setAttributes(node, encodeToString(parsed));
    return node;
  }

  static formats(node: Element) {
    return node.getAttribute("data-tooltip");
  }

  static setAttributes(node: Element, value: string) {
    const current = node.getAttribute("data-tooltip");
    const currentParsed = parseFromString<TooltipFormat>(current ?? "{}") ?? {};

    const patch = parseFromString<Partial<TooltipFormat>>(value ?? "{}") ?? {};

    const updated = {
      ...currentParsed,
      ...patch
    };

    const { enableTooltip } = updated;

    if (enableTooltip === "on") {
      node.setAttribute("data-tooltip", encodeToString(updated));
    } else {
      node.removeAttribute("data-tooltip");
    }
  }

  format(name: string, value: string) {
    if (name !== this.statics.blotName || !value) {
      return super.format(name, value);
    }

    const currentAttr = this.domNode.getAttribute("data-tooltip");
    const currentParsed = parseFromString<TooltipFormat>(currentAttr ?? "{}");
    const incomingParsed = parseFromString<TooltipFormat>(value ?? "{}");

    // Update only if the IDs match
    if (
      currentParsed?.tooltipId &&
      incomingParsed?.tooltipId &&
      currentParsed.tooltipId === incomingParsed.tooltipId
    ) {
      TooltipBlot.setAttributes(this.domNode, value);
    }
  }
}

TooltipBlot.blotName = "tooltip";
TooltipBlot.tagName = "span";

export default TooltipBlot;
