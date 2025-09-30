import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

interface DeletedRuleNotificationProps {
  onRemove: () => void;
}

export const DeletedRuleNotification: React.FC<
  DeletedRuleNotificationProps
> = ({ onRemove }) => {
  return (
    <div className="brz-ed-popup-conditions__deleted-rule-notification">
      <span className="brz-ed-popup-conditions__deleted-rule-notification-text">
        {t("This type was removed, please remove this item!")}
      </span>
      <div className="brz-ed-popup-conditions__remove" onClick={onRemove}>
        <EditorIcon icon="nc-trash" />
      </div>
    </div>
  );
};
