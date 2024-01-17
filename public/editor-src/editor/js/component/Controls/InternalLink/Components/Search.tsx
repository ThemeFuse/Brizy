import classNames from "classnames";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { SearchProps } from "./types";

export const Search: React.FC<SearchProps> = ({ loading, onChange }) => {
  const spinnerClassName = classNames("brz-ed-control__internalLink__spinner", {
    "brz-invisible": !loading,
    "brz-ed-animated--spin": loading
  });

  return (
    <div className="brz-ed-control__internalLink__search">
      <input
        className="brz-input"
        placeholder={t("Type to Search ...")}
        autoFocus={true}
        spellCheck={false}
        onChange={onChange && ((e): void => onChange(e.target.value))}
      />
      <EditorIcon icon="nc-circle-02" className={spinnerClassName} />
    </div>
  );
};
