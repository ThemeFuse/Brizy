import React from "react";
import * as checkboard from "../helpers/checkboard";

export type Props = {
  white: string;
  grey: string;
  size: number;
  renderers: { canvas?: new () => HTMLCanvasElement };
  borderRadius?: string;
  boxShadow?: string;
};

export const Checkboard = ({
  white,
  grey,
  size,
  renderers,
  borderRadius,
  boxShadow
}: Props) => {
  const styles = {
    borderRadius,
    boxShadow,
    absolute: "0px 0px 0px 0px",
    background: `url(${checkboard.get(
      white,
      grey,
      size,
      renderers.canvas
    )}) center left`
  };

  return <div style={styles} />;
};

export default Checkboard;
