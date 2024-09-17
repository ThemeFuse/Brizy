import classNames from "classnames";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { FCC } from "visual/utils/react/types";
import { ItemProps as Props } from "./types";

export const TabItem: FCC<Props> = ({ icon, title, active, onClick }) => {
  const _className = classNames("brz-ed-popup-tab-item", { active });

  return (
    <div className={_className} onClick={onClick}>
      <div className="brz-ed-popup-tab-icon">
        <EditorIcon icon={icon} />
      </div>
      <div className="brz-ed-popup-tab-name" title={title}>
        {title}
      </div>
    </div>
  );
};
