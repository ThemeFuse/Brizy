import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function Cookie(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder={t("param")}
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
        onChange={(type) => onChange({ ...triggerValue, type })}
      >
        <SelectItem key="matches" value="matches">
          {t("matches")}
        </SelectItem>
        <SelectItem key="contains" value="contains">
          {t("contains")}
        </SelectItem>
        <SelectItem key="does not contain" value="does not contain">
          {t("does not contain")}
        </SelectItem>
        <SelectItem key="does not match" value="does not match">
          {t("does not match")}
        </SelectItem>
      </Select>
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder={t("value")}
          value={triggerValue.value}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, value })
          }
        />
      </div>
    </React.Fragment>
  );
}
