import { load as cheerioLoad } from "cheerio";

type Declaration = { property: string; value: string };

// would break out of the generated rule or of the <style> tag
const unsafeChars = /[{}<]/;

// splits on ";" outside quotes and parentheses, so url("data:…;base64,…") stays whole
const splitDeclarations = (style: string): string[] => {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  let quote: string | undefined;

  for (const char of style) {
    if (quote) {
      if (char === quote) {
        quote = undefined;
      }
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth = Math.max(0, depth - 1);
    } else if (char === ";" && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  parts.push(current);

  return parts;
};

const parseDeclaration = (declaration: string): Declaration | undefined => {
  const index = declaration.indexOf(":");

  if (index === -1) {
    return undefined;
  }

  const name = declaration.slice(0, index).trim();
  const value = declaration.slice(index + 1).trim();

  if (name === "" || value === "") {
    return undefined;
  }

  return {
    property: name.startsWith("--") ? name : name.toLowerCase(),
    value
  };
};

const normalizeDeclarations = (style: string): string => {
  const declarations = splitDeclarations(style).flatMap((part) => {
    const declaration = parseDeclaration(part);
    return declaration ? [declaration] : [];
  });
  const properties = new Set(declarations.map(({ property }) => property));

  // a repeated property relies on its order, so only sort when all are unique
  const ordered =
    properties.size === declarations.length
      ? [...declarations].sort((a, b) => (a.property < b.property ? -1 : 1))
      : declarations;

  return ordered.map(({ property, value }) => `${property}:${value}`).join(";");
};

export const inlineStylesToClasses = (
  html: string,
  register: (declarations: string) => string
): string => {
  // 3rd arg `false` parses fragment without wrapping in <html><body>.
  const $ = cheerioLoad(html, undefined, false);

  $.root()
    .find("[style]")
    .each((_, el) => {
      const $el = $(el);
      const style = $el.attr("style") ?? "";

      if (unsafeChars.test(style)) {
        return;
      }

      const declarations = normalizeDeclarations(style);

      $el.removeAttr("style");

      if (declarations !== "") {
        $el.addClass(register(declarations));
      }
    });

  return $.root().html() ?? "";
};
