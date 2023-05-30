import classnames from "classnames";
import React from "react";
import { SizeType } from "visual/global/Config/types/configs/common";
import { getImageUrl } from "visual/utils/image";
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
  const url = getImageUrl({
    uid: imageSrc,
    sizeType: SizeType.original,
    fileName: v.imageFileName
  });

  const styleSvgClass = classnames("brz-img", "brz-img-svg", {
    "brz-img__original": showOriginalImage(v)
  });

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
