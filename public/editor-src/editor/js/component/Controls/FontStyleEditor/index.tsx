import { Scrollbar } from "visual/component/Scrollbar";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import React, { forwardRef } from "react";
import { Props } from "./types";
import { Scrollbars } from "react-custom-scrollbars";

export const FontStyle = forwardRef<Scrollbars, Props>(
  ({ className, items, onClick }, ref) => (
    <div className={className}>
      {items && (
        <Scrollbar theme="dark" ref={ref}>
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
