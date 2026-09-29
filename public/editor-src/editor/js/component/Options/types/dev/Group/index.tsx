import React, { type ReactElement } from "react";
import { Group as Control } from "visual/component/Controls/Group";
import Options from "visual/component/Options";
import type { Props as OptionProps } from "visual/component/Options/Type";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { usePro } from "visual/global/hooks";
import { useConfig } from "visual/providers/ConfigProvider";
import type { WithClassName } from "visual/types/attributes";
import type { FCP } from "visual/utils/react/types";

export type Props = OptionProps<undefined> &
  WithClassName & {
    options: ToolbarItemType[];
  };

export const Group: FCP<Props, ReactElement> = ({
  className,
  options,
  label,
  toolbar
}) => {
  const config = useConfig();

  const pro = usePro();

  return (
    <>
      {label}
      <Control className={className}>
        <Options
          wrapOptions={false}
          data={options}
          toolbar={toolbar}
          isPro={pro}
          upgradeToPro={config?.urls?.upgradeToPro}
        />
      </Control>
    </>
  );
};
