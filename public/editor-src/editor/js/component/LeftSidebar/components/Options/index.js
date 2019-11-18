import React from "react";
import classnames from "classnames";
import { currentUserRole } from "visual/component/Roles";
import Option from "./Option";

const fillerOption = ({ disabled, roles }) => {
  if (disabled === true) {
    return false;
  }

  if (Array.isArray(roles) && !roles.includes(currentUserRole())) {
    return false;
  }

  return true;
};

class Options extends React.Component {
  static defaultProps = {
    className: "",
    data: null,
    meta: {}
  };

  render() {
    const { className: _className, optionClassName, data, meta } = this.props;
    const className = classnames(
      "brz-ed-sidebar__control__options",
      _className
    );
    const options = data
      .filter(fillerOption)
      .map((option, index) => (
        <Option
          key={index}
          className={optionClassName}
          data={option}
          meta={meta}
        />
      ));

    return <div className={className}>{options}</div>;
  }
}

export default Options;
