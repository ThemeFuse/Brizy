import React from "react";
import classnames from "classnames";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import Config from "visual/global/Config";

export default function LoggedIn(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;
  const { availableRoles } = Config.get("wp");

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={value => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="all" value="all">
          All users
        </SelectItem>
        <SelectItem key="custom" value="custom">
          Custom
        </SelectItem>
      </Select>
      {triggerValue.value === "custom" && (
        <Select
          className="brz-control__select--light"
          itemHeight={30}
          defaultValue={triggerValue.user}
          onChange={value => onChange({ ...triggerValue, user: value })}
        >
          {availableRoles.map(({ role, name }) => (
            <SelectItem key={role} value={role}>
              {name}
            </SelectItem>
          ))}
        </Select>
      )}
    </React.Fragment>
  );
}
