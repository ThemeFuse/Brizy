import React from "react";

type Props = {
  attr?: React.HTMLAttributes<HTMLImageElement>;
  v: {
    imagePopulation: string;
    imageSrc: string;

    [k: string]: unknown;
  };
};

const PopulationComponent: React.FC<Props> = ({ attr, v: { imageSrc } }) => {
  return (
    <img
      {...attr}
      className="dynamic-image"
      src={imageSrc}
      draggable={false}
      loading="lazy"
    />
  );
};

export default PopulationComponent;
