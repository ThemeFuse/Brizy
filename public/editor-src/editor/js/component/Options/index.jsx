import React from "react";
import T from "prop-types";
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

    const optionType = OptionTypes[type];

    if (process.env.NODE_ENV === "development") {
      if (!optionType) {
        /* eslint-disable no-console */
        console.error(`Option type "${type}" is not defined`);
        /* eslint-enabled no-console */
      }
    }

    if (
      optionType &&
      typeof optionType.shouldOptionBeFiltered === "function" &&
      OptionTypes[type].shouldOptionBeFiltered(option)
    ) {
      return false;
    }

    return true;
  });

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
    const options = filterOptionsData(data).map((optionData, index) => (
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
