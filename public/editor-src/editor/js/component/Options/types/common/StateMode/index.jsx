import React, { Component } from "react";
import T from "prop-types";
import _ from "underscore";
import Options, { filterOptionsData } from "visual/component/Options";
import Tabs from "visual/component/Controls/Tabs/Tabs";
import Tab from "visual/component/Controls/Tabs/Tab";
import { flatten, stateIcon, stateTitle, filterByState } from "./utils";
import { states } from "visual/utils/stateMode";
import { haveState } from "visual/utils/stateMode/editorComponent";
import * as State from "visual/utils/stateMode";

export default class StateMode extends Component {
  static propTypes = {
    options: T.arrayOf(T.object),
    className: T.string,
    location: T.string,
    toolbar: T.object,
    onChange: T.func,
    value: T.string
  };

  static defaultProps = {
    options: [],
    className: "",
    location: "",
    toolbar: "",
    value: State.toString(State.empty),
    onChange: _.noop
  };

  static shouldOptionBeFiltered({ options }) {
    return filterOptionsData(options).length === 0;
  }

  componentWillUnmount() {
    if (this.active() !== State.empty) {
      this.props.onChange(State.toString(State.empty));
    }
  }

  haveState = state => haveState(state, flatten(this.props.options));

  active = () => {
    const state = State.mRead(this.props.value);

    return this.haveState(state) ? state : State.empty;
  };

  renderOption = state => {
    return (
      <Options
        className="brz-ed-tabs__options"
        optionClassName={this.props.className}
        data={filterByState(state, this.props.options)}
        toolbar={this.props.toolbar}
        location={this.props.location}
      />
    );
  };

  renderTabs = states => {
    return (
      <Tabs
        tabsPosition="left"
        value={State.toString(this.active())}
        onChange={this.props.onChange}
      >
        {states.map(state => (
          <Tab
            key={state}
            active={this.active() === state}
            title={stateTitle(state)}
            icon={stateIcon(state)}
            value={State.toString(state)}
          >
            {this.renderOption(state)}
          </Tab>
        ))}
      </Tabs>
    );
  };

  render() {
    const statesList = states().filter(this.haveState);

    switch (statesList.length) {
      case 0:
        return null;
      case 1:
        return this.renderOption(statesList[0]);
      default:
        return this.renderTabs(statesList);
    }
  }
}
