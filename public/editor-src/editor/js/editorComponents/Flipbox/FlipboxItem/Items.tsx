import React, { ReactNode } from "react";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import { ElementModel } from "visual/component/Elements/Types";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import SortableEmpty from "visual/component/Sortable/SortableEmpty";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { NewToolbarConfig } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import contextMenuExtendConfigFn from "./contextMenu";

class FlipboxItemItems extends EditorArrayComponent {
  static get componentId(): ElementTypes.FlipboxItemItems {
    return ElementTypes.FlipboxItemItems;
  }

  // @ts-expect-error unused variable
  getItemProps(_, itemIndex: number): Record<string, unknown> {
    const cloneRemoveConfig = {
      getItems: () => {
        return [
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
            onClick: () => {
              hideToolbar();
              this.removeItem(itemIndex);
            }
          }
        ];
      }
    };

    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      cloneRemoveConfig as NewToolbarConfig<ElementModel>
    );

    return {
      meta: this.props.meta,
      toolbarExtend
    };
  }

  renderItemsContainer(items: ElementModel[]): ReactNode {
    if (IS_PREVIEW) {
      return items;
    }

    const { isActive } = this.props;

    if (items.length === 0) {
      return (
        <SortableEmpty
          path={this.getId()}
          type="column"
          acceptElements="*"
          disabled={!isActive}
        />
      );
    }

    return (
      <Sortable
        path={this.getId()}
        type="column"
        acceptElements="*"
        disabled={!isActive}
      >
        <div className="brz-flipbox-sortable-wrapper">{items}</div>
      </Sortable>
    );
  }

  renderItemWrapper(
    item: ElementModel,
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
      "showSidebarStyling",
      "showSidebarAdvanced"
    ];

    return (
      <ContextMenuExtend
        key={itemKey}
        // @ts-expect-error type Value is not assignable to ElementModel ( need to EditorArrayComponent to .ts to send generic )
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <HotKeys
          shortcutsTypes={shortcutsTypes}
          id={itemKey}
          onKeyDown={this.handleKeyDown}
        >
          {item}
        </HotKeys>
      </ContextMenuExtend>
    );
  }
}

export default FlipboxItemItems;
