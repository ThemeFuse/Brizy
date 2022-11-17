import classnames from "classnames";
import React from "react";
import { svgUrl } from "visual/utils/image";
import { ImageProps, V } from "../types";
import { showOriginalImage } from "../utils";

type Props = {
  v: V;
  vs: V;
  vd: V;
  _id: string;
  componentId: string;
  imageSrc: string;
  extraAttributes: ImageProps["extraAttributes"];
};

const SvgImage: React.FC<Props> = ({ v, imageSrc, extraAttributes = {} }) => {
  const url = svgUrl(imageSrc, { fileName: v.imageFileName });

  const styleSvgClass = classnames("brz-img", "brz-img-svg", {
    "brz-img__original": showOriginalImage(v)
  });

  if (!url) {
    return null;
  }

  return (
    <img
      className={styleSvgClass}
      src={url}
      {...extraAttributes}
      draggable={false}
      loading="lazy"
    />
  );
};

export default SvgImage;
