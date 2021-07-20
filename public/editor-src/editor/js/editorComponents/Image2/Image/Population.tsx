import React from "react";

type Props = {
  v: {
    imagePopulation: string;
    imageSrc: string;

    [k: string]: unknown;
  };
};

const PopulationComponent: React.FC<Props> = ({ v: { imageSrc } }) => {
  return (
    <img
      className="dynamic-image"
      src={imageSrc}
      draggable={false}
      loading="lazy"
    />
  );
};

export default PopulationComponent;
