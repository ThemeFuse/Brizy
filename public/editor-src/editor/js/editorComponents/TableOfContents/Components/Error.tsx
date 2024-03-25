import React from "react";

interface Props {
  message: string;
}

export const Error = ({ message }: Props): JSX.Element => (
  <span className="brz-toc-message">{message}</span>
);
