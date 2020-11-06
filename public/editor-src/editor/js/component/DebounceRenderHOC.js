import React, { Component } from "react";
import _ from "underscore";

export default function debounceRenderHOC(
  ComponentToDebounce,
  ...debounceArgs
) {
  return class DebouncedContainer extends Component {
    updateDebounced = _.debounce(this.forceUpdate, ...debounceArgs);

    shouldComponentUpdate() {
      this.updateDebounced();
      return false;
    }

    componentWillUnmount() {
      this.updateDebounced.cancel();
    }

    render() {
      return <ComponentToDebounce {...this.props} />;
    }
  };
}
