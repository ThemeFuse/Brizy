import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";

export default function SpecificPopup(props) {
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
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder="#popup-id"
          value={triggerValue.value}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, value })
          }
        />
      </div>
    </React.Fragment>
  );
}
