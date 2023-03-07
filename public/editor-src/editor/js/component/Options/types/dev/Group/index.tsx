import React, { FC } from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import Options from "visual/component/Options";
import { Group as Control } from "visual/component/Controls/Group";
import { WithClassName } from "visual/utils/options/attributes";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";

export type Props = OptionProps<undefined> &
  WithClassName & {
    options: ToolbarItemType[];
  };

export const Group: FC<Props> = ({ className, options, toolbar }) => {
  return (
    <Control className={className}>
      <Options wrapOptions={false} data={options} toolbar={toolbar} />
    </Control>
  );
};
