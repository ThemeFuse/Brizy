import classnames from "classnames";
import React, { FC, useEffect } from "react";
import { Popover as Control } from "visual/component/Controls/Popover";
import { ToolbarItem } from "visual/component/Controls/Popover/types";
import Options from "visual/component/Options";
import { ToolbarItems } from "./ToolbarItem";
import { Props } from "./types";
import { getTrigger } from "./utils";

export const Popover: FC<Props> = ({
  className,
  config,
  options,
  toolbar,
  id
}) => {
  const onOpenDirect = config?.onOpenDirect ?? false;

  useEffect(() => {
    if (onOpenDirect) {
      toolbar?.setItemsRenderer((items: ToolbarItem[]) => {
        const toolbarItem = items.find(
          ({ id: toolbarId }: { id: string }) => id === toolbarId
        );
        const className = classnames("brz-ed-popover__inner", {
          [`brz-ed-tooltip--${toolbarItem?.size}`]: toolbarItem?.size
        });
        return (
          <ToolbarItems className={className} options={toolbarItem?.options} />
        );
      });
    }
  }, [onOpenDirect, toolbar, id]);

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
