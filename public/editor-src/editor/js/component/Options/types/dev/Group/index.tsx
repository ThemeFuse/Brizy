import React, { ReactElement } from "react";
import { Group as Control } from "visual/component/Controls/Group";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { WithClassName } from "visual/types/attributes";
import { FCP } from "visual/utils/react/types";

export type Props = OptionProps<undefined> &
  WithClassName & {
    options: ToolbarItemType[];
  };

export const Group: FCP<Props, ReactElement> = ({
  className,
  options,
  toolbar
}) => {
  return (
    <Control className={className}>
      <Options wrapOptions={false} data={options} toolbar={toolbar} />
    </Control>
  );
};
