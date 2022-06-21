import React, { FC, useCallback, useEffect } from "react";
import { mPipe } from "fp-utilities";
import Options from "visual/component/Options";
import Tabs from "visual/component/Controls/Tabs/Tabs";
import Tab from "visual/component/Controls/Tabs/Tab";
import { stateIcon, stateTitle, filterByState, itemStates } from "./utils";
import * as State from "visual/utils/stateMode";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { callGetter, SimpleValue } from "visual/component/Options/Type";
import * as Option from "visual/component/Options/Type";
import { pipe } from "visual/utils/fp";
import * as Str from "visual/utils/string/specs";
import { isT, onNullish } from "visual/utils/value";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import { withOptions } from "visual/component/Options/utils/filters";

export interface Props extends Option.Props<SimpleValue<State.State>> {
  options: ToolbarItemType[];
  className?: string;
  location?: string;
  toolbar?: ToolbarItemsInstance;
  states: State.State[];
}

export const StateMode: FC<Props> &
  Option.OptionType<SimpleValue<State.State>> &
  Option.SelfFilter<"stateMode-dev"> = ({
  options,
  states,
  className,
  toolbar,
  location,
  onChange,
  value: { value }
}) => {
  const itemsStates = options.reduce(
    (acc: State.State[], o) => [...acc, ...itemStates(o)],
    []
  );
  const statesList = states.filter(s => itemsStates.includes(s));
  const _onChange = useCallback((value: State.State) => onChange({ value }), [
    onChange
  ]);

  useEffect(() => () => onChange({ value: State.empty }), []);

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

StateMode.defaultValue = {
  value: State.empty
};

StateMode.fromElementModel = pipe(
  callGetter("value"),
  Str.read,
  mPipe(State.fromString),
  onNullish(State.empty as State.State),
  value => ({ value })
);

StateMode.toElementModel = value => value;

StateMode.filter = withOptions;

StateMode.reduce = (acc, t0, item) => item.options.reduce(acc, t0);

StateMode.map = (fn, item) => ({ ...item, options: item.options.map(fn) });
