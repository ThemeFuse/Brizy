import React, { Fragment } from "react";

export default function Shape({ shapeTop, shapeBottom }) {
  return (
    <Fragment>
      {shapeTop && <div className="brz-bg-shape brz-bg-shape__top" />}
      {shapeBottom && <div className="brz-bg-shape brz-bg-shape__bottom" />}
    </Fragment>
  );
}
