import React, { ReactElement, useCallback } from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import { Tabs, TabType } from "./types";

interface Props extends TabType {
  onClick?: (id: Tabs) => void;
  onClose: VoidFunction;
}

export const Tab = ({
  id,
  active,
  icon,
  title,
  onClick: _onClick,
  onClose
}: Props): ReactElement => {
  const onClick = useCallback(() => _onClick?.(id), [_onClick, id]);

  return (
    <>
      <div
        onClick={onClick}
        className={classnames("brz-ed-popup-tab-item", {
          active: active
        })}
      >
        <div className="brz-ed-popup-tab-icon">
          <EditorIcon icon={icon} />
        </div>
        <div className="brz-ed-popup-tab-name" title={title}>{title}</div>
      </div>
      <div className="brz-ed-popup-btn-close" onClick={onClose} />
    </>
  );
};
