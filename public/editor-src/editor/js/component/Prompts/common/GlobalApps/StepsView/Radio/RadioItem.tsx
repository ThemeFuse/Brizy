import React, { FC } from "react";
import RadioItemComponent from "visual/component/Controls/Radio/RadioItem";
import { Tooltip } from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

interface Props {
  value: string;
  isCompleted: boolean;
  onDisconnect: () => void;
  disconnectLoading: boolean;
  accountName: string;
  title?: string;
}

export const RadioItem: FC<Props> = ({
  value,
  isCompleted,
  onDisconnect,
  disconnectLoading,
  accountName,
  title,
  ...rest
}) => {
  const displayName = title ?? accountName ?? `Account ${value}`;

  return (
    <RadioItemComponent {...rest} value={value} isEditor>
      {displayName}
      {title && (
        <Tooltip
          openOnClick={true}
          inPortal={true}
          className="brz-ed-popup-integrations--tooltip"
          overlay={
            <div className="brz-ed-option__helper__content">{accountName}</div>
          }
        >
          <EditorIcon
            className="brz-ed-option__helper--center"
            icon="nc-alert-circle-que"
          />
        </Tooltip>
      )}
      {isCompleted && (
        <div
          title={t("Disconnect")}
          className="brz-ed-popup-integrations--delete"
          onClick={onDisconnect}
        >
          <EditorIcon
            icon={disconnectLoading ? "nc-circle-02" : "nc-connection"}
            className={disconnectLoading ? "brz-ed-animated--spin" : ""}
          />
        </div>
      )}
    </RadioItemComponent>
  );
};
