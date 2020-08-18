import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);

export default async function replaceIcons($, buildPath) {
  const svgs = [];

  $(".brz-icon-svg").each(function() {
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
      console.log("Error:", e.stack);
    }
  });

  return Promise.all(pSvg);
}
