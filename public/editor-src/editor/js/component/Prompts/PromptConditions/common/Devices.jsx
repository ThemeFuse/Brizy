import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function Devices(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue}
        onChange={(value) => onChange(value)}
      >
        <SelectItem key="desktop" value="desktop" title={t("Desktop")}>
          {t("Desktop")}
        </SelectItem>
        <SelectItem key="tablet" value="tablet" title={t("Tablet")}>
          {t("Tablet")}
        </SelectItem>
        <SelectItem key="mobile" value="mobile" title={t("Mobile")}>
          {t("Mobile")}
        </SelectItem>
      </Select>
    </React.Fragment>
  );
}
