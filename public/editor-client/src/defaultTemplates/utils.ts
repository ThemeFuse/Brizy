import { trim, upperFirst } from "lodash";
import { Categories, PagesAPI, PagesTemplate } from "../types/DefaultTemplate";

export const convertPages = (
  collections: PagesAPI[],
  thumbUrl: string
): PagesTemplate[] =>
  collections.map(
    ({
      title,
      categories,
      thumbnailWidth,
      thumbnailHeight,
      thumbnail,
      slug
    }) => {
      return {
        title: title,
        slug: slug,
        cat: categories.split(",").map(trim),
        thumbnailWidth,
        thumbnailHeight,
        thumbnailSrc: `${thumbUrl}${thumbnail}`
      };
    }
  );

export function convertToCategories(obj: Record<string, string>): Categories[] {
  return Object.entries(obj).map(([_, title]) => ({
    id: upperFirst(title),
    slug: title.toLowerCase(),
    title: upperFirst(title)
  }));
}
