import { Style } from "visual/types";

export interface Filter {
  category: string;
  search: string;
}
export interface Page {
  id: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  title: string;
  keywords: string;
  cat: number[];
}

export interface LayoutData {
  blank?: boolean;
  name: string;
  color: string;
  cat: number[];
  pages: Page[];
  styles?: Style[];
  pro: boolean;
}

export interface Category {
  id: number | string;
  title: string;
  hidden?: boolean;
}

export interface StoriesData {
  stories: LayoutData[];
  categories: Category[];
}

export interface TemplatesData {
  templates: LayoutData[];
  categories: Category[];
}

export type ThumbnailData<T extends TemplatesData | StoriesData> = T & {
  thumbnailSrc: string;
};

export const isStoryData = (
  data: StoriesData | TemplatesData
): data is StoriesData => "stories" in data;
