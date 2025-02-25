import { debounce } from "es-toolkit";
import React, { Component } from "react";

export default function debounceRenderHOC(
  ComponentToDebounce,
  ...debounceArgs
) {
  return class DebouncedContainer extends Component {
    updateDebounced = debounce(this.forceUpdate, ...debounceArgs);

    shouldComponentUpdate() {
      this.updateDebounced();
      return false;
    }

    componentWillUnmount() {
      this.updateDebounced.cancel();
    }

    render() {
      const { containerRef, ...rest } = this.props;
      return <ComponentToDebounce {...rest} ref={containerRef} />;
    }
  };
}
