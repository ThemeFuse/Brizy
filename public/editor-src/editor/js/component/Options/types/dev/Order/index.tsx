import React, { useCallback } from "react";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import EditorIcon from "visual/component/EditorIcon";
import {
  isDisabled,
  firstText,
  secondText,
  firstArrow,
  secondArrow
} from "./utils";
import { Align } from "./types";
import classNames from "classnames";

const empty = (): void => undefined;

export type Config = {
  disable?: "prev" | "next" | "all" | "none";
  onChange?: (v: "prev" | "next") => void;
  align?: Align;
};

export type Props = Option.Props<undefined> &
  WithConfig<Config> &
  WithClassName;

export const Order: React.FC<Props> & Option.OptionType<undefined> = ({
  className,
  config,
  label
}) => {
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
        `brz-ed-option__order__${align}`
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

const getModel: Option.FromElementModel<undefined> = () => undefined;
const getElementModel: Option.ToElementModel<undefined> = () => ({});

Order.fromElementModel = getModel;
Order.toElementModel = getElementModel;

// @ts-expect-error: Variable 'defaultValue' implicitly has an 'any' type.
Order.defaultValue = undefined;
