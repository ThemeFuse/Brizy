import { ElementModel } from "visual/component/Elements/Types";
import { Meta } from "visual/editorComponents/SectionHeader/type";
import { DynamicContent } from "visual/global/Config/types/DynamicContent";
import { Switch } from "visual/types/Options";
import { WithClassName } from "visual/types/attributes";
import { Dictionary } from "visual/types/utils";
import { PostsTypes } from "visual/utils/elements/posts/types";

export interface Value extends ElementModel {
  columns: number;
  slidesToShow: number;
  tabletSlidesToShow: number;
  mobileSlidesToShow: number;

  sliderPadding: number;
  sliderPaddingSuffix: string;
  sliderPaddingLeft: number;
  sliderPaddingLeftSuffix: string;
  sliderPaddingRight: number;
  sliderPaddingRightSuffix: string;
  tabletSliderPadding: number;
  tabletSliderPaddingSuffix: string;
  tabletSliderPaddingLeft: number;
  tabletSliderPaddingLeftSuffix: string;
  tabletSliderPaddingRight: number;
  tabletSliderPaddingRightSuffix: string;
  mobileSliderPadding: number;
  mobileSliderPaddingSuffix: string;
  mobileSliderPaddingLeft: number;
  mobileSliderPaddingLeftSuffix: string;
  mobileSliderPaddingRight: number;
  mobileSliderPaddingRightSuffix: string;

  customCSS: string;

  type: PostsTypes;
  dynamic: Switch;
  source: string;
  field: string;

  sliderArrowsCustomName: string;
  sliderArrowsCustomType: string;
  sliderArrowsCustomFilename: string;
  arrowStyle: ArrowStyle;
  arrowPosition: ArrowPosition;
  sliderDotsCustomName: string;
  sliderDotsCustomType: string;
  sliderDotsCustomFilename: string;
}

export interface VDecoded extends ElementModel {
  type: string;
  source: string;
  querySource: string;
  offset: number;
  orderBy: string;
  order: string;
  symbols: Dictionary<string[]>;
  count: number;
  field: string;
}

export type DC = DynamicContent<"wp"> | DynamicContent<"cloud">;

export interface $Subject {
  loop: {
    config: DC;
    collection: string[];
  };
  pagination: {
    itemsPerPage: number;
    totalCount: number;
  };
}

export interface State {
  dataLoading: boolean;
  data: Record<string, unknown> | undefined;
}

export interface Props extends WithClassName {
  meta: Meta;
}

export enum ArrowStyle {
  style1 = "style-1",
  style2 = "style-2",
  style3 = "style-3"
}

export enum ArrowPosition {
  TopLeft = "top-left",
  TopRight = "top-right",
  BottomRight = "bottom-right",
  BottomLeft = "bottom-left",
  BottomMiddle = "bottom-middle",
  MiddleLeft = "middle-left",
  MiddleRight = "middle-right"
}
