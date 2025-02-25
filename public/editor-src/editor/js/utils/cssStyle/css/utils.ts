import { makeAttr } from "visual/utils/i18n/attribute";
import { uuid } from "visual/utils/uuid";
import { MValue } from "visual/utils/value";

export const addUuid = (node: Element): void =>
  node.setAttribute(makeAttr("css-uid"), uuid(6));

export const getNodeWithNewReference = (
  node: Element,
  doc: Document
): MValue<Element> => {
  const attr = makeAttr("css-uid");
  const oldNodeId = node.getAttribute(attr);

  if (oldNodeId) {
    const oldNode = doc.querySelector(`style[${attr}=${oldNodeId}]`);

    if (oldNode) {
      return oldNode;
    }
  }
};
