import React, { FC } from "react";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  message: string;
}

export const RenderEmpty: FC<Props> = ({ message }) => (
  <div className="brz-ed-sidebar__right__empty">
    <EditorIcon
      icon="nc-settings"
      className="brz-ed-sidebar__right__empty-icon"
    />
    <div className="brz-ed-sidebar__right__empty-text">{message}</div>
  </div>
);
