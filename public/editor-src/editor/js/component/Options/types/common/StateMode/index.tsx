import React, { FC, useCallback, useEffect, useRef } from "react";
import Options from "visual/component/Options";
import Tabs from "visual/component/Controls/Tabs/Tabs";
import Tab from "visual/component/Controls/Tabs/Tab";
import { stateIcon, stateTitle, filterByState, itemStates } from "./utils";
import * as State from "visual/utils/stateMode";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { SimpleValue } from "visual/component/Options/Type";
import { Props as OptionProps } from "visual/component/Options/Type";
import { isT } from "visual/utils/value";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";

export interface Props extends OptionProps<SimpleValue<State.State>> {
  options: ToolbarItemType[];
  className?: string;
  location?: string;
  toolbar?: ToolbarItemsInstance;
  states: State.State[];
}

export const StateMode: FC<Props> = ({
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
  const statesList = states.filter(s => itemsStates.includes(s));
  const _onChange = useCallback(
    (value: State.State) => onChangeRef.current.onChange({ value }),
    []
  );

  useEffect(
    () => () => onChangeRef.current.onChange({ value: State.empty }),
    []
  );

  switch (statesList.length) {
    case 0:
      return null;
    case 1:
      return (
        <Options
          className="brz-ed-tabs__options"
          optionClassName={className}
          data={options.map(o => filterByState(states[0], o)).filter(isT)}
          toolbar={toolbar}
          location={location}
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
          {statesList.map(state => (
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
                data={options.map(o => filterByState(state, o)).filter(isT)}
                toolbar={toolbar}
                location={location}
              />
            </Tab>
          ))}
        </Tabs>
      );
  }
};
