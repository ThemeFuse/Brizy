import { Slug } from "./types";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { read as jsonRead } from "visual/utils/reader/json";
import { mPipe } from "visual/utils/fp";
import { readWithItemReader } from "visual/utils/reader/array";

const getPostInfoPlaceholderBySlug = (slug: Slug): string => {
  switch (slug) {
    case Slug.Author:
      return "{{collection_item_author}}";
    case Slug.Time:
      return "{{collection_item_time}}";
    case Slug.Date:
      return "{{collection_item_date}}";
  }
};

export const getPlaceholder = (
  postElements: Slug[]
): {
  [key: string]: string;
} =>
  postElements.reduce((acc, slug) => {
    const placeholder = getPostInfoPlaceholderBySlug(slug);
    return {
      ...acc,
      [slug]: makePlaceholder({ content: placeholder })
    };
  }, {});

const readSlug = (slug: unknown): Slug | undefined => {
  switch (slug) {
    case Slug.Author:
    case Slug.Date:
    case Slug.Time:
      return slug;
    default:
      return undefined;
  }
};

export const readPostElements = (postElements: unknown): Slug[] =>
  mPipe(jsonRead, readWithItemReader(readSlug))(postElements) ?? [];
