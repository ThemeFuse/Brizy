import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import Config from "visual/global/Config";
import EditorIcon from "visual/component/EditorIcon";
import {
  IS_INTERNAL_POPUP,
  IS_EXTERNAL_POPUP,
  IS_EXTERNAL_STORY
} from "visual/utils/models";
import { pageSlugSelector } from "visual/redux/selectors";
import { BottomPanelItem } from "./Item";
import { isCloud, isCustomer } from "visual/global/Config/types/configs/Cloud";

export function PreviewButton(): ReactElement | null {
  const pageSlug = useSelector(pageSlugSelector);

  if (IS_EXTERNAL_POPUP) {
    return null;
  }
  const config = Config.getAll();
  const previewUrl = config.urls.pagePreview;

  let suffix = "";
  if (process.env.NODE_ENV === "development") {
    suffix = new URL(window.parent.location.href).searchParams.has("pro")
      ? "?pro=true"
      : "";
  }
  let href = "";

  if (
    IS_INTERNAL_POPUP ||
    IS_EXTERNAL_STORY ||
    (isCloud(config) && isCustomer(config))
  ) {
    href = previewUrl;
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
