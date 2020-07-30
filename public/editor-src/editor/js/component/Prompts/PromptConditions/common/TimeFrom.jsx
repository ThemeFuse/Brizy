import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

export default function TimeFrom(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.visit}
        onChange={visit => onChange({ ...triggerValue, visit })}
      >
        <SelectItem key="first" value="first">
          the first visit
        </SelectItem>
        <SelectItem key="last" value="last">
          the last visit
        </SelectItem>
      </Select>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={type => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="greater" value="greater">
          is greater than
        </SelectItem>
        <SelectItem key="less" value="less">
          is less than
        </SelectItem>
      </Select>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="number"
          placeholder="Number of"
          value={triggerValue.value}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, value })
          }
        />
      </div>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.time}
        onChange={time => onChange({ ...triggerValue, time })}
      >
        <SelectItem key="days" value="days">
          days
        </SelectItem>
        <SelectItem key="hours" value="hours">
          hours
        </SelectItem>
      </Select>
    </React.Fragment>
  );
}
