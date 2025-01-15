import classnames from "classnames";
import React, { ReactElement, useEffect, useMemo } from "react";
import { Popover as Control } from "visual/component/Controls/Popover";
import { ToolbarItem } from "visual/component/Controls/Popover/types";
import Options from "visual/component/Options";
import { targetExceptions } from "visual/component/Options/constants";
import { useConfig, usePro } from "visual/global/hooks";
import { FCP } from "visual/utils/react/types";
import { ToolbarItems } from "./ToolbarItem";
import { Props } from "./types";
import { getTrigger } from "./utils";

export const Popover: FCP<Props, ReactElement | null> = ({
  className,
  config,
  options,
  toolbar,
  id
}) => {
  const onOpenDirect = config?.onOpenDirect ?? false;
  const toolbarExceptions = useMemo(
    () => (toolbar ? [".brz-ed-sidebar__right"] : []),
    [toolbar]
  );
  const clickOutsideExceptions = useMemo(
    () => [".brz-ed-fixed", ...targetExceptions, ...toolbarExceptions],
    [toolbarExceptions]
  );

  useEffect(() => {
    if (onOpenDirect) {
      toolbar?.setItemsRenderer((items: Array<ToolbarItem>) => {
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

  const cnfg = useConfig();

  const pro = usePro();

  return options?.length ? (
    <Control
      title={config?.title}
      trigger={getTrigger(config?.icon ?? "nc-cog")}
      className={className}
      placement={config?.placement ?? "top"}
      size={config?.size ?? "medium"}
      toolbar={toolbar}
      clickOutsideExceptions={clickOutsideExceptions}
    >
      <Options
        wrapOptions={false}
        data={options}
        toolbar={toolbar}
        isPro={pro}
        upgradeToPro={cnfg?.urls?.upgradeToPro}
      />
    </Control>
  ) : null;
};
