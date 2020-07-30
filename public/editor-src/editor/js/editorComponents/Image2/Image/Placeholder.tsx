import React from "react";
import Placeholder from "visual/component/Placeholder";

type Props = {
  imagePopulation: string;
};

const PlaceholderComponent: React.FC<Props> = ({ imagePopulation }) => {
  const iconName = imagePopulation ? "dynamic-img" : "img";

  return <Placeholder icon={iconName} />;
};

export default PlaceholderComponent;
