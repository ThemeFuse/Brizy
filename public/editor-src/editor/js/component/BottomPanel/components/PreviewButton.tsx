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

export function PreviewButton(): ReactElement | null {
  const pageSlug = useSelector(pageSlugSelector);

  if (IS_EXTERNAL_POPUP) {
    return null;
  }

  const previewUrl = Config.getAll().urls.pagePreview;

  let suffix = "";
  if (process.env.NODE_ENV === "development") {
    suffix = new URL(window.parent.location.href).searchParams.has("pro")
      ? "?pro=true"
      : "";
  }

  const url =
    IS_INTERNAL_POPUP || IS_EXTERNAL_STORY
      ? previewUrl
      : previewUrl + "/" + pageSlug + suffix;

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
