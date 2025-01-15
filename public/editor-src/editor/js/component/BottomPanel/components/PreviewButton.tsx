import React, { MouseEvent, useCallback, useRef } from "react";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import type { Config } from "visual/global/Config/types";
import { useConfig } from "visual/global/hooks";
import { t } from "visual/utils/i18n";
import { BottomPanelItem } from "./Item";

const hotKeysForPreview = [
  "ctrl+shift+P",
  "shift+ctrl+P",
  "cmd+shift+P",
  "shift+cmd+P",
  "right_cmd+shift+P",
  "shift+right_cmd+P"
];

export function PreviewButton(): JSX.Element {
  const config = useConfig() as Config;
  const previewWindow = useRef<Window | null>(null);
  const refAnchor = useRef<HTMLAnchorElement>(null);
  const previewUrl = config.urls.pagePreview;

  const handleKeyDown = useCallback((): void => {
    if (refAnchor.current) {
      refAnchor.current.click();
    }
  }, []);

  if (!previewUrl) {
    return <></>;
  }

  let suffix = "";
  if (process.env.NODE_ENV === "development") {
    suffix = new URL(window.parent.location.href).searchParams.has("pro")
      ? "?pro=true"
      : "";
  }
  const href = `${previewUrl}${suffix}`;

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const preview = previewWindow.current;

    if (preview) {
      preview.close();
    }

    previewWindow.current = window.open(href, "_blank");
  };

  return (
    <>
      <BottomPanelItem
        paddingSize="none"
        pointer={true}
        className="brz-ed-fixed-bottom-panel__preview"
        title={t("Preview (ctrl+shift+P)")}
      >
        <a
          href={href}
          className="brz-a"
          rel="noopener noreferrer"
          ref={refAnchor}
          onClick={onClick}
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
