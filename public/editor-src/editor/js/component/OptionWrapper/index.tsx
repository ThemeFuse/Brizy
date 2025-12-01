import classNames from "classnames";
import React from "react";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";
import Tooltip from "../Controls/Tooltip";
import EditorIcon from "../EditorIcon";
import { ProInfo } from "../ProInfo";

export type Props = {
  className?: string;
  display?: "inline" | "block";
  title?: string;
  lock?: boolean;
  upgradeToPro?: string;
  id?: string;
};

export const OptionWrapper: FCC<Props> = ({
  children,
  className,
  display = "inline",
  title,
  lock,
  upgradeToPro,
  id
}) => {
  const _className = classNames(
    "brz-ed-option-wrapper",
    `brz-ed-option__${display}`,
    className,
    {
      "brz-ed-option-wrapper__isLocked": lock === true
    }
  );

  return (
    <div className={_className} title={title} data-option-id={id}>
      {children}
      {lock === true ? (
        <span className="brz-ed-option-wrapper__lock">
          <Tooltip
            overlayClassName="brz-ed-tooltip--delay-1"
            size="small"
            openOnClick={false}
            closeDelay={500}
            overlay={
              <ProInfo
                text={t("Upgrade to PRO, to use this option")}
                url={upgradeToPro ?? ""}
              />
            }
            offset={10}
          >
            <EditorIcon
              icon={"nc-lock"}
              className="brz-ed-option-wrapper__lock__icon"
            />
          </Tooltip>
        </span>
      ) : null}
    </div>
  );
};
