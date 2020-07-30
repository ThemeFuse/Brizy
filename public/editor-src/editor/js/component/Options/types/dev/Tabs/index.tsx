import React, { FC, useCallback, useEffect, useState } from "react";
import { sortBy } from "underscore";
import Options, { filterOptionsData } from "visual/component/Options";
import * as Option from "visual/component/Options/Type";
import { Literal, read } from "visual/utils/types/Literal";
import { SimpleValue } from "visual/component/Options/Type";
import {
  WithClassName,
  WithConfig,
  WithId
} from "visual/utils/options/attributes";
import { OptionDefinition } from "visual/component/Options/Type";
import { Tabs as Control } from "visual/component/Controls/Tabs2";
import { Tab } from "visual/component/Controls/Tabs2/Tab";
import { Props as CProps } from "visual/component/Controls/Tabs2";

export type Config = {
  showSingle?: boolean;
  saveTab?: boolean;
  position?: CProps["position"];
  align?: CProps["align"];
};

export type Props = Option.Props<Literal, SimpleValue<Literal>> &
  WithConfig<Config> &
  WithClassName & {
    toolbar: object;
    tabs: (WithId<Literal> &
      WithClassName & {
        title?: string;
        icon?: string;
        label?: string;
        position?: number;
        options: OptionDefinition[];
      })[];
  };

export const Tabs: FC<Props> &
  Option.OptionType<Literal> &
  Option.SelfFilter<Props> = ({
  tabs,
  onChange,
  value,
  config,
  toolbar,
  className
}) => {
  const [_value, setValue] = useState(value);
  const position = config?.position ?? "top";
  const align = config?.align ?? "center";
  const _onChange = useCallback(setValue, [value]);

  useEffect(() => {
    if (config?.saveTab) {
      onChange({ value: _value });
    }
  }, [_value]);

  const tabsList = tabs.filter(t => filterOptionsData(t.options).length > 0);

  return (
    <Control
      align={align}
      value={_value}
      onChange={_onChange}
      position={position}
      showSingle={config?.showSingle ?? false}
      className={className}
    >
      {sortBy(tabsList, ({ position = 100 }) => position).map(
        ({ id, title, label, options, className, icon }) => {
          return (
            <Tab
              key={id}
              value={id}
              title={title}
              label={label}
              icon={icon}
              className={className}
            >
              <Options wrapOptions={false} data={options} toolbar={toolbar} />
            </Tab>
          );
        }
      )}
    </Control>
  );
};

export const getModel: Option.GetModel<Literal> = get =>
  read(get("value")) ?? "";

Tabs.getModel = getModel;

Tabs.shouldOptionBeFiltered = ({ tabs = [] }): boolean =>
  tabs.every(tab => filterOptionsData(tab?.options ?? []).length === 0);
