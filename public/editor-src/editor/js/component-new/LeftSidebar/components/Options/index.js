import React from "react";
import classnames from "classnames";
import Option from "./Option";

class Options extends React.Component {
  static defaultProps = {
    className: "",
    data: null,
    meta: {}
  };

  render() {
    const {
      className: _className,
      data: _data,
      optionClassName,
      meta
    } = this.props;
    const className = classnames(
      "brz-ed-sidebar__control__options",
      _className
    );
    const data = _data.filter(el => !el.disabled);
    const options = data.map((option, index) => (
      <Option
        key={index}
        className={classnames("brz-ed-sidebar__control__item", optionClassName)}
        data={option}
        meta={meta}
      />
    ));

    return <div className={className}>{options}</div>;
  }
}

export default Options;
