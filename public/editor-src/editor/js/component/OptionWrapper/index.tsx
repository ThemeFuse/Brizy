import React from "react";
import classNames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import Tooltip from "visual/component/Controls/Tooltip";
import { HelperPlacement } from "visual/utils/options/attributes";

export type Props = {
  className?: string;
  label?: string;
  helper?: string;
  display?: "inline" | "block";
  helperPlacement?: HelperPlacement;
};

export const OptionWrapper: React.FC<Props> = ({
  children,
  className,
  label,
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
      {label || helper ? (
        <div className="brz-ed-option__label brz-ed-option__focal-point__label">
          {label}
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
