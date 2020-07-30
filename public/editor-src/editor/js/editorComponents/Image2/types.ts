/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
  [others: string]: any;
};

export type V = {
  imageSrc: string;
  imageExtension: string;
  imagePopulation: string;
  linkType: "anchor" | "external" | "popup" | "upload" | "lightBox" | "action";
  linkAnchor: string;
  linkExternalBlank: "on" | "off";
  linkExternalRel: "on" | "off";
  linkLightBox: "on" | "off";
  linkExternalType: string;
  linkPopup: string;
  linkUpload: string;

  [others: string]: any;
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
