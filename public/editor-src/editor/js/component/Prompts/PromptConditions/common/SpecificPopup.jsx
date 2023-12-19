import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function SpecificPopup(props) {
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
      <div className="brz-control__select">
        <input
          className="brz-input"
          type="text"
          placeholder={t("#popup-id")}
          value={triggerValue.value}
          onChange={({ target: { value } }) =>
            onChange({ ...triggerValue, value })
          }
        />
      </div>
    </React.Fragment>
  );
}
