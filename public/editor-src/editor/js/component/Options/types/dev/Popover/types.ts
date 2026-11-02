import type { ComponentProps } from "react";
import type { Props as ControlProps } from "visual/component/Controls/Popover/types";
import type { Option } from "visual/component/LeftSidebar/options";
import type { Props as OptionProps } from "visual/component/Options/Type";
import type { Html } from "visual/component/Options/types/dev/Popover/triggers/Html";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { WithClassName, WithConfig } from "visual/types/attributes";

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
