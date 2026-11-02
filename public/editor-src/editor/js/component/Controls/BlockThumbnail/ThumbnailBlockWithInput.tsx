import React, { type JSX } from "react";
import { AnchorInput } from "./AnchorInput";
import { BlockThumbnailImage } from "./BlockThumbnailImage";
import type { ThumbnailBlockWithInput as Props } from "./types";

export const ThumbnailBlockWithInput = ({
  id,
  className,
  inputValue,
  block,
  onClick,
  onChange
}: Props): JSX.Element => (
  <div className={className} onClick={() => onClick(id)}>
    <BlockThumbnailImage blockData={block} />
    <AnchorInput
      id={id}
      value={inputValue}
      onChange={(value) => onChange(value, id)}
    />
  </div>
);
