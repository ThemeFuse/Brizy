import React from "react";
import { ReactElement } from "react";
import { t } from "../../utils/i18n";
import { SelectItemProps } from "./types";

export const SelectItem = ({
  title,
  onClick
}: SelectItemProps): ReactElement => {
  return (
    <li
      className="brz-ed-control__internalLink__option"
      title={title}
      onClick={onClick}
    >
      <span className="brz-ed-control__internalLink__option-text">{title}</span>
    </li>
  );
};

export const SelectItemNoResults = (): ReactElement => {
  return (
    <li className="brz-ed-control__multiSelect2__option brz-ed-control__multiSelect2__option--disabled">
      {t("No results")}
    </li>
  );
};
