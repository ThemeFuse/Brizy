import classnames from "classnames";
import React from "react";
import { css } from "visual/utils/cssStyle";
import { svgUrl } from "visual/utils/image";
import { styleSvg } from "../styles";
import { ImageProps, Styles, V } from "../types";
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
  const url = svgUrl(imageSrc, { fileName: v.imageFileName });

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
