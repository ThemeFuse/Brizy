import React from "react";
import { currentUserRole } from "visual/component/Roles";
import Option from "./Option";

export const filterOptionsData = data =>
  data.filter(
    ({ disabled, roles }) =>
      disabled !== true &&
      (!roles || (Array.isArray(roles) && roles.includes(currentUserRole())))
  );

class Options extends React.Component {
  static defaultProps = {
    className: "",
    optionClassName: "",
    location: "",
    data: null,
    toolbar: null
  };

  render() {
    const { data, className, optionClassName, toolbar, location } = this.props;
    const options = filterOptionsData(data).map((optionData, index) => (
      <Option
        key={index}
        className={optionClassName}
        toolbar={toolbar}
        data={optionData}
        location={location}
      />
    ));

    return <div className={className}>{options}</div>;
  }
}

export default Options;
