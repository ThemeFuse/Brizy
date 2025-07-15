import { Sidebar } from "@brizy/builder-ui-components";
import classNames from "classnames";
import React, { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { TooltipIcon } from "visual/component/Controls/LeftSidebar/AddElements";
import {
  alignIcon,
  alignTitle
} from "visual/component/Controls/RightSidebarTabs/utils";
import { leftSidebarSelector } from "visual/redux/selectors-new";
import { SidebarAlign } from "visual/redux/types";
import { makeBzelmAttr } from "visual/utils/i18n/attribute";
import { SidebarExtraControls } from "../AddElements/SidebarExtraControls";
import {
  SidebarBodyProps,
  SidebarHeadProps,
  SidebarModes,
  SidebarProps
} from "./types";

export function SidebarWrapper({ options }: SidebarProps): JSX.Element {
  const [align, setAlign] = useState<SidebarAlign>("left");
  const [leftSidebarMode, setLeftSidebarMode] = useState<SidebarModes | null>(
    null
  );

  const { drawerContentType } = useSelector(leftSidebarSelector);
  const handleAlign = useCallback(
    () => setAlign(align === "left" ? "right" : "left"),
    [align]
  );

  const option = useMemo(
    () => options.find((option) => option.id === drawerContentType),
    [drawerContentType, options]
  );

  const { drawerTitle, drawerComponent: Component } = option ?? {};

  const componentExtraProps = {
    isEditMode: leftSidebarMode === SidebarModes.EDIT,
    isPinMode: leftSidebarMode === SidebarModes.PIN
  };
  const bodyAttr =
    drawerContentType === "addElements"
      ? makeBzelmAttr("add-elements")
      : undefined;

  return (
    <Sidebar alignment={align} isOpen={!!option}>
      <SidebarHead title={drawerTitle} align={align} onAlign={handleAlign}>
        {drawerContentType === "addElements" && (
          <SidebarExtraControls
            sidebarMode={leftSidebarMode}
            setSidebarMode={setLeftSidebarMode}
          />
        )}
      </SidebarHead>
      <SidebarBody attr={bodyAttr}>
        {Component && <Component {...componentExtraProps} />}
      </SidebarBody>
    </Sidebar>
  );
}

export function SidebarBody({ children, className, attr }: SidebarBodyProps) {
  return (
    <div
      {...attr}
      className={classNames(
        "brz-ed-sidebar-drawer__body",
        attr?.className,
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarHead({
  align,
  onAlign,
  title,
  children
}: SidebarHeadProps) {
  return (
    <div className="brz-ed-sidebar-drawer__head">
      <h3 className="brz-ed-sidebar-drawer__head__title">{title}</h3>
      <div className="brz-ed-sidebar-drawer__head__controls">
        {children}
        {onAlign && (
          <TooltipIcon
            icon={alignIcon(align)}
            overlayText={alignTitle(align)}
            onClick={onAlign}
          />
        )}
      </div>
    </div>
  );
}
