import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function CurrentUrl(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.type}
        onChange={(type) => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="matches" value="matches" title={t("matches")}>
          {t("matches")}
        </SelectItem>
        <SelectItem key="contains" value="contains" title={t("contains")}>
          {t("contains")}
        </SelectItem>
        <SelectItem
          key="does not contain"
          value="does not contain"
          title={t("does not contain")}
        >
          {t("does not contain")}
        </SelectItem>
        <SelectItem
          key="does not match"
          value="does not match"
          title={t("does not match")}
        >
          {t("does not match")}
        </SelectItem>
      </Select>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder={t("URL")}
          value={triggerValue.value}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, value })
          }
        />
      </div>
    </React.Fragment>
  );
}
