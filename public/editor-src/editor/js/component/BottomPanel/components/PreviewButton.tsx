import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import {
  isCMS,
  isCloud,
  isCustomer
} from "visual/global/Config/types/configs/Cloud";
import { pageSlugSelector } from "visual/redux/selectors";
import {
  isExternalPopup,
  isExternalStory,
  isInternalPopup
} from "visual/utils/models";
import { BottomPanelItem } from "./Item";

export function PreviewButton(): ReactElement | null {
  const pageSlug = useSelector(pageSlugSelector);
  const config = Config.getAll();

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
    <BottomPanelItem
      paddingSize="none"
      pointer={true}
      className="brz-ed-fixed-bottom-panel__preview"
      title="Preview"
    >
      <a
        href={href}
        className="brz-a"
        target="_blank"
        rel="noopener noreferrer"
      >
        <EditorIcon icon="nc-preview" />
      </a>
    </BottomPanelItem>
  );
}
