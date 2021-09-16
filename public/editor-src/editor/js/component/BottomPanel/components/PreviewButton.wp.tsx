import React, { ReactElement } from "react";
import Config from "visual/global/Config";
import EditorIcon from "visual/component/EditorIcon";
import { IS_GLOBAL_POPUP } from "visual/utils/models";

export function PreviewButton(): ReactElement {
  const { site, pagePreview } = Config.getAll().urls;
  const url = IS_GLOBAL_POPUP ? site : pagePreview;

  return (
    <li
      className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__preview"
      title="Preview"
    >
      <a href={url} className="brz-a" target="_blank" rel="noopener noreferrer">
        <EditorIcon icon="nc-preview" />
      </a>
    </li>
  );
}
