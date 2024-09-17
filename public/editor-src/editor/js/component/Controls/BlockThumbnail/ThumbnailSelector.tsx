import React, { JSX } from "react";
import { BlockThumbnailLabel } from "./BlockThumbnailLabel";
import { ThumbnailSelectorProps } from "./types";
import { Scrollbar } from "visual/component/Scrollbar";
import { Thumbnails } from "./Thumbnails";

export const ThumbnailSelector = ({
  className,
  attr,
  label,
  helper,
  helperContent,
  onChange,
  onClick,
  anchorInputs,
  pageBlocksAssembled,
  globalBlocks,
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
        pageBlocksAssembled={pageBlocksAssembled}
        globalBlocks={globalBlocks}
        value={value}
      />
    </Scrollbar>
  </div>
);
