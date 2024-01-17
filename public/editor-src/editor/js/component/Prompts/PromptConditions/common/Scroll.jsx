import React from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { t } from "visual/utils/i18n";

export default function Scroll(props) {
  const { value: triggerValue = "", onChange = () => {} } = props;

  return (
    <React.Fragment>
      <Select
        className="brz-control__select--light"
        itemHeight={30}
        defaultValue={triggerValue.value}
        onChange={(value) => onChange({ ...triggerValue, value })}
      >
        <SelectItem key="down" value="down" title={t("Down")}>
          {t("Down")}
        </SelectItem>
        <SelectItem key="up" value="up" title={t("Up")}>
          {t("Up")}
        </SelectItem>
        <SelectItem key="toElement" value="toElement" title={t("To element")}>
          {t("To element")}
        </SelectItem>
      </Select>
      {triggerValue.value === "down" && (
        <div className="brz-control__select">
          <input
            className="brz-input"
            type="number"
            placeholder={t("% of page height")}
            value={triggerValue.within}
            onChange={({ target: { value: within } }) =>
              onChange({ ...triggerValue, within })
            }
          />
        </div>
      )}
      {triggerValue.value === "toElement" && (
        <div className="brz-control__select">
          <input
            className="brz-input"
            type="text"
            placeholder={t(".my-class")}
            value={triggerValue.toElement || ""}
            onChange={({ target: { value: toElement } }) =>
              onChange({
                ...triggerValue,
                toElement
              })
            }
          />
        </div>
      )}
    </React.Fragment>
  );
}
