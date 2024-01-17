import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function CurrentDate(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  const currentDate = new Date()
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={(type) => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="before" value="before" title={t("is before")}>
          {t("is before")}
        </SelectItem>
        <SelectItem key="matches" value="matches" title={t("matches")}>
          {t("matches")}
        </SelectItem>
        <SelectItem key="after" value="after" title={t("is after")}>
          {t("is after")}
        </SelectItem>
      </Select>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder={currentDate}
          value={triggerValue.value}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, value })
          }
        />
      </div>
    </React.Fragment>
  );
}
