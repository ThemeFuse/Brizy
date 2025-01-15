import classnames from "classnames";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import { Config } from "visual/global/Config/types";
import { useConfig } from "visual/global/hooks";
import { updateUI } from "visual/redux/actions2";
import { currentLanguageSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { getLanguagesChoices } from "visual/utils/multilanguages";

export interface Props {
  label: string;
  className?: string;
}

export const Languages = (props: Props): ReactElement => {
  const currentLanguage = useSelector(currentLanguageSelector) ?? "default";
  const dispatch = useDispatch();
  const config = useConfig();

  const { label, className: _className } = props;
  const className = classnames(
    "brz-ed-sidebar-bottom__option",
    "brz-ed-sidebar__wp-template",
    _className
  );

  const languageChoices = useMemo(
    () => getLanguagesChoices(config as Config),
    [config]
  );

  const renderOptions = useMemo(() => {
    const languageOptions = [
      { value: "default", title: t("Default") },
      ...languageChoices
    ];

    return languageOptions.map((item, index) => (
      <SelectItem key={index} value={item.value}>
        {item.title}
      </SelectItem>
    ));
  }, [languageChoices]);

  const handleChangeLanguage = useCallback(
    (language: string) => {
      dispatch(updateUI("currentLanguage", language));
    },
    [dispatch]
  );

  return (
    <div className={className}>
      <div className="brz-ed-option__label">{label}</div>
      <Select
        defaultValue={currentLanguage}
        className="brz-control__select--dark"
        maxItems="6"
        itemHeight="30"
        onChange={handleChangeLanguage}
      >
        {renderOptions}
      </Select>
    </div>
  );
};
