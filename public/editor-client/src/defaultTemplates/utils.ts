import { flatten, uniq, upperFirst } from "lodash";
import {
  APIPopup,
  BlockWithThumbs,
  Categories,
  Kit,
  KitType,
  Style
} from "../types/DefaultTemplate";
import { pipe } from "../utils/fp/pipe";

type CatTypes = Kit | APIPopup;

export const getUniqueKitCategories = (collections: CatTypes[]): Categories[] =>
  pipe(
    (collections: CatTypes[]) =>
      collections.map((collection: CatTypes) => collection.categories),
    (categories) => categories.map((category) => category.split(",")),
    flatten,
    (categories2) => categories2.map((category2) => category2.trim()),
    uniq,
    (allCats) => allCats.filter((cat) => cat && cat.length),
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
    (types) => types.map((type) => type.split(",")),
    flatten,
    (types2) => types2.map((type2) => type2.toLowerCase()),
    uniq,
    (uni) =>
      uni.map((u) => ({
        title: upperFirst(u),
        id: u,
        name: u,
        icon: u === "light" ? "nc-light" : "nc-dark"
      }))
  )(collections);

export const converterKit = (
  kit: Kit[],
  url: string,
  kitId: string
): {
  blocks: BlockWithThumbs[];
  types: KitType[];
} => {
  const types = getUniqueKitTypes(kit);

  const blocks: BlockWithThumbs[] = kit.map(
    ({
      slug,
      categories,
      pro,
      thumbnail,
      keywords,
      thumbnailWidth,
      thumbnailHeight,
      blank,
      theme
    }) => ({
      id: slug,
      cat: categories.split(",").map((item) => item.trim()),
      title: slug,
      type: theme
        .split(",")
        .map((item) => item.trim())
        .map((i1) => i1.toLowerCase()),
      keywords: keywords ?? "",
      thumbnailHeight,
      thumbnailWidth,
      thumbnailSrc: `${url}${thumbnail}`,
      pro: pro === "yes",
      kitId,
      blank
    })
  );

  return {
    blocks,
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
      type: [0],
      kitId
    })
  );

  return {
    blocks,
    categories
  };
};

export const fetchAllElements = async <T>(
  url: string,
  id: string,
  itemsPerPage: number
): Promise<{ elements: T[]; styles: Style }> => {
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

  return { elements: allElements, styles: firstPageResponse.styles };
};

export const fetchAllLayouts1 = async (
  url: string,
  id: string
): Promise<{
  blocks: Kit[];
  categories: Record<string, string>;
  styles: Style;
}> => {
  const res = await fetch(`${url}?project_id=${id}`).then((r) => r.json());

  return {
    blocks: res.collections,
    categories: res.categories,
    styles: res.styles
  };
};

export function convertToCategories(obj: Record<string, string>): Categories[] {
  return Object.entries(obj).map(([_, title]) => ({
    id: title,
    slug: title.toLowerCase(),
    title: upperFirst(title)
  }));
}
