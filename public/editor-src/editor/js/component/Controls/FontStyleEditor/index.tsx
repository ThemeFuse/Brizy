import React, { forwardRef } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Scrollbar, ScrollbarRef } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import { Props } from "./types";

export const FontStyle = forwardRef<ScrollbarRef, Props>(
  ({ className, items, onClick }, ref) => (
    <div className={className}>
      {items && (
        <Scrollbar theme="dark" ref={ref} absolute>
          {items}
        </Scrollbar>
      )}
      <div className="brz-ed-option__font-styles--add" onClick={onClick}>
        <EditorIcon icon="nc-add" />
        <span className="brz-span">{t("Add New")}</span>
      </div>
    </div>
  )
);
