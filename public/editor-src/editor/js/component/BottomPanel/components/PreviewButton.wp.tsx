import React, { ReactElement, useRef } from "react";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import Config from "visual/global/Config";
import { isPopup } from "visual/utils/models";
import { BottomPanelItem } from "./Item";
import { hotKeysForPreview, redirectToPreview } from "./utils";

export function PreviewButton(): ReactElement {
  const config = Config.getAll();
  const refForAnchor = useRef<HTMLAnchorElement>(null);
  const { site, pagePreview } = config.urls;
  const url = isPopup(config) ? site : pagePreview;

  return (
    <>
      <BottomPanelItem
        paddingSize="none"
        pointer={true}
        className="brz-ed-fixed-bottom-panel__preview"
        title="Preview (ctrl+shift+P)"
      >
        <a href={url} className="brz-a" target="_blank" rel="noopener noreferrer" ref={refForAnchor}>
          <EditorIcon icon="nc-preview" />
        </a>
      </BottomPanelItem>
      <HotKeys
        keyNames={hotKeysForPreview}
        id="key-helper-preview"
        onKeyDown={() => redirectToPreview(refForAnchor)}
      />
    </>
  );
}
