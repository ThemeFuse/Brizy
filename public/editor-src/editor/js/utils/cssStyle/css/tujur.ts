import { Sheet } from "visual/providers/StyleProvider/Sheet";
import { murmurhash2 } from "visual/utils/crypto";
import { makeAttr } from "visual/utils/i18n/attribute";
import type { OutputStyleWithSymbol } from "../types";
import {
  DEFAULT_CLASSNAME_PREFIX,
  RULES_CLASSNAME_PREFIX,
  addUuid,
  getNodeWithNewReference
} from "./utils";

// ====== tujur ======
export function css(
  _componentId: string,
  symbolClassName: string,
  [defaultStyle, rulesStyle, elementStyle, symbolStyle]: OutputStyleWithSymbol,
  sheet: Readonly<Sheet>
) {
  let defaultData;
  const isBrowser = typeof window !== "undefined";
  const componentId = _componentId.toLowerCase();
  const instanceId = sheet.getInstanceId() ?? "";
  const defaultClassName = `${DEFAULT_CLASSNAME_PREFIX}${murmurhash2(instanceId + componentId + defaultStyle)}`;
  const rulesClassName = `${RULES_CLASSNAME_PREFIX}${murmurhash2(instanceId + componentId + rulesStyle)}`;
  if (defaultStyle) {
    defaultData = sheet.get(defaultClassName);

    // we don't treat the else clause because we assume that
    // default styles will be the same for a given id no matter
    // how many times this function will be called
    if (!defaultData) {
      const cssText = replacePlaceholders(defaultStyle, defaultClassName);
      let node;

      if (isBrowser) {
        const doc = sheet.getDoc() ?? document;
        node = doc.createElement("style");

        addUuid(node);

        if (process.env.NODE_ENV === "development") {
          node.setAttribute(makeAttr("css"), `default-${_componentId}`);
        }
        node.appendChild(doc.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;
        insertStyleNodeIntoDOM("default", { node, doc, sheet });
      }

      defaultData = {
        node,
        className: defaultClassName,
        cssText
      };

      sheet.setCSSOrdered({
        type: "default",
        data: defaultData
      });
      sheet.set(defaultClassName, defaultData);
    } else {
      const { node, className, cssText } = defaultData;
      const cssTextNext = replacePlaceholders(defaultStyle, className);

      if (cssTextNext !== cssText) {
        if (node) {
          node.childNodes[0].nodeValue = cssTextNext;
        }

        defaultData.cssText = cssTextNext;
      }
    }
  }

  let rulesData;
  if (rulesStyle) {
    rulesData = sheet.get(rulesClassName);
    if (!rulesData) {
      const cssText = replacePlaceholders(rulesStyle, rulesClassName);
      let node;

      if (isBrowser) {
        const doc = sheet.getDoc() ?? document;
        node = doc.createElement("style");

        addUuid(node);

        if (process.env.NODE_ENV === "development") {
          node.setAttribute(makeAttr("css"), `rules-${_componentId}`);
        }
        node.appendChild(doc.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;

        insertStyleNodeIntoDOM("rules", { node, doc, sheet });
      }

      rulesData = {
        node,
        className: rulesClassName,
        cssText
      };

      sheet.setCSSOrdered({
        type: "rules",
        data: rulesData
      });
      sheet.set(rulesClassName, rulesData);
    }
  }

  let elementData;
  if (elementStyle) {
    elementData = sheet.get(symbolClassName);

    if (!elementData) {
      const className = symbolClassName;
      const cssText = replacePlaceholders(elementStyle, className);

      let node;

      if (isBrowser) {
        const doc = sheet.getDoc() ?? document;
        node = doc.createElement("style");

        addUuid(node);

        if (process.env.NODE_ENV === "development") {
          node.setAttribute(makeAttr("css"), `custom-${_componentId}`);
        }
        node.appendChild(doc.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;

        insertStyleNodeIntoDOM("custom", { node, doc, sheet });
      }

      elementData = {
        node,
        className,
        cssText
      };

      sheet.setCSSOrdered({
        type: "custom",
        data: elementData
      });

      sheet.set(symbolClassName, elementData);
    } else {
      const { className, cssText } = elementData;
      let { node } = elementData;
      const cssTextNext = replacePlaceholders(elementStyle, className);

      if (cssTextNext !== cssText) {
        if (node && !document.head.contains(node)) {
          const doc = sheet.getDoc() ?? document;

          const newRef = getNodeWithNewReference(node, doc);

          if (newRef) {
            node = newRef;
            elementData.node = newRef;
          }
        }

        if (node) {
          node.childNodes[0].nodeValue = cssTextNext;
        }

        elementData.cssText = cssTextNext;
      }
    }
  }

  let symbolData;
  if (symbolStyle) {
    symbolData = sheet.get(symbolClassName);

    if (!symbolData) {
      const className = symbolClassName;
      const cssText = replacePlaceholders(symbolStyle, className);

      let node;

      if (isBrowser) {
        const doc = sheet.getDoc() ?? document;
        node = doc.createElement("style");

        addUuid(node);

        if (process.env.NODE_ENV === "development") {
          node.setAttribute(makeAttr("css"), `symbol-${_componentId}`);
        }
        node.appendChild(doc.createTextNode(""));
        node.childNodes[0].nodeValue = cssText;

        insertStyleNodeIntoDOM("custom", { node, doc, sheet });
      }

      symbolData = {
        node,
        className,
        cssText
      };

      sheet.setCSSOrdered({
        type: "symbol",
        data: symbolData
      });

      sheet.set(symbolClassName, symbolData);
    } else {
      const { className, cssText } = symbolData;
      let { node } = symbolData;
      const cssTextNext = replacePlaceholders(symbolStyle, className);

      if (cssTextNext !== cssText) {
        if (node && !document.head.contains(node)) {
          const doc = sheet.getDoc() ?? document;

          const newRef = getNodeWithNewReference(node, doc);

          if (newRef) {
            node = newRef;
            symbolData.node = newRef;
          }
        }

        if (node) {
          node.childNodes[0].nodeValue = cssTextNext;
        }

        symbolData.cssText = cssTextNext;
      }
    }
  }

  return [
    ...(defaultData ? [defaultData.className] : []),
    ...(rulesData ? [rulesData.className] : []),
    ...(elementData ? [elementData.className] : []),
    ...(symbolData ? [symbolData.className] : [])
  ].join(" ");
}

// Used only for RichText (Quill lines + RichText container element segment).
//
// Why a separate function from css():
//   The general css() keys element/symbol entries by per-instance id, which
//   means cloned RichTexts produce one <style> node per clone even when their
//   element CSS is identical. RichText needs dedup across clones, so css1
//   keys by content hash and tracks live owners with a refcount.
//
// Lifecycle:
//   1. Caller invokes css1(id, elementStyle, sheet) on each render.
//   2. styleHash = murmurhash2(elementStyle). Identical content → identical
//      hash → identical className → identical sheet key. First caller creates
//      the <style> node + sheet entry; subsequent callers reuse them.
//   3. Counter is incremented every call. Caller must invoke clean() once per
//      call (typically via a tracking Map fired on re-render and unmount —
//      see RichText.trackContainerCss / Quill.trackCss).
//   4. clean() decrements the counter. Node + sheet entry + cssOrdered entry
//      are removed only when counter hits 0 (last owner gone).
export function css1(
  _elementID: string,
  elementStyle: string,
  sheet: Readonly<Sheet>,
  replacePlaceholdersCb = replacePlaceholders
) {
  // Hash the element style: identical content across instances → identical
  // className. _elementID is intentionally NOT in the hash — that's the whole
  // point of dedup.
  const styleHash = murmurhash2(elementStyle);
  const className = `brz-css-${styleHash}`;
  const key = `css1-${styleHash}`;
  const isBrowser = typeof window !== "undefined";

  let elementData = sheet.get(key);

  // First owner for this content: build node + register in sheet.
  // Later owners with same content fall through and only bump the counter.
  if (!elementData) {
    const cssText = replacePlaceholdersCb(elementStyle, className);
    let node;

    if (isBrowser) {
      const doc = sheet.getDoc() ?? document;

      node = doc.createElement("style");
      if (process.env.NODE_ENV === "development") {
        // Tag the node with its className so DevTools can identify the
        // RichText origin (general css() uses default-/rules-/custom-/symbol-
        // prefixes; we use richText- for css1 to distinguish them).
        node.setAttribute(makeAttr("css"), `richText-${className}`);
      }
      node.appendChild(doc.createTextNode(""));
      node.childNodes[0].nodeValue = cssText;

      insertStyleNodeIntoDOM("custom", { node, doc, sheet });
    }

    elementData = {
      node,
      className,
      cssText
    };
    sheet.setCSSOrdered({
      type: "custom",
      data: elementData
    });
    sheet.set(key, elementData);
  }

  // Always increment — every call gets its own clean() and is one live owner.
  sheet.incrementClassNameCounter(className);

  return {
    className: elementData.className,
    cssText: elementData.cssText,
    // Decrement and only tear down on the LAST owner. Safe to call even if
    // the entry was already cleaned (defensive get() check) and safe to call
    // across iframe doc swaps because node.remove() walks node's actual parent
    // (no throw if detached).
    clean() {
      const data = sheet.get(key);
      if (!data) return;

      const count = sheet.decrementClassNameCounter(className);
      if (count > 0) return;

      if (data.node) {
        data.node.remove();
      }
      sheet.deleteFromCSSOrdered(data.className);
      sheet.delete(key);
    }
  };
}

export function replacePlaceholders(styles: string, className: string) {
  const s = styles.replace(/{{WRAPPER}}/gm, `.${className}`);
  return s.replace(/&&/gm, `.${className}`);
}

function insertStyleNodeIntoDOM(
  styleType: "default" | "rules" | "custom",
  data: {
    node: HTMLElement;
    doc: Document;
    sheet: Readonly<Sheet>;
  }
) {
  const { node: styleNode, doc, sheet } = data;
  const cssOrdered = sheet.getCSSOrdered();
  const default_ = cssOrdered.default; // can't use default as a identifier
  const rules = cssOrdered.rules;
  const custom = cssOrdered.custom;
  let refNode;

  switch (styleType) {
    case "default":
      refNode = default_.length > 0 ? default_[default_.length - 1].node : null;
      break;
    case "rules":
      refNode =
        rules.length > 0
          ? rules[rules.length - 1].node
          : default_.length > 0
            ? default_[default_.length - 1].node
            : null;
      break;
    case "custom":
      refNode =
        custom.length > 0
          ? custom[custom.length - 1].node
          : rules.length > 0
            ? rules[rules.length - 1].node
            : default_.length > 0
              ? default_[default_.length - 1].node
              : null;
      break;
    default:
      throw new Error("invalid tujur css node type: " + styleType);
  }

  if (refNode) {
    if (!doc.head.contains(refNode)) {
      const newRef = getNodeWithNewReference(refNode, doc);

      if (newRef) {
        refNode = newRef;
      }
    }

    refNode.insertAdjacentElement("afterend", styleNode);
  } else {
    let beforeNode: Element | null = null;

    if (styleType === "default") {
      beforeNode = rules[0]?.node ?? custom[0]?.node ?? null;
    }

    if (styleType === "rules") {
      beforeNode = custom[0]?.node ?? null;
    }

    if (beforeNode) {
      if (!doc.head.contains(beforeNode)) {
        const newRef = getNodeWithNewReference(beforeNode, doc);
        if (newRef) {
          beforeNode = newRef;
        }
      }

      if (beforeNode && doc.head.contains(beforeNode)) {
        doc.head.insertBefore(styleNode, beforeNode);
      } else {
        doc.head.appendChild(styleNode);
      }
    } else {
      doc.head.appendChild(styleNode);
    }
  }
}
