import React, { FC } from "react";
import Options from "visual/component/Options";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";

interface Props {
  items: OptionDefinition[];
}
export const RenderItems: FC<Props> = ({ items }) => (
  <div className="brz-ed-sidebar__main brz-ed-sidebar__right__options">
    <Options
      className="brz-ed-sidebar__right__tabs"
      optionClassName="brz-ed-sidebar__right__option"
      data={items}
      location="rightSidebar"
    />
  </div>
);
