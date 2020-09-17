import React from "react";
import Placeholder from "visual/component/Placeholder";

type Props = {
  imagePopulation: string;
  className?: string;
};

const PlaceholderComponent: React.FC<Props> = ({
  imagePopulation,
  className
}) => {
  const iconName = imagePopulation ? "dynamic-img" : "img";

  return <Placeholder className={className} icon={iconName} />;
};

export default PlaceholderComponent;
