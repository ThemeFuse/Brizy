import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import { isPopup } from "visual/utils/models";
import { BottomPanelItem } from "./Item";

export function PreviewButton(): ReactElement {
  const config = Config.getAll();
  const { site, pagePreview } = config.urls;
  const url = isPopup(config) ? site : pagePreview;

  return (
    <BottomPanelItem
      paddingSize="none"
      pointer={true}
      className="brz-ed-fixed-bottom-panel__preview"
      title="Preview"
    >
      <a href={url} className="brz-a" target="_blank" rel="noopener noreferrer">
        <EditorIcon icon="nc-preview" />
      </a>
    </BottomPanelItem>
  );
}
