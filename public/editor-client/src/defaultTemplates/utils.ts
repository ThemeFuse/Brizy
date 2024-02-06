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
  popupId: string
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
      kitId: popupId
    })
  );

  return {
    blocks,
    categories
  };
};

export const getStyles = (): Array<Style> => [
  {
    colorPalette: [
      { id: "color1", hex: "#A170D9" },
      { id: "color2", hex: "#1C1C1C" },
      { id: "color3", hex: "#05CAB6" },
      { id: "color4", hex: "#B8E6E1" },
      { id: "color5", hex: "#F5D4D1" },
      { id: "color6", hex: "#EBEBEB" },
      { id: "color7", hex: "#666666" },
      { id: "color8", hex: "#FFFFFF" }
    ],
    fontStyles: [
      {
        deletable: "off",
        id: "paragraph",
        title: "Paragraph",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 16,
        fontSizeSuffix: "px",
        fontWeight: 400,
        lineHeight: 1.9,
        letterSpacing: 0,
        tabletFontSize: 15,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 400,
        tabletLineHeight: 1.6,
        tabletLetterSpacing: 0,
        mobileFontSize: 15,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 400,
        mobileLineHeight: 1.6,
        mobileLetterSpacing: 0
      },
      {
        deletable: "off",
        id: "subtitle",
        title: "Subtitle",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 17,
        fontSizeSuffix: "px",
        fontWeight: 400,
        lineHeight: 1.8,
        letterSpacing: 0,
        tabletFontSize: 17,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 400,
        tabletLineHeight: 1.5,
        tabletLetterSpacing: 0,
        mobileFontSize: 16,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 400,
        mobileLineHeight: 1.5,
        mobileLetterSpacing: 0
      },
      {
        deletable: "off",
        id: "abovetitle",
        title: "Above Title",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 13,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.5,
        letterSpacing: 1.1,
        tabletFontSize: 13,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.5,
        tabletLetterSpacing: 1,
        mobileFontSize: 13,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.5,
        mobileLetterSpacing: 1
      },
      {
        deletable: "off",
        id: "heading1",
        title: "Heading 1",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 46,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: -1.5,
        tabletFontSize: 38,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.2,
        tabletLetterSpacing: -1,
        mobileFontSize: 36,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.3,
        mobileLetterSpacing: -1
      },
      {
        deletable: "off",
        id: "heading2",
        title: "Heading 2",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 36,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: -1.5,
        tabletFontSize: 30,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.2,
        tabletLetterSpacing: -1,
        mobileFontSize: 28,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.3,
        mobileLetterSpacing: -1
      },
      {
        deletable: "off",
        id: "heading3",
        title: "Heading 3",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 28,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: -1.5,
        tabletFontSize: 27,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.3,
        tabletLetterSpacing: -1,
        mobileFontSize: 22,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.3,
        mobileLetterSpacing: -0.5
      },
      {
        deletable: "off",
        id: "heading4",
        title: "Heading 4",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 22,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.5,
        letterSpacing: -0.5,
        tabletFontSize: 22,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.4,
        tabletLetterSpacing: -0.5,
        mobileFontSize: 20,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.4,
        mobileLetterSpacing: 0
      },
      {
        deletable: "off",
        id: "heading5",
        title: "Heading 5",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 20,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.6,
        letterSpacing: 0,
        tabletFontSize: 17,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.7,
        tabletLetterSpacing: 0,
        mobileFontSize: 17,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.8,
        mobileLetterSpacing: 0
      },
      {
        deletable: "off",
        id: "heading6",
        title: "Heading 6",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 16,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.5,
        letterSpacing: 0,
        tabletFontSize: 16,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.5,
        tabletLetterSpacing: 0,
        mobileFontSize: 16,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.5,
        mobileLetterSpacing: 0
      },
      {
        deletable: "off",
        id: "button",
        title: "Button",
        fontFamily: "overpass",
        fontFamilyType: "google",
        fontSize: 15,
        fontSizeSuffix: "px",
        fontWeight: 700,
        lineHeight: 1.6,
        letterSpacing: 0,
        tabletFontSize: 17,
        tabletFontSizeSuffix: "px",
        tabletFontWeight: 700,
        tabletLineHeight: 1.6,
        tabletLetterSpacing: 0,
        mobileFontSize: 15,
        mobileFontSizeSuffix: "px",
        mobileFontWeight: 700,
        mobileLineHeight: 1.6,
        mobileLetterSpacing: 0
      }
    ],
    id: "bahcadtpvdhdphmhymrsgrwobyzhxcdzytyx",
    title: "Overpass"
  }
];

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
