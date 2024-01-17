import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function TimeFrom(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.visit}
        onChange={(visit) => onChange({ ...triggerValue, visit })}
      >
        <SelectItem key="first" value="first" title={t("the first visit")}>
          {t("the first visit")}
        </SelectItem>
        <SelectItem key="last" value="last" title={t("the last visit")}>
          {t("the last visit")}
        </SelectItem>
      </Select>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={(type) => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="greater" value="greater" title={t("is greater than")}>
          {t("is greater than")}
        </SelectItem>
        <SelectItem key="less" value="less" title={t("is less than")}>
          {t("is less than")}
        </SelectItem>
      </Select>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="number"
          placeholder={t("Number of")}
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
        onChange={(time) => onChange({ ...triggerValue, time })}
      >
        <SelectItem key="days" value="days" title={t("days")}>
          {t("days")}
        </SelectItem>
        <SelectItem key="hours" value="hours" title={t("hours")}>
          {t("hours")}
        </SelectItem>
      </Select>
    </React.Fragment>
  );
}
