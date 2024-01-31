import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Button } from "visual/component/Prompts/common/Button";
import { t } from "visual/utils/i18n";

export interface Props {
  onReplaceStyling: VoidFunction;
  onImport: VoidFunction;
  replaceStyle: boolean;
  loading: boolean;
  hasGlobalStyle: boolean;
}
export const Footer = ({
  onReplaceStyling,
  onImport,
  loading,
  replaceStyle,
  hasGlobalStyle
}: Props) => {
  return (
    <div className="brz-ed-popup-two-details-footer">
      <div className="brz-ed-popup-two-details-footer-radio">
        {hasGlobalStyle && (
          <div
            className="brz-ed-popup-two-details-footer-radio-button"
            onClick={onReplaceStyling}
          >
            <EditorIcon
              icon={replaceStyle ? "nc-check" : "nc-uncheck"}
              className="brz-ed-popup-two-details-footer-radio-icon"
            />
            {t("Replace global styling")}
          </div>
        )}
      </div>
      <Button
        type="button"
        color="teal"
        size={2}
        loading={loading}
        onClick={onImport}
      >
        {t("Import This Layout")}
      </Button>
    </div>
  );
};
