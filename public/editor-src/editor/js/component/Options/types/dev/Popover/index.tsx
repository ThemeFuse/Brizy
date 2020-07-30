import React, { ComponentProps, FC, ReactElement } from "react";
import {
  Popover as Control,
  Props as ControlProps
} from "visual/component/Controls/Popover";
import * as Option from "visual/component/Options/Type";
import Options, { filterOptionsData } from "visual/component/Options";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { OptionDefinition } from "visual/component/Options/Type";
import { Html } from "./triggers/Html";
import { Icon } from "./triggers/Icon";

type Icon = string | ComponentProps<typeof Html>;

export type Config = {
  placement?: ControlProps["placement"];
  size?: ControlProps["size"];
  icon?: Icon;
  title: string;
};

export type Props = Option.Props<undefined, {}> &
  WithConfig<Config> &
  WithClassName & {
    options: OptionDefinition[];
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
  Option.SelfFilter<Props> = ({ className, config, options, toolbar }) => {
  return (
    <Control
      title={config?.title}
      trigger={getTrigger(config?.icon ?? "nc-cog")}
      className={className}
      placement={config?.placement ?? "top-center"}
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
  );
};

const getModel: Option.GetModel<undefined> = () => undefined;

Popover.getModel = getModel;

Popover.shouldOptionBeFiltered = ({ options }): boolean =>
  filterOptionsData(options ?? []).length === 0;
