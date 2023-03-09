import React from "react";
import { InlineWidget as CalendlyWidget } from "react-calendly";
import { Props } from "./types";

export const Calendly = (props: Props) => {
  const { link } = props;
  return <CalendlyWidget url={link} />;
};
