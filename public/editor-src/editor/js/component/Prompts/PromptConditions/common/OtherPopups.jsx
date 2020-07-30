import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

export default function OtherPopups(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={type => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="was" value="was">
          was shown
        </SelectItem>
        <SelectItem key="was not" value="was not">
          was not shown
        </SelectItem>
      </Select>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={value => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="page" value="page">
          on the same page
        </SelectItem>
        <SelectItem key="session" value="session">
          during the session
        </SelectItem>
      </Select>
    </React.Fragment>
  );
}
