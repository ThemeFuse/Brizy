import { decryptIcon, fetchIcon } from "visual/component/ThemeIcon/utils";

let cache: Record<string, string> = {};

const replaceWith = (
  $: cheerio.Root,
  svg: string,
  node: cheerio.Cheerio
): void => {
  const $svg = $(svg);
  const attributes = Object.entries(node.attr());

  for (let i = 0; i < attributes.length; i++) {
    const [name, value] = attributes[i];
    $svg.attr(name, value);
  }
  node.replaceWith($svg);
};

export const replaceIcons = async ($: cheerio.Root): Promise<void> => {
  const svgs: Array<{ type: string; name: string; node: cheerio.Cheerio }> = [];

  $(".brz-icon-svg").each(function (this: cheerio.Element) {
    const $this = $(this);
    const { type, name } = $this.data();

    if (type && name) {
      svgs.push({ type, name, node: $this });
    }
  });

  for (const { type, name, node } of svgs) {
    try {
      const cacheKey = `${type}:${name}`;
      const cachedSvg = cache[cacheKey];

      if (cachedSvg !== undefined) {
        replaceWith($, cachedSvg, node);
      } else {
        const iconStr = await fetchIcon(type, name);
        const svg = decryptIcon(iconStr);

        if (svg) {
          cache[cacheKey] = svg;
          replaceWith($, svg, node);
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log("Error:", e.stack);
      }
    }
  }

  cache = {};
};
