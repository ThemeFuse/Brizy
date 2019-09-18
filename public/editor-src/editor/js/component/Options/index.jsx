import React from "react";
import { currentUserRole } from "visual/component/Roles";
import { getStore } from "visual/redux/store";
import { deviceModeSelector } from "visual/redux/selectors";
import OptionTypes from "visual/component/Options/types";
import Option from "./Option";

export const filterOptionsData = data =>
  data.filter(option => {
    const { type, disabled, devices, roles } = option;

    if (!type) {
      return false;
    }

    if (disabled === true) {
      return false;
    }

    if (devices && devices !== "all") {
      const deviceMode = deviceModeSelector(getStore().getState());

      if (devices === "desktop" && deviceMode !== "desktop") {
        return false;
      }

      if (devices === "responsive" && deviceMode === "desktop") {
        return false;
      }
    }

    if (Array.isArray(roles) && !roles.includes(currentUserRole())) {
      return false;
    }

    if (
      typeof OptionTypes[type].shouldOptionBeFiltered === "function" &&
      OptionTypes[type].shouldOptionBeFiltered(option)
    ) {
      return false;
    }

    return true;
  });

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
        key={optionData.id || index}
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
