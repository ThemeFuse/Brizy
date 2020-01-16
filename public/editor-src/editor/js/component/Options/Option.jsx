import React from "react";
import T from "prop-types";
import classnames from "classnames";
import optionTypes from "./types";

class Option extends React.Component {
  static propTypes = {
    data: T.object,
    className: T.string,
    toolbar: T.object,
    location: T.string
  };

  static defaultProps = {
    className: "",
    data: null,
    toolbar: null,
    location: ""
  };

  render() {
    const { data, className: _className, location, toolbar } = this.props;
    const className = classnames(data.className, _className);
    const Component = optionTypes[data.type];

    return (
      <Component
        {...data}
        className={className}
        location={location}
        toolbar={toolbar}
      />
    );
  }
}

export default Option;
