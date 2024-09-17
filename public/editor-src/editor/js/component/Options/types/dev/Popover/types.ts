import { ComponentProps } from "react";
import { Props as ControlProps } from "visual/component/Controls/Popover/types";
import { Option } from "visual/component/LeftSidebar/options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { Html } from "visual/component/Options/types/dev/Popover/triggers/Html";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { WithClassName, WithConfig } from "visual/types/attributes";

export type Icon = string | ComponentProps<typeof Html>;

export type Config = {
  placement?: ControlProps["placement"];
  size?: ControlProps["size"];
  icon?: Icon;
  title: string;
  onOpenDirect?: boolean;
};

export type Props = OptionProps<undefined> &
  WithConfig<Config> &
  WithClassName & {
    options?: ToolbarItemType[];
    id?: string;
  };

export interface ToolbarItemProps {
  className: string;
  options?: Option;
}
export interface ContentProps {
  options?: Option;
}
