import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function LoggedIn(props) {
  const {
    value: triggerValue = {},
    availableRoles = [],
    onChange = () => {}
  } = props;

  let content = null;
  if (triggerValue.value === "custom") {
    if (!Array.isArray(availableRoles) || !availableRoles.length) {
      // Normally it should never happen. There always should be available roles
      content = <span>There are no available users. Add user first</span>;
    } else {
      content = (
        <Select
          className="brz-control__select--light"
          itemHeight={30}
          defaultValue={triggerValue.user}
          onChange={(value) => onChange({ ...triggerValue, user: value })}
        >
          {availableRoles.map(({ role, name }) => (
            <SelectItem key={role} value={role}>
              {name}
            </SelectItem>
          ))}
        </Select>
      );
    }
  }

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={handleValueChange}
      >
        <SelectItem key="all" value="all" title={t("All users")}>
          {t("All users")}
        </SelectItem>
        <SelectItem key="custom" value="custom" title={t("Custom")}>
          {t("Custom")}
        </SelectItem>
      </Select>
      {content}
    </React.Fragment>
  );

  function handleValueChange(value) {
    const data =
      value === "all" ? { value } : { value, user: availableRoles?.[0]?.role };

    onChange(data);
  }
}
