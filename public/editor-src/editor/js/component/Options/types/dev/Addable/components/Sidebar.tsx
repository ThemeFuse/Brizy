import { Sidebar as _Sidebar } from "@brizy/builder-ui-components";
import { LegacyScrollBar } from "@brizy/builder-ui-components/src/components/Brizy/UI/LegacyScrollbar";
import classNames from "classnames";
import React from "react";
import { createPortal } from "react-dom";
import { Inline } from "visual/component/Brizy-ui/Inline";
import { TypographyText } from "visual/component/Brizy-ui/Typography";
import ClickOutside from "visual/component/ClickOutside";
import { Icon } from "visual/component/Controls/RightSidebarTabs/Icon";
import {
  alignIcon,
  alignTitle
} from "visual/component/Controls/RightSidebarTabs/utils";
import EditorIcon from "visual/component/EditorIcon";
import { useTranslation } from "visual/providers/I18nProvider";
import type {
  SidebarContentProps,
  SidebarHeadProps,
  SidebarProps
} from "../types";
import { clickExceptions } from "../utils";

export function Sidebar({
  renderNode,
  isOpen,
  children,
  onAlign,
  align,
  onAddGroup,
  onClickOutside,
  sidebarHeadTitle,
  addNewGroupTitle,
  className
}: SidebarProps) {
  const sidebarClassName = classNames("brz-ed-sidebar__addable", className, {
    "brz-ed-sidebar__addable--align-left": align === "left"
  });

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
                    sidebarHeadTitle={sidebarHeadTitle}
                  />
                  <SidebarContent
                    onAddGroup={onAddGroup}
                    addNewGroupTitle={addNewGroupTitle}
                  >
                    {children}
                  </SidebarContent>
                </_Sidebar>
              </div>
            );
          }}
        </ClickOutside>,
        renderNode
      )
    : null;
}

function SidebarHead({ align, onAlign, sidebarHeadTitle }: SidebarHeadProps) {
  const { t } = useTranslation();

  return (
    <div className="brz-ed-sidebar__addable__head">
      <Inline align="between" alignY="center">
        <TypographyText color="white" size="middle">
          {sidebarHeadTitle ?? t("Addable Widgets")}
        </TypographyText>
        {onAlign && (
          <TypographyText color="white" size="middle">
            <Icon
              icon={alignIcon(align)}
              title={alignTitle(align)}
              onClick={onAlign}
            />
          </TypographyText>
        )}
      </Inline>
    </div>
  );
}

function SidebarContent({
  children,
  onAddGroup,
  addNewGroupTitle
}: SidebarContentProps) {
  const { t } = useTranslation();
  return (
    <div className="brz-ed-addable__wrapper">
      <LegacyScrollBar theme="dark">
        <div className="brz-ed-addable__items">{children}</div>
      </LegacyScrollBar>
      <button className="brz-ed-addable__add-new" onClick={onAddGroup}>
        <EditorIcon icon="nc-plus2" />
        {addNewGroupTitle ?? t("Add New Widget")}
      </button>
    </div>
  );
}
