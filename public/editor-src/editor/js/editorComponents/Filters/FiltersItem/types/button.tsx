import React, { ReactElement } from "react";
import Toolbar from "visual/component/Toolbar";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

type Props = {
  btnText: string;
  toolbar: PortalToolbarProps;
  textChange: (v: string) => void;
};

export const ButtonFilters = ({
  btnText,
  toolbar,
  textChange
}: Props): ReactElement => {
  return (
    <Toolbar {...toolbar}>
      <div className="brz-filters__btn-wrapper">
        <button className={"brz-filters__apply"}>
          <TextEditor
            className={"brz-filters__btn-text"}
            value={btnText}
            onChange={textChange}
          />
        </button>
      </div>
    </Toolbar>
  );
};
