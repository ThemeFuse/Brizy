import React, { ReactElement } from "react";
import Toolbar from "visual/component/Toolbar";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

type Props = {
  toolbarConfig: PortalToolbarProps;
  value: string;
  onChange: (v: string) => void;
};

export const SearchFilters = ({
  toolbarConfig,
  value = "",
  onChange
}: Props): ReactElement => {
  return IS_EDITOR ? (
    <Toolbar {...toolbarConfig}>
      <div className="brz-filters__option brz-filters__search-option">
        <TextEditor
          className="brz-filters__search"
          value={value}
          onChange={onChange}
        />
        <ThemeIcon
          name="search"
          type="editor"
          className="brz-filters__search--icon"
        />
      </div>
    </Toolbar>
  ) : (
    <div className="brz-filters__option brz-filters__search-option">
      <input
        type="text"
        className={"brz-filters__search"}
        placeholder={value}
      />
      <ThemeIcon
        name="search"
        type="editor"
        className="brz-filters__search--icon"
      />
    </div>
  );
};
