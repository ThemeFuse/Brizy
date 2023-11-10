import React, { FC, useCallback, useEffect, useState } from "react";
import { sortBy } from "underscore";
import { Tabs as Control } from "visual/component/Controls/Tabs2";
import { Props as CProps } from "visual/component/Controls/Tabs2";
import { Tab } from "visual/component/Controls/Tabs2/Tab";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { SimpleValue } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import {
  WithClassName,
  WithConfig,
  WithId
} from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";

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
  const {
    position = "top",
    align = "center",
    saveTab,
    showSingle = false
  } = config ?? {};

  const [_value, setValue] = useState(value);
  const _onChange = useCallback(setValue, [setValue]);

  useEffect(() => {
    if (saveTab) {
      onChange({ value: _value });
    }
  }, [_value, saveTab, onChange]);

  return (
    <Control
      align={align}
      value={_value}
      onChange={_onChange}
      position={position}
      showSingle={showSingle}
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
