import React from "react";
import Option from "./Option";

class Options extends React.Component {
  static defaultProps = {
    className: "",
    data: null
  };

  render() {
    const { data, className } = this.props;

    const options = data.map((option, index) => (
      <Option
        key={index}
        className="brz-ed-sidebar__control__item"
        data={option}
      />
    ));

    return <div className={className}>{options}</div>;
  }
}

export default Options;
