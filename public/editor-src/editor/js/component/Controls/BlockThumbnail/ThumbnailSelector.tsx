import React, { type JSX } from "react";
import { Scrollbar } from "visual/component/Scrollbar";
import { BlockThumbnailLabel } from "./BlockThumbnailLabel";
import { Thumbnails } from "./Thumbnails";
import type { ThumbnailSelectorProps } from "./types";

export const ThumbnailSelector = ({
  className,
  attr,
  label,
  helper,
  helperContent,
  onChange,
  onClick,
  anchorInputs,
  blocks,
  value
}: ThumbnailSelectorProps): JSX.Element => (
  <div {...attr} className={className}>
    {label || helper ? (
      <BlockThumbnailLabel
        helper={helper}
        label={label}
        helperContent={helperContent}
      />
    ) : null}
    <Scrollbar autoHeightMax="240px" theme="dark">
      <Thumbnails
        onChange={onChange}
        onClick={onClick}
        anchorInputs={anchorInputs}
        blocks={blocks}
        value={value}
      />
    </Scrollbar>
  </div>
);
