import { pipe } from "@/utils/fp/pipe";
import { Num, Obj, Str } from "@brizy/readers";
import { flatten, uniq, upperFirst } from "lodash";
import {
  APIPopup,
  BlockWithThumbs,
  Categories,
  CustomTemplatePage,
  DefaultBlock,
  DefaultBlockWithID,
  Kit,
  KitDataItems,
  KitDataResult,
  KitType,
  LayoutDataResult,
  LayoutsAPI,
  LayoutsPageAPI,
  LayoutTemplateWithThumbs,
  PopupBlockWithThumbs,
  PopupDataResult,
  PopupsResponse,
  StoriesAPI,
  StoriesTemplateWithThumbs,
  StoryDataResponse,
  StoryPages
} from "../types/DefaultTemplate";

const PRO = "PRO";
const BLANK_PAGE = "Blank";

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
    (allTypes) => allTypes.filter((type) => type && type.length),
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
    categories,
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
    }) => ({
      name: title,
      cat: categories.split(",").map((item) => item.trim().toLowerCase()),
      pagesCount: Num.read(pagesCount) ?? 0,
      pro: pro === PRO,
      keywords,
      thumbnailWidth,
      thumbnailHeight,
      thumbnailSrc: `${thumbUrl}${thumbnail}`,
      layoutId: slug
    })
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

export const converterPopup = (
  kit: APIPopup[],
  url: string
): {
  blocks: PopupBlockWithThumbs[];
} => {
  const blocks: PopupBlockWithThumbs[] = kit.map(
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
      id,
      cat: categories.split(",").map((item) => item.trim().toLowerCase()),
      title,
      thumbnailHeight,
      thumbnailWidth,
      thumbnailSrc: `${url}${thumbnail}`,
      pro: pro === PRO,
      keywords: "popup2",
      position: 1,
      type: ["light"],
      blank
    })
  );

  return {
    blocks
  };
};

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
        cat: categories.split(",").map((item) => item.trim().toLowerCase()),
        pagesCount: pages,
        thumbnailSrc: `${thumbUrl}${thumbnail}`,
        thumbnailWidth,
        thumbnailHeight,
        blank: title === BLANK_PAGE
      };
    }
  );

export const convertStoriesPages = (
  stories: StoryPages[],
  templatesImageUrl: string,
  id: string
): CustomTemplatePage[] =>
  stories.map(({ slug, thumbnailHeight, thumbnailWidth, thumbnail }) => ({
    id: slug,
    title: slug,
    thumbnailSrc: `${templatesImageUrl}${thumbnail}`,
    thumbnailHeight,
    thumbnailWidth,
    layoutId: id
  }));

export const convertToCategories = (
  obj: { slug: string; title: string }[]
): Categories[] =>
  obj.map((item) => ({
    ...item,
    id: item.title.toLowerCase()
  }));

export const isKitDataResult = (obj: unknown): obj is KitDataResult =>
  Obj.isObject(obj) &&
  Obj.hasKey("collection", obj) &&
  Array.isArray(obj.collection) &&
  obj.collection.every(
    (item: unknown) =>
      Obj.isObject(item) &&
      Obj.hasKey("pageData", item) &&
      typeof item.pageData === "string"
  );

export const isDefaultBlock = (obj: unknown): obj is DefaultBlock =>
  Obj.isObject(obj) &&
  Obj.hasKey("type", obj) &&
  Str.is(obj.type) &&
  Obj.hasKey("value", obj) &&
  Obj.isObject(obj.value);

export const isDefaultBlockArray = (
  obj: unknown
): obj is DefaultBlockWithID[] =>
  Array.isArray(obj) && obj.every((item) => isDefaultBlock(item));

export const isStoryDataResponse = (obj: unknown): obj is StoryDataResponse =>
  Obj.isObject(obj) && Obj.hasKey("collection", obj) && Str.is(obj.collection);

export const isDefaultBlockWithID = (obj: unknown): obj is DefaultBlockWithID =>
  Obj.isObject(obj) && Obj.hasKey("blockId", obj) && isDefaultBlock(obj);

export const isDefaultBlockWithIDArray = (
  obj: unknown
): obj is DefaultBlockWithID[] =>
  Array.isArray(obj) && obj.every(isDefaultBlockWithID);

export const isAPIPopup = (obj: unknown): obj is APIPopup =>
  Obj.isObject(obj) &&
  Obj.hasKeys(
    [
      "categories",
      "order",
      "pro",
      "thumbnail",
      "thumbnailHeight",
      "thumbnailWidth",
      "title",
      "id"
    ],
    obj
  );

export const isPopupsResponse = (obj: unknown): obj is PopupsResponse =>
  Obj.isObject(obj) &&
  Obj.hasKeys(["categories", "collections"], obj) &&
  Array.isArray(obj.categories) &&
  obj.categories.every(
    (item) =>
      Obj.isObject(item) &&
      Obj.hasKeys(["title", "slug"], item) &&
      Str.is(item.slug) &&
      Str.is(item.title)
  ) &&
  Array.isArray(obj.collections) &&
  obj.collections.every((item) => Obj.isObject(item) && isAPIPopup(item));

export const isPopupDataResult = (obj: unknown): obj is PopupDataResult =>
  Array.isArray(obj) &&
  obj.every(
    (item) =>
      Obj.isObject(item) &&
      Obj.hasKey("pageData", item) &&
      Str.is(item.pageData)
  );

export const isLayoutDataResult = (obj: unknown): obj is LayoutDataResult =>
  Array.isArray(obj) &&
  obj.every(
    (item) =>
      Obj.isObject(item) &&
      Obj.hasKey("pageData", item) &&
      Str.is(item.pageData)
  );

export const isKitDataItems = (obj: unknown): obj is KitDataItems =>
  Obj.isObject(obj) &&
  Obj.hasKey("items", obj) &&
  Array.isArray(obj.items) &&
  obj.items.every((item) => isDefaultBlock(item));

export const isStoryDataBlocks = (
  obj: unknown
): obj is { blocks: DefaultBlockWithID[] } =>
  Obj.isObject(obj) &&
  Obj.hasKey("blocks", obj) &&
  Array.isArray(obj.blocks) &&
  obj.blocks.every(isDefaultBlock);
