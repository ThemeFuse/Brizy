import React from "react";
import T from "prop-types";
import Option from "./Option";

class Options extends React.Component {
  static propTypes = {
    wrapOptions: T.bool
  };

  static defaultProps = {
    className: "",
    optionClassName: "",
    location: "",
    data: null,
    toolbar: null,
    wrapOptions: true
  };

  render() {
    const {
      data,
      className,
      optionClassName,
      toolbar,
      location,
      wrapOptions
    } = this.props;
    const options = data.map((optionData, index) => (
      <Option
        key={optionData.id || index}
        className={optionClassName}
        toolbar={toolbar}
        data={optionData}
        location={location}
      />
    ));

    return wrapOptions ? <div className={className}>{options}</div> : options;
  }
}

export default Options;
