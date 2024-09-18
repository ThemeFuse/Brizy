import React from "react";
import { Alert } from "visual/component/Alert";
import { t } from "visual/utils/i18n";
import { Button as PromptButton } from "./Button";
import { PromptViewProp } from "./types";

export const PromptView: React.FC<PromptViewProp> = ({
  img,
  title,
  error,
  description,
  children,
  isSaving,
  isCanceling,
  onClickSave,
  onClickCancel
}) => {
  return (
    <div className="brz-ed-popup-integrations__connect">
      <div className="brz-ed-popup-integrations__connect-head">
        <img className="brz-img" src={img} alt={title} />
        <div className="brz-p brz-ed-popup-integrations__connect-info">
          {description}
        </div>
        {error && <Alert type={"error"} message={error} />}
      </div>
      <div className="brz-ed-popup-integrations__connect-body">
        {children}
        <PromptButton color="teal" loading={isSaving} onClick={onClickSave}>
          {t("Connect")}
        </PromptButton>
        <PromptButton
          color="default"
          loading={isCanceling}
          onClick={onClickCancel}
        >
          {t("Cancel")}
        </PromptButton>
      </div>
    </div>
  );
};
