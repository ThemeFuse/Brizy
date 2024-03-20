import React from "react";

export interface Props {
  context: "block" | "popup";
  className?: string;
  config: {
    globalBlockId: string;
  };
  attr?: React.HTMLAttributes<HTMLDivElement>;
}
