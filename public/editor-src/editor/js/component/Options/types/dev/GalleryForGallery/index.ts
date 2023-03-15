import { JSXElementConstructor } from "react";
import { Gallery, Props as GalleryProps } from "../Gallery";
import { Image } from "../Gallery/types/Image";

export interface Value extends Image {
  id: string;
}

export const GalleryForGallery: JSXElementConstructor<GalleryProps<Value>> =
  Gallery;
