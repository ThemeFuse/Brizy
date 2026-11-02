import classnames from "classnames";
import React, { type JSX } from "react";
import { ThumbnailBlockWithInput } from "./ThumbnailBlockWithInput";
import type { AnchorInput as _AnchorInput, ThumbnailsProps } from "./types";

export const Thumbnails = ({
  blocks,
  value,
  onClick,
  anchorInputs,
  onChange
}: ThumbnailsProps): JSX.Element => (
  <>
    {blocks.map((block) => {
      const { _id } = block.value;

      const className = classnames("brz-ed-option__block-thumbnail-item", {
        active: _id === value
      });

      const anchorName = anchorInputs.find(
        (input: _AnchorInput) => input.id === _id
      )?.value;

      const inputValue = anchorName ? decodeURIComponent(anchorName) : "";

      return (
        <ThumbnailBlockWithInput
          id={_id}
          key={_id}
          className={className}
          inputValue={inputValue}
          block={block}
          onClick={onClick}
          onChange={onChange}
        />
      );
    })}
  </>
);
