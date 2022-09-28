import { decryptIcon, fetchIcon } from "visual/component/ThemeIcon/utils";

let cache: Record<string, cheerio.Cheerio> = {};

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
      const cached = cache[cacheKey];

      if (cached !== undefined) {
        node.replaceWith(cached);
      } else {
        const iconStr = await fetchIcon(type, name);

        const svg = decryptIcon(iconStr);

        if (svg) {
          const $svg = $(svg);
          const attributes = Object.entries(node.attr());

          for (let i = 0; i < attributes.length; i++) {
            const [name, value] = attributes[i];
            $svg.attr(name, value);
          }

          cache[cacheKey] = $svg;
          node.replaceWith($svg);
        }
      }
    } catch (e) {
      console.log("Error:", e.stack);
    }
  }

  cache = {};
};
