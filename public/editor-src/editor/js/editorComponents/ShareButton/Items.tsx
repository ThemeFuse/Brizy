import React, { ReactNode } from "react";
import ContextMenu, { ContextMenuExtend } from "visual/component/ContextMenu";
import { ElementModel } from "visual/component/Elements/Types";
import HotKeys from "visual/component/HotKeys";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import { NewToolbarConfig } from "../EditorComponent/types";
import contextMenuExtendConfigFn from "./ShareButtonItem/contextMenuExtend";
import contextMenuConfig from "./contextMenu";
import { Value } from "./types";

class ShareButtonItems extends EditorArrayComponent {
  static get componentId(): ElementTypes.ShareButtonItemItems {
    return ElementTypes.ShareButtonItemItems;
  }

  getItemProps(
    //@ts-expect-error: Required item
    item: Value,
    itemIndex: number,
    items: Value[]
  ): Record<string, unknown> {
    const { meta } = this.props;

    const cloneRemoveConfig: NewToolbarConfig<ElementModel> = {
      getItems: () => [
        {
          id: "order",
          type: "order",
          devices: "desktop",
          position: 105,
          roles: ["admin"],
          disabled: items.length < 2,
          config: {
            disable:
              itemIndex === 0
                ? "prev"
                : itemIndex === items.length - 1
                  ? "next"
                  : undefined,
            onChange: (v: string) => {
              switch (v) {
                case "prev":
                  this.reorderItem(itemIndex, itemIndex - 1);
                  break;
                case "next":
                  this.reorderItem(itemIndex, itemIndex + 1);
                  break;
              }
            }
          }
        },
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          position: 200,
          onClick: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-trash",
            title: t("Delete"),
            reverseTheme: true
          },
          position: 210,
          disabled: items.length === 1,
          onClick: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };

    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      meta,
      toolbarExtend
    };
  }

  renderItemWrapper(
    item: Value,
    itemKey: string,
    itemIndex: number
  ): ReactNode {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "showSidebarStyling"
    ];

    return (
      <ContextMenuExtend
        key={itemKey}
        // @ts-expect-error type Value is not assignable to ElementModel ( need to EditorArrayComponent to .ts to send generic )
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <HotKeys
            shortcutsTypes={shortcutsTypes}
            id={itemKey}
            onKeyDown={this.handleKeyDown}
          >
            {item}
          </HotKeys>
        </ContextMenu>
      </ContextMenuExtend>
    );
  }
}

export default ShareButtonItems;
