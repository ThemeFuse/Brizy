import classnames from "classnames";
import React, { Key, ReactElement, ReactNode } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Fixed from "visual/component/Prompts/Fixed";

export interface Tab<T extends Key> {
  id: T;
  title: string;
  icon: string;
}

export interface Props<T extends Key> {
  tabs: Tab<T>[];
  onChange: (t: T) => void;
  value: T;
  onClose: VoidFunction;
  children?: ReactNode;
}

export function Tabs<T extends Key>({
  onClose,
  children,
  value,
  tabs,
  onChange
}: Props<T>): ReactElement {
  return (
    <Fixed
      className="brz-ed-popup-integrations"
      opened={true}
      onClose={onClose}
    >
      <div className="brz-ed-popup-wrapper">
        <div className="brz-ed-popup-header">
          <div className="brz-ed-popup-header__tabs">
            {tabs.map((tab) => {
              const { id, icon, title } = tab;
              const className = classnames("brz-ed-popup-tab-item", {
                active: id === value
              });

              return (
                <div
                  key={id}
                  className={className}
                  onClick={() => onChange(id)}
                >
                  <div className="brz-ed-popup-tab-icon">
                    <EditorIcon icon={icon} />
                  </div>
                  <div className="brz-ed-popup-tab-name">{title}</div>
                </div>
              );
            })}
          </div>
          <div className="brz-ed-popup-btn-close" onClick={onClose} />
        </div>
        <div className="brz-ed-popup-content">{children}</div>
      </div>
    </Fixed>
  );
}
