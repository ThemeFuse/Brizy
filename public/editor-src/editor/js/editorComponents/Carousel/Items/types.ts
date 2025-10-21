import { ElementModel } from "visual/component/Elements/Types";
import { Props as _Props } from "visual/editorComponents/EditorComponent";
import { Meta } from "visual/editorComponents/SectionHeader/type";
import { Context } from "visual/utils/elements/posts/types";
import { ArrowPosition, ArrowStyle } from "../types";

export interface OwnProps {
  meta: Meta;
  dynamicData?: {
    context: Context[];
  };
  className: string;
  slidesToShow: number;
  slidesToScroll: number;
  sliderAutoPlaySpeed: number;
  sliderDots: string;
  sliderAnimation: string;
  transitionSpeed: number;
  columns: number;
  tabletSlidesToShow: number;
  mobileSlidesToShow: number;
  stopSlider: boolean;
  isDynamicContent: boolean;
  dataLoading: boolean;
  loopAttributes: Record<string, unknown>;
  swipe: string;
  sliderAutoPlay: string;
  sliderArrows: string;
  sliderArrowsCustomName: string;
  sliderArrowsCustomType: string;
  sliderArrowsCustomFilename: string;
  arrowStyle: ArrowStyle;
  arrowPosition: ArrowPosition;
  sliderDotsCustomName: string;
  sliderDotsCustomType: string;
  sliderDotsCustomFilename: string;
}

export type Props = _Props<ElementModel, Record<string, unknown>>;
