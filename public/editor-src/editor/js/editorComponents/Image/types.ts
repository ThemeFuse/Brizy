/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ECDC } from "visual/editorComponents/EditorComponent/types";
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
  imageExtension: string;
  imagePopulation: string;
  sizeType: string;
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
  linkExternalType: string;
  linkPopup: string;
  linkUpload: string;

  [others: string]: unknown;
};

export type Patch = { [key: string]: number };

type GetResponsiveUrls = (
  imageSizes: ImageSizes
) => {
  desktopSrc: string;
  tabletSrc: string;
  mobileSrc: string;
  sourceSrc: string;
};

export type ImageProps = {
  v: V;
  vs: object;
  vd: object;
  _id: string;
  componentId: string;
  meta: Meta;
  wrapperSizes: WrapperSizes;
  getResponsiveUrls: GetResponsiveUrls;
  extraAttributes?: React.HTMLAttributes<HTMLImageElement>;
  onChange: (arg0: Patch) => void;
};

export type Styles = [string, string, string];

export type Device = "desktop" | "tablet" | "mobile";

export type Unit = "px" | "%";

export const isUnit = (v: unknown): v is Unit =>
  ["px", "%"].includes(v as Unit);
