import React, { JSX, useMemo } from "react";

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
  v: { imageSrc, hoverImage },
  isHover
}: Props): JSX.Element => {
  const src = useMemo(
    () => (isHover && hoverImage ? hoverImage : imageSrc),
    [hoverImage, imageSrc, isHover]
  );

  return (
    <img {...attr} className="dynamic-image" src={src} draggable={false} />
  );
};

export default PopulationComponent;
