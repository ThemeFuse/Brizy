import classnames from "classnames";
import React, { JSX, useMemo } from "react";
import { HOVER } from "visual/utils/stateMode";

type Props = {
  attr?: React.HTMLAttributes<HTMLImageElement>;
  v: {
    imagePopulation: string;
    imageSrc: string;
    hoverImage?: string;
    [k: string]: unknown;
  };
  isHover?: boolean;
};

const PopulationComponent = ({
  attr,
  v: { imageSrc, tabsState, hoverImage },
  isHover
}: Props): JSX.Element => {
  const className = classnames("dynamic-image", {
    "brz-dynamic-image__hover brz-img__hover": isHover,
    "brz-transparent": isHover && tabsState !== HOVER,
    "brz-dc-hover-visible": isHover && tabsState === HOVER
  });

  const src = useMemo(
    () => (isHover && hoverImage ? hoverImage : imageSrc),
    [hoverImage, imageSrc, isHover]
  );

  return (
    <img
      {...attr}
      className={className}
      src={src}
      draggable={false}
      loading="lazy"
    />
  );
};

export default PopulationComponent;
