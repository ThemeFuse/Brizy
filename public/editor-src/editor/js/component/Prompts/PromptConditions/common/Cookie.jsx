import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

export default function Cookie(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder="param"
          value={triggerValue.param}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, param: value })
          }
        />
      </div>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={type => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="matches" value="matches">
          matches
        </SelectItem>
        <SelectItem key="contains" value="contains">
          contains
        </SelectItem>
        <SelectItem key="does not contain" value="does not contain">
          does not contain
        </SelectItem>
        <SelectItem key="does not match" value="does not match">
          does not match
        </SelectItem>
      </Select>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder="value"
          value={triggerValue.value}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, value })
          }
        />
      </div>
    </React.Fragment>
  );
}
