import React, { ReactElement, useCallback, useRef } from "react";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import Config from "visual/global/Config";
import { BottomPanelItem } from "./Item";

const hotKeysForPreview = [
  "ctrl+shift+P",
  "shift+ctrl+P",
  "cmd+shift+P",
  "shift+cmd+P",
  "right_cmd+shift+P",
  "shift+right_cmd+P"
];

export function PreviewButton(): ReactElement | null {
  const config = Config.getAll();
  const refAnchor = useRef<HTMLAnchorElement>(null);
  const previewUrl = config.urls.pagePreview;

  const handleKeyDown = useCallback((): void => {
    if (refAnchor.current) {
      refAnchor.current.click();
    }
  }, []);

  if (!previewUrl) {
    return null;
  }

  let suffix = "";
  if (process.env.NODE_ENV === "development") {
    suffix = new URL(window.parent.location.href).searchParams.has("pro")
      ? "?pro=true"
      : "";
  }
  const href = `${previewUrl}${suffix}`;

  return (
    <>
      <BottomPanelItem
        paddingSize="none"
        pointer={true}
        className="brz-ed-fixed-bottom-panel__preview"
        title="Preview (ctrl+shift+P)"
      >
        <a
          href={href}
          className="brz-a"
          target="_blank"
          rel="noopener noreferrer"
          ref={refAnchor}
        >
          <EditorIcon icon="nc-preview" />
        </a>
      </BottomPanelItem>
      <HotKeys
        keyNames={hotKeysForPreview}
        id="key-helper-preview"
        onKeyDown={handleKeyDown}
      />
    </>
  );
}
