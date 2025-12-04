import { Sidebar as _Sidebar } from "@brizy/builder-ui-components";
import classNames from "classnames";
import React from "react";
import { createPortal } from "react-dom";
import ClickOutside from "visual/component/ClickOutside";
import EditorIcon from "visual/component/EditorIcon";
import {
  SidebarBody,
  SidebarHead
} from "visual/component/LeftSidebar/components/Drawer";
import { Scrollbar } from "visual/component/Scrollbar";
import { useTranslation } from "visual/providers/I18nProvider";
import type { SidebarContentProps, SidebarProps } from "../types";
import { clickExceptions } from "../utils";

export function Sidebar(props: SidebarProps) {
  const { t } = useTranslation();
  const {
    renderNode,
    isOpen,
    children,
    onAlign,
    align,
    onAddGroup,
    onClickOutside,
    sidebarHeadTitle = t("Addable Widgets"),
    addNewGroupTitle = t("Add New Widget"),
    className
  } = props;
  const sidebarClassName = classNames("brz-ed-sidebar__addable", className);

  return renderNode && isOpen
    ? createPortal(
        <ClickOutside
          onClickOutside={onClickOutside}
          exceptions={clickExceptions}
        >
          {({ ref }) => {
            return (
              <div ref={ref}>
                <_Sidebar
                  isOpen={isOpen}
                  alignment={align}
                  className={sidebarClassName}
                >
                  <SidebarHead
                    align={align}
                    onAlign={onAlign}
                    title={sidebarHeadTitle}
                  />
                  <SidebarBody>
                    <SidebarContent
                      onAddGroup={onAddGroup}
                      addNewGroupTitle={addNewGroupTitle}
                    >
                      {children}
                    </SidebarContent>
                  </SidebarBody>
                </_Sidebar>
              </div>
            );
          }}
        </ClickOutside>,
        renderNode
      )
    : null;
}

function SidebarContent(props: SidebarContentProps) {
  const { children, onAddGroup, addNewGroupTitle } = props;

  return (
    <>
      <Scrollbar theme="dark" absolute>
        <div className="brz-ed-addable__items">{children}</div>
      </Scrollbar>
      <button className="brz-ed-addable__add-new" onClick={onAddGroup}>
        <EditorIcon icon="nc-plus2" />
        {addNewGroupTitle}
      </button>
    </>
  );
}
