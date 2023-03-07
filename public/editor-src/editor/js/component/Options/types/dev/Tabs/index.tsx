import React, { FC, useCallback, useEffect, useState } from "react";
import { sortBy } from "underscore";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";
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

export type Config = {
  showSingle?: boolean;
  saveTab?: boolean;
  position?: CProps<Literal>["position"];
  align?: CProps<Literal>["align"];
};

export type Props = OptionProps<SimpleValue<Literal>> &
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

export const Tabs: FC<Props> = ({
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
