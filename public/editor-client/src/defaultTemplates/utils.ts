import { flatten, uniq, upperFirst } from "lodash";
import {
  APIPopup,
  BlockWithThumbs,
  Categories,
  Kit,
  KitType,
  LayoutsAPI,
  LayoutTemplateWithThumbs
} from "../types/DefaultTemplate";
import { pipe } from "../utils/fp/pipe";

type CatTypes = Kit | APIPopup;

export const getUniqueKitCategories = (collections: CatTypes[]): Categories[] =>
  pipe(
    (collections: CatTypes[]) =>
      collections.map((collection: CatTypes) => collection.categories),
    flatten,
    uniq,
    (cats) =>
      cats.map((cat) => ({
        title: upperFirst(cat),
        slug: cat,
        id: cat
      }))
  )(collections);

export const getUniqueKitTypes = (collections: Kit[]): KitType[] =>
  pipe(
    (collections: Kit[]) => collections.map((collection) => collection.theme),
    flatten,
    uniq,
    (uni) =>
      uni.map((u) => ({
        title: upperFirst(u),
        id: u,
        name: u,
        icon: "nc-light"
      }))
  )(collections);

export const converterKit = (
  kit: Kit[],
  url: string,
  kitId: string
): {
  blocks: BlockWithThumbs[];
  categories: Categories[];
  types: KitType[];
} => {
  const categories = getUniqueKitCategories(kit);
  const types = getUniqueKitTypes(kit);

  const blocks: BlockWithThumbs[] = kit.map(
    ({
      slug,
      categories,
      pro,
      thumbnail,
      keywords,
      thumbnailWidth,
      thumbnailHeight
    }) => ({
      id: slug,
      cat: [categories],
      title: slug,
      type: types[0].name,
      keywords: keywords ?? "",
      thumbnailHeight,
      thumbnailWidth,
      thumbnailSrc: `${url}${thumbnail}`,
      pro: pro === "yes",
      kitId
    })
  );

  return {
    blocks,
    categories,
    types
  };
};

export const converterPopup = (
  kit: APIPopup[],
  url: string,
  kitId: string
): {
  blocks: BlockWithThumbs[];
  categories: Categories[];
} => {
  const categories = getUniqueKitCategories(kit);

  const blocks: BlockWithThumbs[] = kit.map(
    ({
      id,
      title,
      categories,
      pro,
      thumbnail,
      thumbnailWidth,
      thumbnailHeight
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
      kitId
    })
  );

  return {
    blocks,
    categories
  };
};

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

export const fetchAllElements = async <T>(
  url: string,
  id: string,
  itemsPerPage: number
): Promise<T[]> => {
  let allElements: T[] = [];

  const firstPageResponse = await fetch(
    `${url}?project_id=${id}&per_page=${itemsPerPage}`
  ).then((r) => r.json());

  const lastPage = firstPageResponse.paginationInfo.lastPage;

  allElements = allElements.concat(firstPageResponse.collections);

  for (let currentPage = 2; currentPage <= lastPage; currentPage++) {
    const nextPageResponse = await fetch(
      `${url}?project_id=${id}&per_page=${itemsPerPage}&page_number=${currentPage}`
    ).then((r) => r.json());

    allElements = allElements.concat(nextPageResponse.collections);
  }

  return allElements;
};

export const fetchAllLayouts = async <T>(
  url: string,
  itemsPerPage: number
): Promise<T[]> => {
  let allElements: T[] = [];

  const firstPageResponse = await fetch(`${url}?per_page=${itemsPerPage}`).then(
    (r) => r.json()
  );

  const lastPage = firstPageResponse.paginationInfo.lastPage;

  allElements = allElements.concat(firstPageResponse.collections);

  for (let currentPage = 2; currentPage <= lastPage; currentPage++) {
    const nextPageResponse = await fetch(
      `${url}?per_page=${itemsPerPage}&page_number=${currentPage}`
    ).then((r) => r.json());

    allElements = allElements.concat(nextPageResponse.collections);
  }

  return allElements;
};

export const fetchAllLayouts1 = async (
  url: string
): Promise<{ templates: LayoutsAPI[]; categories: Record<string, string> }> => {
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
