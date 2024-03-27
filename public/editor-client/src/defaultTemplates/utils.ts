import { upperFirst } from "lodash";
import {
  Categories,
  LayoutsAPI,
  LayoutTemplateWithThumbs,
  StoriesAPI,
  StoriesTemplateWithThumbs
} from "../types/DefaultTemplate";

const BLANK_PAGE = "Blank";

export const convertLayouts = (
  collections: LayoutsAPI[],
  thumbUrl: string
): LayoutTemplateWithThumbs[] =>
  collections.map(
    ({
      title,
      categories,
      color,
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
        color,
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

export const convertStories = (
  collections: StoriesAPI[],
  thumbUrl: string
): StoriesTemplateWithThumbs[] =>
  collections.map(
    ({
      categories,
      pages,
      id,
      title,
      thumbnail,
      thumbnailWidth,
      thumbnailHeight,
      color
    }) => {
      return {
        layoutId: id,
        name: title,
        cat: categories.length
          ? categories.split(",").map((cat) => cat.trim())
          : [],
        color: color,
        pagesCount: pages,
        thumbnailSrc: `${thumbUrl}${thumbnail}`,
        thumbnailWidth,
        thumbnailHeight,
        blank: title === BLANK_PAGE
      };
    }
  );

export const fetchAllLayouts1 = async (
  url: string
): Promise<{ templates: LayoutsAPI[]; categories: Record<string, string> }> => {
  const res = await fetch(url).then((r) => r.json());

  return { templates: res.collections, categories: res.categories };
};

export const fetchAllStories1 = async (
  url: string
): Promise<{
  templates: Array<StoriesAPI>;
  categories: Record<string, string>;
}> => {
  const res = await fetch(url).then((r) => r.json());

  return { templates: res.collections, categories: res.categories };
};

export function convertToCategories(obj: Record<string, string>): Categories[] {
  return Object.entries(obj).map(([_, title]) => ({
    id: upperFirst(title),
    slug: title.toLowerCase(),
    title: upperFirst(title)
  }));
}
