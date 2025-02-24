/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";
import { LinkData } from "visual/component/Link/types/Type";
import { LinkProps } from "visual/component/hooks/withLink";
import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { ECDC } from "visual/editorComponents/EditorComponent/types";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { RenderType } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { ImageType } from "visual/utils/image/types";

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

  [others: string]: unknown;
};

export type Patch = { [key: string]: number };

type GetResponsiveUrls = (imageSizes: ImageSizes) => {
  desktopSrc: string;
  tabletSrc: string;
  mobileSrc: string;
  sourceSrc: string;
};

export type ImageProps = {
  v: V;
  vs: V;
  vd: V;
  link: LinkData;
  context: EditorComponentContextValue;
  _id: string;
  componentId: string;
  meta: Meta;
  wrapperSizes: WrapperSizes;
  getResponsiveUrls: GetResponsiveUrls;
  renderContext: RenderType;
  editorMode: EditorMode;
  extraAttributes?: React.HTMLAttributes<HTMLImageElement>;
  children: ReactNode;
  onChange: (arg0: Patch) => void;
  onStart?: VoidFunction;
  onEnd?: VoidFunction;
  gallery?: {
    inGallery: boolean;
    layout: string;
  };
  store: Store;

  linkProps?: LinkProps;
};

export type Device = "desktop" | "tablet" | "mobile";

export type Unit = "px" | "%";

export const isUnit = (v: unknown): v is Unit =>
  ["px", "%"].includes(v as Unit);
