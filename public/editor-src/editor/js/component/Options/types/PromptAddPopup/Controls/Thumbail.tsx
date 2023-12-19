import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

export interface Props {
  url: string;
  width: string;
  height: string;
  onEdit?: VoidFunction;
  onDelete?: VoidFunction;
}

export const Thumbnail = (props: Props): ReactElement => {
  const { url, width, height, onEdit, onDelete } = props;

  return (
    <figure
      className="brz-figure brz-ed-option__prompt-popup__image"
      style={{ width, height }}
    >
      <img
        src={url}
        className="brz-img"
        onClick={onEdit}
        alt="Popup Thumbnail"
      />
      {typeof onDelete === "function" && (
        <div className="brz-ed-option__prompt-popup-remove" onClick={onDelete}>
          <EditorIcon icon="nc-circle-remove" />
        </div>
      )}
    </figure>
  );
};
