import classnames from "classnames";
import React, { type Attributes } from "react";
import { Slide } from "visual/component/Background/types/Slideshow/Slide";
import type { Image } from "visual/component/Options/types/dev/Gallery/types/Image";
import type { FCC } from "visual/utils/react/types";

interface Props {
  className?: string;
  itemClassName?: string;
  images: Image[];
  attributes: Attributes;
}

export const SlideshowPreview: FCC<Props> = ({
  className,
  itemClassName,
  images,
  attributes
}) => (
  <div className={classnames("swiper", className)} {...attributes}>
    <div className="swiper-wrapper">
      {images.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the same image uid can appear twice in a slideshow, so only the slot is unique
        <div className="swiper-slide" key={index}>
          <Slide className={itemClassName} item={item} />
        </div>
      ))}
    </div>
  </div>
);
