import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  address: string;
  zoom: number;
  customCSS: string;
}

export interface Patch {
  [k: string]: string;
}

export type BoxResizerParams = () => {
  points: string[];
  restrictions: {
    height: {
      px: { min: number; max: number };
      "%": { min: number; max: number };
    };
    width: {
      px: { min: number; max: number };
      "%": { min: number; max: number };
    };
    tabletHeight: {
      px: { min: number; max: number };
      "%": { min: number; max: number };
    };
    tabletWidth: {
      px: { min: number; max: number };
      "%": { min: number; max: number };
    };
    mobileHeight: {
      px: { min: number; max: number };
      "%": { min: number; max: number };
    };
    mobileWidth: {
      px: { min: number; max: number };
      "%": { min: number; max: number };
    };
  };
};
