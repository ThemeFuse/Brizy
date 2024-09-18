import classNames from "classnames";
import React, { ReactElement } from "react";
import {
  Props as TooltipProps,
  Tooltip
} from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { HelperPlacement } from "visual/types/attributes";
import { Str } from "@brizy/readers";

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
  const labelLength = label?.length ?? 0;
  const labelClassName = classNames("brz-ed-option__label__text", {
    "brz-ed-option__label__text--small": labelLength < 13
  });

  return label || icon || helper ? (
    <div className="brz-ed-option__label brz-ed-option__focal-point__label">
      {icon ? (
        <EditorIcon className={"brz-ed-option__label__icon"} icon={icon} />
      ) : null}
      {label ? (
        <span className={labelClassName}>
          {/*Prevent CSS from braking words on hyphen character*/}
          {Str.is(label) ? label?.replace("-", "\u2011") : label}
        </span>
      ) : null}
      {helper && (
        <div className="brz-ed-option__helper">
          <Tooltip
            placement={helperPlacement as TooltipProps["placement"]}
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
