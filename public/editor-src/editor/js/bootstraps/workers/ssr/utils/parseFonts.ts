import { Block, Project } from "visual/types";
import { getUsedModelsFonts, getUsedStylesFonts } from "visual/utils/traverse";
import { Font } from "visual/utils/traverse/common";

/**
 * parseFonts() returns arrays of fonts
 * used in page and project [{ family: "lato", type: "google" }]
 */
export type ParsedFonts = Array<Font>;
export const parseFonts = (
  blocks: Array<Block>,
  project: Project
): ParsedFonts => {
  // get fonts from page
  const pageFonts = getUsedModelsFonts({
    models: blocks
  });

  // get fonts from selectedStyle
  const { selectedStyle, styles, extraFontStyles = [] } = project.data;
  const currentStyle = styles.find((style) => style.id === selectedStyle) ?? {
    fontStyles: []
  };
  const fontStyles = currentStyle.fontStyles;
  const stylesFonts = getUsedStylesFonts([...fontStyles, ...extraFontStyles]);

  // merge fonts
  return [...pageFonts, ...stylesFonts].reduce((acc, curr) => {
    return acc.some(({ family }) => family === curr.family)
      ? acc
      : [...acc, curr];
  }, [] as Array<Font>);
};
