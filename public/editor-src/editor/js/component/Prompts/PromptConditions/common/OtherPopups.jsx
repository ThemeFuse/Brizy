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
        <SelectItem key="was" value="was" title={t("was shown")}>
          {t("was shown")}
        </SelectItem>
        <SelectItem key="was not" value="was not" title={t("was not shown")}>
          {t("was not shown")}
        </SelectItem>
      </Select>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={(value) => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="page" value="page" title={t("on the same page")}>
          {t("on the same page")}
        </SelectItem>
        <SelectItem
          key="session"
          value="session"
          title={t("during the session")}
        >
          {t("during the session")}
        </SelectItem>
      </Select>
    </React.Fragment>
  );
}
