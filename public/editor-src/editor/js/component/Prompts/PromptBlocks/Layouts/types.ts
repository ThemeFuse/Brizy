import {
  CustomTemplatePage,
  LayoutsWithThumbs,
  StoriesWithThumbs
} from "visual/global/Config/types/configs/blocks/PredefinedBlocks";
import { Style } from "visual/types/Style";
import { Literal } from "visual/utils/types/Literal";

export interface Filter {
  category: string;
  search: string;
}

export interface LayoutData {
  blank?: boolean;
  name: string;
  cat: Literal[];
  pages: CustomTemplatePage[];
  layoutId: string;
  styles?: Style[];
  pro: boolean;
  keywords: string;
}

export interface Category {
  id: number | string;
  title: string;
  hidden?: boolean;
}

export const isStoryData = (
  data: StoriesWithThumbs | LayoutsWithThumbs
): data is StoriesWithThumbs => "stories" in data;
