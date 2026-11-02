import React, { type ReactElement } from "react";
import { Tab } from "./PromptPage/Tab";
import type { TabType } from "./PromptPage/types";

export interface Props {
  onClose: VoidFunction;
  tabs: TabType[];
}

export const Header = ({ tabs, onClose }: Props): ReactElement => {
  return (
    <div className="brz-ed-popup-header">
      {tabs.map((tab) => (
        <Tab key={tab.id} {...tab} onClose={onClose} />
      ))}
    </div>
  );
};
