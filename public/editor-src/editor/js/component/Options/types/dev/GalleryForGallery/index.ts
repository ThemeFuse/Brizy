import type { JSXElementConstructor } from "react";
import { Gallery, type Props as GalleryProps } from "../Gallery";
import type { Image } from "../Gallery/types/Image";

export interface Value extends Image {
  id: string;
}

export const GalleryForGallery: JSXElementConstructor<GalleryProps<Value>> =
  Gallery;
