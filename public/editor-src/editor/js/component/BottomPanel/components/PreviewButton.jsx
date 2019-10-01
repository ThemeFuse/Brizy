import React from "react";
import Config from "visual/global/Config";
import EditorIcon from "visual/component/EditorIcon";

const PreviewButtons = () => {
  const url = Config.get("urls").pagePreview;

  return (
    <li
      className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__preview"
      title="Preview"
    >
      <a href={url} className="brz-a" target="_blank">
        <EditorIcon icon="nc-preview" />
      </a>
    </li>
  );
};

export default PreviewButtons;
