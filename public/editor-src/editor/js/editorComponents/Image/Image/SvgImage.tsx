import React from "react";
import { svgUrl } from "visual/utils/image";
import { ImageProps, Styles, V } from "../types";
import { styleSvg } from "../styles";

import classnames from "classnames";
import { css } from "visual/utils/cssStyle";
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

  let svgClassName = "";
  if (IS_EDITOR) {
    svgClassName = css(
      `${componentId}-${_id}-svg`,
      `${_id}-svg`,
      styleSvg(v, vs, vd, {
        showOriginalImage: showOriginalImage(v)
      }) as Styles
    );
  }

  const styleSvgClass = classnames("brz-img", "brz-img-svg", svgClassName, {
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
