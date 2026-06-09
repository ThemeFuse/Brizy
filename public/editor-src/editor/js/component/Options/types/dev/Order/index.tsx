import classNames from "classnames";
import React, { ReactElement, useCallback } from "react";
import EditorIcon from "visual/component/EditorIcon";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/types/attributes";
import { Align } from "./types";
import {
  firstArrow,
  firstText,
  isDisabled,
  secondArrow,
  secondText
} from "./utils";

const empty = (): void => undefined;

export type Config = {
  disable?: "prev" | "next" | "all" | "none";
  onChange?: (v: "prev" | "next") => void;
  align?: Align;
};

export type Props = Option.Props<undefined> &
  WithConfig<Config> &
  WithClassName;

export const Order = ({ className, config, label }: Props): ReactElement => {
  const onChange = config?.onChange ?? empty;
  const disable = config?.disable ?? "none";

  const onLeft = useCallback(
    () => !isDisabled("prev", disable) && onChange("prev"),
    [onChange, disable]
  );
  const onRight = useCallback(
    () => !isDisabled("next", disable) && onChange("next"),
    [onChange, disable]
  );
  const align = config?.align ?? "horizontal";

  return (
    <div
      className={classNames(
        className,
        "brz-ed-option__order",
        `brz-ed-option__order__${align === "vertical" ? "vertical" : "horizontal"}`
      )}
    >
      {label}
      <span title={firstText(align)} onClick={onLeft}>
        <EditorIcon
          icon={firstArrow(align)}
          className={classNames({
            "brz-ed__disabled": isDisabled("prev", disable)
          })}
        />
      </span>
      <span title={secondText(align)} onClick={onRight}>
        <EditorIcon
          icon={secondArrow(align)}
          className={classNames({
            "brz-ed__disabled": isDisabled("next", disable)
          })}
        />
      </span>
    </div>
  );
};
