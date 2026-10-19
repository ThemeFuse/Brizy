const BRACES = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

function convert(data: string): unknown {
  if (data === "true") {
    return true;
  }

  if (data === "false") {
    return false;
  }

  if (data === "null") {
    return undefined;
  }

  if (data === `${+data}`) {
    return +data;
  }

  if (BRACES.test(data)) {
    return JSON.parse(data);
  }

  return data;
}

// A `data-*` attribute with its value read as a boolean, a number or json when it looks like one.
export function readDataAttr(element: Element, name: string): unknown {
  const data = element.getAttribute(`data-${name}`);

  if (data === null) {
    return undefined;
  }

  try {
    return convert(data);
  } catch {
    return data;
  }
}
