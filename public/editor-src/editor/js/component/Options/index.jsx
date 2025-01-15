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
    wrapOptions: true,
    isPro: false,
    upgradeToPro: ""
  };

  render() {
    const {
      data,
      className,
      optionClassName,
      toolbar,
      location,
      wrapOptions,
      isPro,
      upgradeToPro
    } = this.props;
    const options = data.map((optionData, index) => (
      <Option
        key={optionData.id || index}
        className={optionClassName}
        toolbar={toolbar}
        data={optionData}
        location={location}
        isPro={isPro}
        upgradeToPro={upgradeToPro}
      />
    ));

    return wrapOptions ? <div className={className}>{options}</div> : options;
  }
}

export default Options;
