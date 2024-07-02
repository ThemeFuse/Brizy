import { Num } from "@brizy/readers";
import { flatten, uniq, upperFirst } from "lodash";
import {
  BlockWithThumbs,
  Categories,
  CustomTemplatePage,
  Kit,
  KitType,
  LayoutsAPI,
  LayoutsPageAPI,
  LayoutTemplateWithThumbs
} from "../types/DefaultTemplate";
import { pipe } from "../utils/fp/pipe";

const PRO = "PRO";

export const getUniqueKitTypes = (collections: Kit[]): KitType[] =>
  pipe(
    (collections: Kit[]) => collections.map((collection) => collection.theme),
    (types) => types.map((type) => type.split(",")),
    flatten,
    (flatTypes) => flatTypes.filter((type) => type.length),
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
      cat: categories.split(",").map((item) => item.trim().toLowerCase()),
      title: slug,
      type: theme
        .split(",")
        .map((item) => item.trim())
        .map((i1) => i1.toLowerCase()),
      keywords: keywords ?? "",
      thumbnailHeight,
      thumbnailWidth,
      thumbnailSrc: `${url}${thumbnail}`,
      pro: pro === PRO,
      kitId,
      blank
    })
  );

  return {
    blocks,
    types
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
        cat: categories.split(",").map((item) => item.trim().toLowerCase()),
        pagesCount: Num.read(pagesCount) ?? 0,
        pro: pro === PRO,
        keywords,
        thumbnailWidth,
        thumbnailHeight,
        thumbnailSrc: `${thumbUrl}${thumbnail}`,
        layoutId: slug
      };
    }
  );

export const convertLayoutPages = (
  layouts: LayoutsPageAPI[],
  templatesImageUrl: string,
  id: string
): CustomTemplatePage[] =>
  layouts.map(
    ({
      slug,
      title,
      thumbnailHeight,
      thumbnailWidth,
      thumbs
    }: LayoutsPageAPI) => ({
      id: slug,
      title,
      thumbnailWidth,
      thumbnailHeight,
      thumbnailSrc: `${templatesImageUrl}${thumbs}`,
      layoutId: id
    })
  );

export function convertToCategories(
  obj: { slug: string; title: string }[]
): Categories[] {
  return obj.map((item) => ({
    ...item,
    id: item.title.toLowerCase()
  }));
}
