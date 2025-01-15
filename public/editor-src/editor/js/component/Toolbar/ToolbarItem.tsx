import React from "react";
import Option from "visual/component/Options/Option";
import { ToolbarItemsInstance } from "visual/component/Toolbar/ToolbarItems";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { useConfig, usePro } from "visual/global/hooks";

type ToolbarItemProps = {
  data: OptionDefinition;
  toolbar: ToolbarItemsInstance;
};

export const ToolbarItem = ({
  data,
  toolbar
}: ToolbarItemProps): JSX.Element => {
  const config = useConfig();

  const pro = usePro();

  return (
    <div className="brz-ed-toolbar__item">
      <Option
        className="brz-ed-toolbar__option"
        data={data}
        toolbar={toolbar}
        location="toolbar"
        isPro={pro}
        upgradeToPro={config?.urls?.upgradeToPro ?? ""}
      />
    </div>
  );
};
