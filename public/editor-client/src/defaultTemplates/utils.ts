import { upperFirst } from "lodash";
import {
  APIPopup,
  BlockWithThumbs,
  Categories
} from "../types/DefaultTemplate";

export const converterPopup = (
  kit: APIPopup[],
  url: string
): {
  blocks: BlockWithThumbs[];
} => {
  const blocks: BlockWithThumbs[] = kit.map(
    ({
      id,
      title,
      categories,
      pro,
      thumbnail,
      thumbnailWidth,
      thumbnailHeight,
      blank
    }) => ({
      id: id,
      cat: [categories],
      title: title,
      thumbnailHeight,
      thumbnailWidth,
      thumbnailSrc: `${url}${thumbnail}`,
      pro: pro === "true",
      keywords: "popup2",
      position: 1,
      type: 0,
      blank
    })
  );

  return {
    blocks
  };
};

export function convertToCategories(obj: Record<string, string>): Categories[] {
  return Object.entries(obj).map(([_, title]) => ({
    id: title,
    slug: title.toLowerCase(),
    title: upperFirst(title)
  }));
}
