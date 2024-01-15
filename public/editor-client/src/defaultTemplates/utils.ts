import { upperFirst } from "lodash";
import {
  Categories,
  LayoutsAPI,
  LayoutTemplateWithThumbs
} from "../types/DefaultTemplate";

export const convertLayouts = (
  collections: LayoutsAPI[],
  thumbUrl: string
): LayoutTemplateWithThumbs[] =>
  collections.map(
    ({
      title,
      categories,
      pagesCount,
      pro,
      keywords,
      thumbnailWidth,
      thumbnailHeight,
      thumbnail,
      slug
    }) => {
      return {
        name: title,
        cat: categories.split(",").map((item) => item.trim()),
        pagesCount: Number(pagesCount),
        pro: pro === "True",
        keywords,
        thumbnailWidth,
        thumbnailHeight,
        thumbnailSrc: `${thumbUrl}${thumbnail}`,
        layoutId: slug
      };
    }
  );

export function convertToCategories(
  obj: { slug: string; title: string }[]
): Categories[] {
  return obj.map((item) => ({
    ...item,
    id: upperFirst(item.title.toLowerCase())
  }));
}
