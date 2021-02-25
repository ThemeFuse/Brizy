import React, { ReactElement } from "react";
import { HelperPlacement } from "visual/utils/options/attributes";
import EditorIcon from "visual/component/EditorIcon";
import Tooltip from "visual/component/Controls/Tooltip";

export interface Props {
  label?: string;
  icon?: string;
  helper?: string;
  helperPlacement?: HelperPlacement;
}

export const OptionLabel = ({
  label,
  icon,
  helper,
  helperPlacement
}: Props): ReactElement => {
  return label || icon || helper ? (
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
  ) : (
    <></>
  );
};
