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
      thumbnailHeight
    }) => {
      return {
        layoutId: id,
        name: title,
        cat: categories.length
          ? categories.split(",").map((cat) => cat.trim())
          : [],
        pagesCount: pages,
        thumbnailSrc: `${thumbUrl}${thumbnail}`,
        thumbnailWidth,
        thumbnailHeight,
        blank: title === BLANK_PAGE
      };
    }
  );

export function convertToCategories(
  obj: { slug: string; title: string }[]
): Categories[] {
  return obj.map((item) => ({
    ...item,
    id: item.title
  }));
}
