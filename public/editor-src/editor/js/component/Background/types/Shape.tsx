import React, { ReactElement } from "react";

type Props = {
  shapeTop?: string;
  shapeBottom?: string;
};

const Shape = ({ shapeTop, shapeBottom }: Props): ReactElement => (
  <>
    {shapeTop && <div className="brz-bg-shape brz-bg-shape__top" />}
    {shapeBottom && <div className="brz-bg-shape brz-bg-shape__bottom" />}
  </>
);

export default Shape;
