import classnames from "classnames";
import React, { ReactElement } from "react";
import { SizeType } from "visual/global/Config/types/configs/common";
import { getImageUrl } from "visual/utils/image";
import { ImageType } from "visual/utils/image/types";
import { ImageProps, V } from "../types";
import { showOriginalImage } from "../utils";

interface Props {
  v: V;
  vs: V;
  vd: V;
  _id: string;
  componentId: string;
  imageSrc: string;
  extraAttributes: ImageProps["extraAttributes"];
}

const OriginalImage = ({
  v,
  imageSrc,
  extraAttributes = {}
}: Props): ReactElement => {
  const isExternalImage = v.imageType === ImageType.External;
  const url = isExternalImage
    ? imageSrc
    : getImageUrl({
        uid: imageSrc,
        sizeType: SizeType.original,
        fileName: v.imageFileName
      });

  const classNames = classnames("brz-img", {
    "brz-img__original": showOriginalImage(v),
    "brz-img-svg": !isExternalImage,
    "brz-img-external": isExternalImage
  });

  return (
    <img
      className={classNames}
      src={url}
      {...extraAttributes}
      draggable={false}
      loading="lazy"
    />
  );
};

export default OriginalImage;
