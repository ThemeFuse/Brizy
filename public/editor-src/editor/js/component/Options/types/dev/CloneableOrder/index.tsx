import React, { useCallback } from "react";
import * as Option from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import EditorIcon from "visual/component/EditorIcon";
import { isDisabled } from "visual/component/Options/types/dev/CloneableOrder/utils";
import classNames from "classnames";
import { t } from "visual/utils/i18n";

const empty = (): void => undefined;

export type Config = {
  disable?: "left" | "right" | "all" | "none";
  onChange?: (v: "left" | "right") => void;
};

export type Props = Option.Props<undefined> &
  WithConfig<Config> &
  WithClassName;

export const CloneableOrder: React.FC<Props> & Option.OptionType<undefined> = ({
  className,
  config,
  label
}) => {
  const onChange = config?.onChange ?? empty;
  const disable = config?.disable ?? "none";

  const onLeft = useCallback(
    () => !isDisabled("left", disable) && onChange("left"),
    [onChange, disable]
  );
  const onRight = useCallback(
    () => !isDisabled("right", disable) && onChange("right"),
    [onChange, disable]
  );

  return (
    <div className={classNames(className, "brz-ed-option__cloneable-order")}>
      {label}
      <span title={t("Move left")} onClick={onLeft}>
        <EditorIcon
          icon={"nc-left-arrow-heavy"}
          className={classNames({
            "brz-ed__disabled": isDisabled("left", disable)
          })}
        />
      </span>
      <span title={t("Move right")} onClick={onRight}>
        <EditorIcon
          icon={"nc-right-arrow-heavy"}
          className={classNames({
            "brz-ed__disabled": isDisabled("right", disable)
          })}
        />
      </span>
    </div>
  );
};

const getModel: Option.GetModel<undefined> = () => undefined;
const getElementModel: Option.GetElementModel<undefined> = () => ({});

CloneableOrder.getModel = getModel;
CloneableOrder.getElementModel = getElementModel;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
CloneableOrder.defaultValue = undefined;
