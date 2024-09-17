import classnames from "classnames";
import React, { Attributes } from "react";
import { Slide } from "visual/component/Background/types/Slideshow/Slide";
import type { Image } from "visual/component/Options/types/dev/Gallery/types/Image";
import { FCC } from "visual/utils/react/types";

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
        <div className="swiper-slide" key={index}>
          <Slide className={itemClassName} item={item} />
        </div>
      ))}
    </div>
  </div>
);
