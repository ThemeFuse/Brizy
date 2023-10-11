import classnames from "classnames";
import React from "react";
import { currentUserRole } from "visual/component/Roles";
import { Option as OptionData } from "../../options";
import Option from "./Option";

const fillerOption = (option: OptionData) => {
  if (!option) {
    return false;
  }

  const { disabled, roles } = option;

  if (disabled === true) {
    return false;
  }

  if (Array.isArray(roles) && !roles.includes(currentUserRole())) {
    return false;
  }

  return true;
};

interface Props {
  className?: string;
  optionClassName?: string;
  data: null | Array<OptionData>;
  meta?: Record<string, unknown>;
}

class Options extends React.Component<Props> {
  static defaultProps: Props = {
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

    if (!data) {
      return;
    }

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
