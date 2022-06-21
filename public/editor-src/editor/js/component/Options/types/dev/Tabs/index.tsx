import React, { FC, useCallback, useEffect, useState } from "react";
import { sortBy } from "underscore";
import Options from "visual/component/Options";
import * as Option from "visual/component/Options/Type";
import { Literal, read } from "visual/utils/types/Literal";
import { SimpleValue } from "visual/component/Options/Type";
import {
  WithClassName,
  WithConfig,
  WithId
} from "visual/utils/options/attributes";
import { Tabs as Control } from "visual/component/Controls/Tabs2";
import { Tab } from "visual/component/Controls/Tabs2/Tab";
import { Props as CProps } from "visual/component/Controls/Tabs2";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { withTabs } from "visual/component/Options/utils/filters";

export type Config = {
  showSingle?: boolean;
  saveTab?: boolean;
  position?: CProps<Literal>["position"];
  align?: CProps<Literal>["align"];
};

export type Props = Option.Props<SimpleValue<Literal>> &
  WithConfig<Config> &
  WithClassName & {
    tabs?: (WithId<Literal> &
      WithClassName & {
        title?: string;
        label?: string;
        position?: number;
        options?: ToolbarItemType[];
      })[];
  };

export const Tabs: FC<Props> &
  Option.OptionType<SimpleValue<Literal>> &
  Option.SelfFilter<"tabs-dev"> = ({
  tabs = [],
  onChange,
  value: { value },
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

  return (
    <Control
      align={align}
      value={_value}
      onChange={_onChange}
      position={position}
      showSingle={config?.showSingle ?? false}
      className={className}
    >
      {sortBy(tabs, ({ position = 100 }) => position).map(
        ({ id, title, label, options, className }) => {
          return (
            <Tab
              key={id}
              value={id}
              title={title}
              label={label}
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

export const getModel: Option.FromElementModel<SimpleValue<Literal>> = get => ({
  value: read(get("value"))
});

const getElementModel: Option.ToElementModel<SimpleValue<Literal>> = values => {
  return {
    value: values.value
  };
};

Tabs.fromElementModel = getModel;

Tabs.toElementModel = getElementModel;

Tabs.defaultValue = { value: "" };

Tabs.filter = withTabs;

Tabs.reduce = (fn, t0, item) => {
  return (
    item.tabs?.reduce((acc, tab) => tab.options?.reduce(fn, acc) ?? t0, t0) ??
    t0
  );
};

Tabs.map = (fn, item) => ({
  ...item,
  tabs: item.tabs?.map(tab => ({ ...tab, options: tab.options?.map(fn) }))
});
