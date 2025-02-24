import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { Dictionary } from "visual/types/utils";

export interface Value extends ElementModel {
  items: ElementModelType[];
  dynamic: "off" | "on";
  spacing: number;
  sliderArrowsSpacing: number;
  symbols: Dictionary<string>;

  slidesToShow: number;
  tabletSlidesToShow: number;
  mobileSlidesToShow: number;

  sliderPaddingType: "grouped" | "ungrouped";

  sliderPadding: number;
  sliderPaddingSuffix: "px" | "%";
  sliderPaddingTop: number;
  sliderPaddingTopSuffix: "px" | "%";
  sliderPaddingRight: number;
  sliderPaddingRightSuffix: "px" | "%";
  sliderPaddingBottom: number;
  sliderPaddingBottomSuffix: "px" | "%";
  sliderPaddingLeft: number;
  sliderPaddingLeftSuffix: "px" | "%";
  tabletSliderPadding: number;
  tabletSliderPaddingSuffix: "px" | "%";
  tabletSliderPaddingTop: number;
  tabletSliderPaddingTopSuffix: "px" | "%";
  tabletSliderPaddingRight: number;
  tabletSliderPaddingRightSuffix: "px" | "%";
  tabletSliderPaddingBottom: number;
  tabletSliderPaddingBottomSuffix: "px" | "%";
  tabletSliderPaddingLeft: number;
  tabletSliderPaddingLeftSuffix: "px" | "%";
  mobileSliderPadding: number;
  mobileSliderPaddingSuffix: "px" | "%";
  mobileSliderPaddingTop: number;
  mobileSliderPaddingTopSuffix: "px" | "%";
  mobileSliderPaddingRight: number;
  mobileSliderPaddingRightSuffix: "px" | "%";
  mobileSliderPaddingBottom: number;
  mobileSliderPaddingBottomSuffix: "px" | "%";
  mobileSliderPaddingLeft: number;
  mobileSliderPaddingLeftSuffix: "px" | "%";

  customCSS: string;
}
