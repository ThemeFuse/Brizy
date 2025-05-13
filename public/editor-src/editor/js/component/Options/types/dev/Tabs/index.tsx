import { sortBy } from "es-toolkit";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  Props as CProps,
  Tabs as Control
} from "visual/component/Controls/Tabs2";
import { Tab } from "visual/component/Controls/Tabs2/Tab";
import Options from "visual/component/Options";
import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { usePro } from "visual/global/hooks";
import { useConfig } from "visual/providers/ConfigProvider";
import { WithClassName, WithConfig, WithId } from "visual/types/attributes";
import { Literal } from "visual/utils/types/Literal";

export type Config = {
  showSingle?: boolean;
  saveTab?: boolean;
  position?: CProps<Literal>["position"];
  align?: CProps<Literal>["align"];
};

type OptionTab = {
  title?: string;
  label?: string;
  position?: number;
  options?: ToolbarItemType[];
} & WithId<Literal> &
  WithClassName;

export type Props = OptionProps<SimpleValue<Literal>> &
  WithConfig<Config> &
  WithClassName & {
    tabs?: OptionTab[];
  };

export const Tabs = ({
  tabs = [],
  onChange,
  value: { value },
  config,
  toolbar,
  className
}: Props): ReactElement => {
  const {
    position = "top",
    align = "center",
    saveTab,
    showSingle = false
  } = config ?? {};

  const [_value, setValue] = useState(value);
  const _onChange = useCallback(setValue, [setValue]);

  const cnfg = useConfig();

  const pro = usePro();

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
      {sortBy(tabs, [({ position = 100 }) => position]).map(
        ({ id, title, label, options, className }) => {
          return (
            <Tab
              key={id}
              value={id}
              title={title}
              label={label}
              className={className}
            >
              <Options
                wrapOptions={false}
                data={options}
                toolbar={toolbar}
                isPro={pro}
                upgradeToPro={cnfg?.urls?.upgradeToPro}
              />
            </Tab>
          );
        }
      )}
    </Control>
  );
};
