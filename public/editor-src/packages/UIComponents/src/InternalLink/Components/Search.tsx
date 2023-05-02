import classNames from "classnames";
import React from "react";
import { EditorIcon } from "../../EditorIcon";
import { IconsName } from "../../EditorIcon/types";
import { t } from "../../utils/i18n";
import { SearchProps } from "./types";

export const Search: React.FC<SearchProps> = ({ isLoading, onChange }) => {
  const spinnerClassName = classNames("brz-ed-control__internalLink__spinner", {
    "brz-ed-control__internalLink__spinner--hidden": !isLoading,
    "brz-ed-animated--spin": isLoading
  });

  return (
    <div className="brz-ed-control__internalLink__search">
      <input
        className="brz-input"
        placeholder={t("Type to Search ...")}
        autoFocus
        spellCheck={false}
        onChange={onChange && ((e): void => onChange(e.target.value))}
      />
      <EditorIcon icon={IconsName.Circle2} className={spinnerClassName} />
    </div>
  );
};
