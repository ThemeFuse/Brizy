import React, { FC, ReactElement } from "react";
import classNames from "classnames";
import { NonEmptyArray } from "visual/utils/array/types";
import * as Option from "visual/component/Options/Type";
import { Literal, read } from "visual/utils/types/Literal";
import { IconToggle } from "visual/component/Controls/IconToggle";
import {
  IconToggleItem,
  Props as ItemProps
} from "visual/component/Controls/IconToggle/IconToggleItem";
import { WithClassName } from "visual/utils/options/attributes";

type Choice = {
  icon: string;
  title: string;
  value: Literal;
};

export type Props = Option.Props<Literal, { value: Literal }> &
  WithClassName & {
    choices: Choice[];
  };

export const Toggle: FC<Props> & Option.OptionType<Literal> = ({
  className,
  choices,
  value,
  onChange
}) => {
  const _className = classNames("brz-ed-option__toggle", className);

  return choices.length ? (
    <IconToggle<Literal>
      value={value}
      onChange={(value): void => onChange({ value })}
      className={_className}
    >
      {
        choices.map(({ icon, value, title }, i) => (
          <IconToggleItem<Literal>
            key={i}
            value={value}
            icon={icon}
            title={title}
          />
        )) as NonEmptyArray<ReactElement<ItemProps<Literal>>>
      }
    </IconToggle>
  ) : null;
};

const getModel: Option.GetModel<Literal> = get => read(get("value")) ?? "";

Toggle.getModel = getModel;
