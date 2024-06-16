import classNames from "classnames";
import React from "react";
import { t } from "visual/utils/i18n";
import Tooltip from "../Controls/Tooltip";
import EditorIcon from "../EditorIcon";
import { ProInfo } from "../ProInfo";
import { FCC } from "visual/utils/react/types";

export type Props = {
  className?: string;
  display?: "inline" | "block";
  title?: string;
  lock?: boolean;
  upgradeToPro?: string;
};

export const OptionWrapper: FCC<Props> = ({
  children,
  className,
  display = "inline",
  title,
  lock,
  upgradeToPro
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
    <div className={_className} title={title}>
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
