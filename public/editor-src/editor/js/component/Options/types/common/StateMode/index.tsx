import React, {
  ReactElement,
  useCallback,
  useLayoutEffect,
  useRef
} from "react";
import Tab from "visual/component/Controls/Tabs/Tab";
import Tabs from "visual/component/Controls/Tabs/Tabs";
import Options from "visual/component/Options";
import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { usePro } from "visual/global/hooks";
import { useConfig } from "visual/providers/ConfigProvider";
import {
  filterByState,
  itemStates,
  stateIcon,
  stateTitle
} from "visual/utils/options/StateMode/utils";
import { FCP } from "visual/utils/react/types";
import * as State from "visual/utils/stateMode";
import { isT } from "visual/utils/value";

export interface Props extends OptionProps<SimpleValue<State.State>> {
  options: ToolbarItemType[];
  className?: string;
  location?: string;
  toolbar?: ToolbarItemsInstance;
  states: State.State[];
}

export const StateMode: FCP<Props, ReactElement | null> = ({
  options,
  states,
  className,
  toolbar,
  location,
  onChange,
  value: { value }
}) => {
  const onChangeRef = useRef({ onChange });
  onChangeRef.current = { onChange };

  const itemsStates = options.reduce(
    (acc: State.State[], o) => [...acc, ...itemStates(o)],
    []
  );
  const statesList = states.filter((s) => itemsStates.includes(s));
  const _onChange = useCallback(
    (value: State.State) => onChangeRef.current.onChange({ value }),
    []
  );

  useLayoutEffect(
    () => () => onChangeRef.current.onChange({ value: State.empty }),
    []
  );

  const config = useConfig();

  const pro = usePro();

  switch (statesList.length) {
    case 0:
      return null;
    case 1:
      return (
        <Options
          className="brz-ed-tabs__options"
          optionClassName={className}
          data={options.map((o) => filterByState(states[0], o)).filter(isT)}
          toolbar={toolbar}
          location={location}
          isPro={pro}
          upgradeToPro={config?.urls?.upgradeToPro}
        />
      );
    default:
      return (
        <Tabs
          tabsPosition="left"
          value={value}
          onChange={_onChange}
          className="brz-ed-tabs__options"
        >
          {statesList.map((state) => (
            <Tab
              key={state}
              active={value === state}
              title={stateTitle(state)}
              icon={stateIcon(state)}
              value={state}
            >
              <Options
                className="brz-ed-tabs__options"
                optionClassName={className}
                data={options.map((o) => filterByState(state, o)).filter(isT)}
                toolbar={toolbar}
                location={location}
                isPro={pro}
                upgradeToPro={config?.urls?.upgradeToPro}
              />
            </Tab>
          ))}
        </Tabs>
      );
  }
};
