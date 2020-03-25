import React from "react";
import Option from "visual/component/Options/Option";
import { OptionDefinition } from "visual/component/Options/Type";

type ToolbarItemProps = {
  data: OptionDefinition;
  toolbar: object;
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
