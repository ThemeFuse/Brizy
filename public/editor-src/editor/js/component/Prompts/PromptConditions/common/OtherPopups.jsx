import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function OtherPopups(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={(type) => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="was" value="was">
          {t("was shown")}
        </SelectItem>
        <SelectItem key="was not" value="was not">
          {t("was not shown")}
        </SelectItem>
      </Select>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={(value) => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="page" value="page">
          {t("on the same page")}
        </SelectItem>
        <SelectItem key="session" value="session">
          {t("during the session")}
        </SelectItem>
      </Select>
    </React.Fragment>
  );
}
