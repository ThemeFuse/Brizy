import React, { JSX } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ThumbnailLabelProps } from "./types";

export const BlockThumbnailLabel = ({
  label,
  helper,
  helperContent
}: ThumbnailLabelProps): JSX.Element => {
  const _helper = helper ? (
    <div className="brz-ed-option__helper">
      <EditorIcon icon="nc-alert-circle-que" />
      {helperContent && (
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{ __html: helperContent }}
        />
      )}
    </div>
  ) : null;

  return (
    <div className="brz-ed-option__label">
      {label}
      {_helper}
    </div>
  );
};
