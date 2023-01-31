import React from "react";

type Props = {
  shapeTop?: string;
  shapeBottom?: string;
};

const Shape: React.FC<Props> = ({ shapeTop, shapeBottom }) => (
  <>
    {shapeTop && (
      <div className="brz-bg-shape w-full h-full absolute inset-x-0 bg-no-repeat pointer-events-none brz-bg-shape__top top-0 after:content-[''] after:absolute after:w-full after:h-full after:top-0" />
    )}
    {shapeBottom && (
      <div className="brz-bg-shape w-full h-full absolute inset-x-0 bg-no-repeat pointer-events-none brz-bg-shape__bottom bottom-0 rotate-x-180  after:content-[''] after:absolute after:w-full after:h-full after:top-0" />
    )}
  </>
);

export default Shape;
