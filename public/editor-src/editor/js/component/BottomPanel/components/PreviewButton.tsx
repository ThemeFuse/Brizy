import React, { ReactElement, useRef } from "react";
import { useSelector } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import Config from "visual/global/Config";
import {
  isCloud, isCMS, isCustomer
} from "visual/global/Config/types/configs/Cloud";
import { pageSlugSelector } from "visual/redux/selectors";
import {
  isExternalPopup,
  isExternalStory,
  isInternalPopup
} from "visual/utils/models";
import { BottomPanelItem } from "./Item";
import { hotKeysForPreview, redirectToPreview } from "./utils";

export function PreviewButton(): ReactElement | null {
  const pageSlug = useSelector(pageSlugSelector);
  const config = Config.getAll();
  const refForAnchor = useRef<HTMLAnchorElement>(null);

  if (isExternalPopup(config)) {
    return null;
  }

  const previewUrl = config.urls.pagePreview;

  let suffix = "";
  if (process.env.NODE_ENV === "development") {
    suffix = new URL(window.parent.location.href).searchParams.has("pro")
      ? "?pro=true"
      : "";
  }
  let href = "";

  if (
    isInternalPopup(config) ||
    isExternalStory(config) ||
    (isCloud(config) && isCMS(config) && isCustomer(config))
  ) {
    href = `${previewUrl}${suffix}`;
  } else {
    href = `${previewUrl}/${pageSlug}${suffix}`;
  }

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
          ref={refForAnchor}
        >
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
