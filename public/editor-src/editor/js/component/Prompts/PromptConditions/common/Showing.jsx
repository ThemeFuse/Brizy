import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

export default function Showing(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={value => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="views" value="views">
          Page Views
        </SelectItem>
        <SelectItem key="sessions" value="sessions">
          Sessions
        </SelectItem>
      </Select>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="number"
          placeholder="Number of"
          value={triggerValue[triggerValue.value]}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, [triggerValue.value]: value })
          }
        />
      </div>
    </React.Fragment>
  );
}
