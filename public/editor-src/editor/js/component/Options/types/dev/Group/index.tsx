import React, { ReactElement } from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import Options from "visual/component/Options";
import { Group as Control } from "visual/component/Controls/Group";
import { WithClassName } from "visual/utils/options/attributes";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
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
