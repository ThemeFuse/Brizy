import React from "react";
import { svgUrl } from "visual/utils/image";
import { ImageProps, Styles } from "../types";
import { styleSvg } from "../styles";

import classnames from "classnames";
import { css } from "visual/utils/cssStyle";

type Props = {
  v: object;
  vs: object;
  vd: object;
  _id: string;
  componentId: string;
  imageSrc: string;
  extraAttributes: ImageProps["extraAttributes"];
};

const SvgImage: React.FC<Props> = ({
  v,
  vs,
  vd,
  _id,
  componentId,
  imageSrc,
  extraAttributes = {}
}) => {
  const url = svgUrl(imageSrc);

  const styleSvgClass = IS_EDITOR
    ? classnames(
        "brz-img",
        "brz-img-svg",
        css(
          `${componentId}-${_id}-svg`,
          `${_id}-svg`,
          styleSvg(v, vs, vd) as Styles
        )
      )
    : classnames("brz-img", "brz-img-svg");

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
