const nodeTypes = {
  ELEMENT_NODE: 1
};

export function getElementsByClassName(node, className) {
  const ret = [];

  visitNode(node, node => {
    if (node.nodeType === nodeTypes.ELEMENT_NODE) {
      if (hasClassName(node, className)) {
        ret.push(node);
      }
    }
  });

  return ret;
}

export function getElementsByTagName(node, tagName) {
  const ret = [];

  visitNode(node, node => {
    if (node.nodeType === nodeTypes.ELEMENT_NODE) {
      if (node.tagName === tagName) {
        ret.push(node);
      }
    }
  });

  return ret;
}

export function getElementsByAttribute(node, attributeName, attributeValue) {
  const ret = [];

  visitNode(node, node => {
    if (node.nodeType === nodeTypes.ELEMENT_NODE) {
      const nodeAttributes = Array.from(node.attributes);
      let nodeAdded = false;

      nodeAttributes.forEach(attribute => {
        if (
          !nodeAdded &&
          attribute.nodeName === attributeName &&
          (attributeValue === undefined ||
            attribute.nodeValue === attributeValue)
        ) {
          ret.push(node);
          nodeAdded = true;
        }
      });
    }
  });

  return ret;
}

export function removeNode(node) {
  node.parentNode.removeChild(node);
}

export function css(node, property, value) {
  // extract the property name and value
  const regex = /\s*(.+?):\s*(.+?);/g;
  let style = node.getAttribute("style");

  // normalize input for the regex to work properly
  if (style[style.length - 1] !== ";") {
    style += ";";
  }

  if (typeof property === "object") {
    const styleStr = Object.entries(property)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
    node.setAttribute("style", `${style} ${styleStr}`);
    return;
  }

  if (property && value && typeof property === "string") {
    node.setAttribute("style", `${style} ${property}: ${value};`);
    return;
  }

  const styleObj = {};
  {
    let match, property, value;
    while ((match = regex.exec(style))) {
      [, property, value] = match;

      styleObj[property] = value;
    }
  }

  return property ? styleObj[property] : styleObj;
}

export function closestByClassName(node, className) {
  do {
    if (node.nodeType === nodeTypes.ELEMENT_NODE) {
      if (hasClassName(node, className)) {
        return node;
      }
    }
  } while ((node = node.parentNode));

  return null;
}

export function hasClassName(node, className) {
  const nodeClassName = node.getAttribute("class");
  const regex = new RegExp(`\\b${className}\\b`);

  return regex.test(nodeClassName);
}

export function removeClassName(node, className) {
  const nodeClassName = node.getAttribute("class");
  const regex = new RegExp(`\\b${className}\\b`, "g");

  node.setAttribute("class", nodeClassName.replace(regex, ""));
}

export function children(node) {
  return Array.from(node.childNodes);
}

function visitNode(node, callback) {
  if (callback(node)) {
    return true;
  }

  if ((node = node.firstChild)) {
    do {
      if (visitNode(node, callback)) {
        return true;
      }
    } while ((node = node.nextSibling));
  }
}
