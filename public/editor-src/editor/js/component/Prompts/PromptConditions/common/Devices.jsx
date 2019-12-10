import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

export default function Devices(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue}
        onChange={value => onChange(value)}
      >
        <SelectItem key="desktop" value="desktop">
          Desktop
        </SelectItem>
        <SelectItem key="tablet" value="tablet">
          Tablet
        </SelectItem>
        <SelectItem key="mobile" value="mobile">
          Mobile
        </SelectItem>
      </Select>
    </React.Fragment>
  );
}
