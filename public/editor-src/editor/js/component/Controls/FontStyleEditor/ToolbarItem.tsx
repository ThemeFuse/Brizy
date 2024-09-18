import { TextEditor } from "visual/component/Controls/TextEditor";
import { t } from "visual/utils/i18n";
import React from "react";
import { ToolbarItemProp } from "./types";
import { Toggle } from "visual/utils/options/utils/Type";

export const ToolbarItem = ({
  deletable,
  style,
  title,
  onClick
}: ToolbarItemProp) => (
  <div className="brz-ed-option__font-style-editor__container">
    <p className="brz-p brz-ed-option__font-style-editor__title">
      {deletable === Toggle.ON ? (
        <TextEditor value={title} onChange={onClick} />
      ) : (
        title
      )}
    </p>
    <p className="brz-p brz-ed-option__font-style-editor__sample" style={style}>
      {t("It's a sample")}
    </p>
  </div>
);
