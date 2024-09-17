import classNames from "classnames";
import React from "react";
import { ReactElement } from "react";
import { t } from "visual/utils/i18n";
import { SelectItemProps } from "./types";

export const SelectItem = ({
  title,
  onClick,
  className
}: SelectItemProps): ReactElement => {
  const _classNames = classNames(
    "brz-ed-control__internalLink__option",
    className
  );
  return (
    <li className={_classNames} title={title} onClick={onClick}>
      <span className="brz-ed-control__internalLink__option-text">{title}</span>
    </li>
  );
};

export const SelectItemNoResults = (): ReactElement => {
  const noResult = t("No results");
  return (
    <span
      title={noResult}
      className="brz-ed-control__multiSelect2__option brz-ed-control__multiSelect2__option-text brz-ed-control__multiSelect2__option--disabled"
    >
      {noResult}
    </span>
  );
};
