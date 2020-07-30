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
          viewed pages
        </SelectItem>
        <SelectItem key="sessions" value="sessions">
          Sessions
        </SelectItem>
      </Select>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={type => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="is fewer" value="is fewer">
          is fewer than
        </SelectItem>
        <SelectItem key="equals" value="equals">
          equals
        </SelectItem>
        <SelectItem key="is more" value="is more">
          is more than
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
