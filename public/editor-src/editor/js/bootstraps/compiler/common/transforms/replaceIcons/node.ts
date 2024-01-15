import fs from "fs";
import util from "util";

export const replace = async (
  $: cheerio.Root,
  buildPath: string
): Promise<void> => {
  const readFile = util.promisify(fs.readFile);
  const svgs: Array<{ type: string; name: string; node: cheerio.Cheerio }> = [];

  $(".brz-icon-svg").each(function (this: cheerio.Element) {
    const $this = $(this);
    const { type, name } = $this.data();

    if (type && name) {
      svgs.push({ type, name, node: $this });
    }
  });

  const pSvg = svgs.map(async ({ type, name, node }) => {
    const svg = await readFile(
      `${buildPath}/editor/icons/${type}/${name}.svg`,
      "utf-8"
    );

    try {
      const $svg = $(svg);
      const attributes = Object.entries(node.attr());

      for (let i = 0; i < attributes.length; i++) {
        const [name, value] = attributes[i];
        $svg.attr(name, value);
      }

      node.replaceWith($svg);
    } catch (e) {
      // @ts-expect-error: Error stack
      console.log("Error:", e.stack);
    }
  });

  await Promise.all(pSvg);
};
