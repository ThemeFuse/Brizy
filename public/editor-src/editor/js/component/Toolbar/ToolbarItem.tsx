import React from "react";
import Option from "visual/component/Options/Option";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";

type ToolbarItemProps = {
  data: OptionDefinition;
  toolbar: ToolbarItemsInstance;
};

export const ToolbarItem: React.FC<ToolbarItemProps> = ({ data, toolbar }) => {
  return (
    <div className="brz-ed-toolbar__item">
      <Option
        className="brz-ed-toolbar__option"
        data={data}
        toolbar={toolbar}
        location="toolbar"
      />
    </div>
  );
};
