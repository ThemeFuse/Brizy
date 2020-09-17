import React from "react";

type Props = {
  shapeTop?: string;
  shapeBottom?: string;
};

const Shape: React.FC<Props> = ({ shapeTop, shapeBottom }) => (
  <>
    {shapeTop && <div className="brz-bg-shape brz-bg-shape__top" />}
    {shapeBottom && <div className="brz-bg-shape brz-bg-shape__bottom" />}
  </>
);

export default Shape;
