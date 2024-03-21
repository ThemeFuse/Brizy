import React from "react";

type Props = {
  attr?: React.HTMLAttributes<HTMLImageElement>;
  v: {
    imagePopulation: string;
    imageSrc: string;

    [k: string]: unknown;
  };
};

const PopulationComponent = ({ attr, v: { imageSrc } }: Props): JSX.Element => {
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
