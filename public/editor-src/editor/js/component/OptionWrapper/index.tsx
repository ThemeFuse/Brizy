import React from "react";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import Tooltip from "visual/component/Controls/Tooltip";
import { HelperPlacement } from "visual/utils/options/attributes";

export type Props = {
  className?: string;
  label?: string;
  icon?: string;
  helper?: string;
  display?: "inline" | "block";
  helperPlacement?: HelperPlacement;
};

export const OptionWrapper: React.FC<Props> = ({
  children,
  className,
  label,
  icon,
  helper,
  helperPlacement = "top",
  display = "inline"
}) => {
  const _className = classNames(
    "brz-ed-option-wrapper",
    `brz-ed-option__${display}`,
    className
  );

  return (
    <div className={_className}>
      {label || icon || helper ? (
        <div className="brz-ed-option__label brz-ed-option__focal-point__label">
          {icon ? (
            <EditorIcon className={"brz-ed-option__label__icon"} icon={icon} />
          ) : null}
          {label ? (
            <span className="brz-ed-option__label__text">
              {/*Prevent CSS from braking words on hyphen character*/}
              {label?.replace("-", "\u2011")}
            </span>
          ) : null}
          {helper && (
            <div className="brz-ed-option__helper">
              <Tooltip
                placement={helperPlacement}
                openOnClick={false}
                overlay={
                  <div
                    className="brz-ed-option__helper__content"
                    dangerouslySetInnerHTML={{ __html: helper }}
                  />
                }
              >
                <EditorIcon icon="nc-alert-circle-que" />
              </Tooltip>
            </div>
          )}
        </div>
      ) : null}
      {children}
    </div>
  );
};
