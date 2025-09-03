/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";
import { TooltipPlacement } from "visual/component/Tooltip/types";
import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { ECDC } from "visual/editorComponents/EditorComponent/types";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { RenderType } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { WithClassName } from "visual/types/attributes";
import { ImageType } from "visual/utils/image/types";
import { Positive } from "visual/utils/math/Positive";

type sizes = {
  width: number;
  height: number;
};

export type WrapperSizes = {
  desktop: sizes;
  tablet: sizes;
  mobile: sizes;
};

export type ImageSize = {
  width: number;
  height: number;
  marginLeft: number;
  marginTop: number;
};

export type ImageSizes = {
  desktop: ImageSize;
  tablet: ImageSize;
  mobile: ImageSize;
};

export type Meta = {
  desktopW: number;
  tabletW: number;
  mobileW: number;
  gallery: {
    inGallery: boolean;
  };
  _dc: ECDC;
  [others: string]: any;
};

export type V = {
  className: string;
  zoom: number;
  width: number;
  height: number;
  tabletWidth: number | null;
  tabletHeight: number | null;
  mobileWidth: number | null;
  mobileHeight: number | null;
  imageWidth: number;
  imageHeight: number;
  widthSuffix: Unit;
  heightSuffix: Unit;
  imageSrc: string;
  imageFileName: string;
  imageExtension: string;
  imagePopulation: string;
  sizeType: string;
  imageType: ImageType;
  alt: string | null;
  size: number;
  tabletSize: number | null;
  mobileSize: number | null;
  positionY: number;
  positionX: number;
  offsetX: number;
  offsetY: number;
  linkType:
    | "anchor"
    | "story"
    | "external"
    | "popup"
    | "upload"
    | "lightBox"
    | "action";
  linkAnchor: string;
  linkToSlide: number;
  linkExternalBlank: "on" | "off";
  linkExternalRel: "on" | "off";
  linkLightBox: "on" | "off";
  showOriginalImage: "on" | "off";
  linkExternalType: string;
  linkPopup: string;
  linkUpload: string;
  hoverImageSrc: string;
  hoverImageWidth: number;
  hoverImageHeight: number;
  hoverPositionX: number;
  hoverPositionY: number;
  hoverHeight: number;
  hoverImageExtension: string;
  hoverImage: string;
  hoverImageFileName: string;
  tabletWidthSuffix: string;
  tabletHeightSuffix: string;
  mobileWidthSuffix: string;
  mobileHeightSuffix: string;

  tooltipOffset: number;
  tooltipText: string;
  tooltipTriggerClick: string;
  tooltipPlacement: TooltipPlacement;

  imagePopulationEntityType?: string;
  imagePopulationEntityId?: string;

  customCSS: string;

  enableLazyLoad: "on" | "off";

  [others: string]: unknown;
};

export interface Props extends WithClassName {
  meta: Meta;
  onResize: VoidFunction;
  renderer?: {
    gallery?: GalleryRenderer;
  };
}

export interface GalleryRenderer {
  inGallery: boolean;
  hoverName: string;
  hoverDuration: Positive;
  hoverInfiniteAnimation: boolean;
  layout?: string;
  withBigImage: boolean;
  enableTags: boolean;
}

export type Patch = { [key: string]: number };

export interface ImagesSources {
  desktopSrc: string;
  hoverDesktopSrc: string;
  tabletSrc: string;
  hoverTabletSrc?: string;
  mobileSrc: string;
  hoverMobileSrc?: string;
  sourceSrc: string;
  hoverSourceSrc: string;
}

export type GetResponsiveUrls = (imageSizes: ImageSizes) => ImagesSources;

export type ImageContent = {
  v: V;
  vs: V;
  vd: V;
  _id: string;
  componentId: string;
  meta: Meta;
  wrapperSizes: WrapperSizes;
  renderContext: RenderType;
  editorMode: EditorMode;
  // INFO: this function is passed only in preview
  getResponsiveUrls?: GetResponsiveUrls;
  extraAttributes?: React.HTMLAttributes<HTMLImageElement>;
  onStart?: VoidFunction;
  onEnd?: VoidFunction;
  gallery?: GalleryRenderer;
  store: Store;
};

export interface ImageProps extends ImageContent {
  context: EditorComponentContextValue;
  children: ReactNode;
  onChange: (arg0: Patch) => void;
}

export type HoverImageCommonProps = Pick<
  ImageProps,
  | "v"
  | "vs"
  | "vd"
  | "_id"
  | "componentId"
  | "meta"
  | "extraAttributes"
  | "getResponsiveUrls"
  | "store"
  | "renderContext"
  | "editorMode"
>;

export interface HoverSvgImageProps extends HoverImageCommonProps {
  hoverImageSrc: string;
}

export type Device = "desktop" | "tablet" | "mobile";

export type Unit = "px" | "%";

export const isUnit = (v: unknown): v is Unit =>
  ["px", "%"].includes(v as Unit);

export interface State {
  containerWidth: number;
  tabletContainerWidth: number;
  mobileContainerWidth: number;
  isDragging: boolean;
  sizePatch: Patch | null;
}

export type Dimensions =
  | "containerWidth"
  | "tabletContainerWidth"
  | "mobileContainerWidth";
