import classNames from "classnames";
import React, { useCallback } from "react";
import EditorIcon from "visual/component/EditorIcon";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
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

export const Order: React.FC<Props> = ({ className, config, label }) => {
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
        "brz-ed-option__order flex justify-center items-center p-[13px_0]",
        `brz-ed-option__order__${
          align === "vertical" ? "vertical flex-col p-[7px_0]" : "horizontal"
        }`
      )}
    >
      {label}
      <span title={firstText(align)} onClick={onLeft} className="flex">
        <EditorIcon
          icon={firstArrow(align)}
          className={classNames(
            "transition-[color] duration-200 ease-linear delay-[0s] text-white text-[13px] [&:not(.brz-ed__disabled)]:hover:text-brand-primary",
            {
              "brz-ed__disabled !text-gray-light cursor-default": isDisabled(
                "prev",
                disable
              )
            }
          )}
        />
      </span>
      <span title={secondText(align)} onClick={onRight} className="flex">
        <EditorIcon
          icon={secondArrow(align)}
          className={classNames(
            "transition-[color] duration-200 ease-linear delay-[0s] text-white text-[13px] [&:not(.brz-ed__disabled)]:hover:text-brand-primary",
            {
              "brz-ed__disabled !text-gray-light cursor-default": isDisabled(
                "next",
                disable
              )
            }
          )}
        />
      </span>
    </div>
  );
};
