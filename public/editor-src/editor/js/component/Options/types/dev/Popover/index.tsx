import React, { ComponentProps, FC, ReactElement } from "react";
import {
  Popover as Control,
  Props as ControlProps
} from "visual/component/Controls/Popover";
import * as Option from "visual/component/Options/Type";
import Options from "visual/component/Options";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Html } from "./triggers/Html";
import { Icon } from "./triggers/Icon";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { withOptions } from "visual/component/Options/utils/filters";

type Icon = string | ComponentProps<typeof Html>;

export type Config = {
  placement?: ControlProps["placement"];
  size?: ControlProps["size"];
  icon?: Icon;
  title: string;
};

export type Props = Option.Props<undefined> &
  WithConfig<Config> &
  WithClassName & {
    options?: ToolbarItemType[];
  };

export const getTrigger = (t: Icon): ReactElement => {
  switch (typeof t) {
    case "object":
      return <Html {...t} />;
    case "string":
      return <Icon icon={t} />;
  }
};

export const Popover: FC<Props> &
  Option.OptionType<undefined> &
  Option.SelfFilter<"popover-dev"> = ({
  className,
  config,
  options,
  toolbar
}) => {
  return options?.length ? (
    <Control
      title={config?.title}
      trigger={getTrigger(config?.icon ?? "nc-cog")}
      className={className}
      placement={config?.placement ?? "top"}
      size={config?.size ?? "medium"}
      toolbar={toolbar}
      clickOutsideExceptions={[
        ".brz-ed-fixed",
        ...(TARGET === "WP"
          ? [
              ".media-modal", // class of the WP media modal
              ".media-modal-backdrop"
            ]
          : []),
        ...(toolbar ? [".brz-ed-sidebar__right"] : [])
      ]}
    >
      <Options wrapOptions={false} data={options} toolbar={toolbar} />
    </Control>
  ) : null;
};

const getModel: Option.FromElementModel<undefined> = () => undefined;
const getElementModel: Option.ToElementModel<undefined> = () => ({});

Popover.fromElementModel = getModel;
Popover.toElementModel = getElementModel;

// @ts-expect-error: Variable 'defaultValue' implicitly has an 'any' type.
Popover.defaultValue = undefined;

Popover.filter = withOptions;

Popover.reduce = (fn, t0, item) => item.options?.reduce(fn, t0) ?? t0;

Popover.map = (fn, item) => ({ ...item, options: item.options?.map(fn) });
