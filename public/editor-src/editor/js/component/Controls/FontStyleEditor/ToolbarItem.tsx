import React, { forwardRef } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { t } from "visual/utils/i18n";
import { Toggle } from "visual/utils/options/utils/Type";
import { ToolbarItemProp } from "./types";

export const ToolbarItem = forwardRef<HTMLDivElement, ToolbarItemProp>(
  ({ deletable, style, title, onClick }, ref) => (
    <div className="brz-ed-option__font-style-editor__container" ref={ref}>
      <p className="brz-p brz-ed-option__font-style-editor__title">
        {deletable === Toggle.ON ? (
          <TextEditor value={title} onChange={onClick} />
        ) : (
          title
        )}
      </p>
      <p
        className="brz-p brz-ed-option__font-style-editor__sample"
        style={style}
      >
        {t("It's a sample")}
      </p>
    </div>
  )
);
