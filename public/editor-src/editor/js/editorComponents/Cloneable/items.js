import classnames from "classnames";
import React from "react";
import ContextMenu, { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import { ScrollMotion } from "visual/component/ScrollMotions";
import Sortable from "visual/component/Sortable";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import { attachRefs } from "visual/utils/react";
import contextMenuConfig from "./contextMenuChild";
import contextMenuExtendConfigFn from "./contextMenuExtend";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Cloneable.Items";
  }

  static defaultProps = {
    blockType: "div",
    containerClassName: "",
    itemClassName: "",
    minItems: 0,
    maxItems: 9999,
    toolbarExtend: null,
    meta: {},
    itemProps: {},
    motion: undefined
  };

  getItemProps(itemData, itemIndex, items) {
    const cloneRemoveConfig = {
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
            onChange: (v) => {
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
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          devices: "desktop",
          position: 200,
          roles: ["admin"],
          onClick: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          config: { icon: "nc-trash", title: t("Delete"), reverseTheme: true },
          devices: "desktop",
          position: 250,
          roles: ["admin"],
          onClick: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      ...this.props.itemProps,
      meta: this.props.meta,
      toolbarExtend
    };
  }

  // Div
  renderItemsContainerDiv(items, sortableRef, sortableAttr) {
    const { motion, containerClassName, containerRef, renderContext } =
      this.props;

    if (isView(renderContext)) {
      return <ScrollMotion options={motion}>{items}</ScrollMotion>;
    }

    return (
      <ScrollMotion options={motion}>
        {(scrollMotionRef, scrollMotionAttr) => (
          <div
            {...sortableAttr}
            {...scrollMotionAttr?.options}
            ref={(v) => {
              attachRefs(v, [containerRef, sortableRef, scrollMotionRef]);
            }}
            className={classnames(containerClassName, scrollMotionAttr?.class)}
          >
            {items}
          </div>
        )}
      </ScrollMotion>
    );
  }

  // List
  renderItemsContainerList(items, sortableRef, sortableAttr) {
    const { motion, containerClassName, containerRef } = this.props;

    return (
      <ScrollMotion options={motion}>
        {(scrollMotionRef, scrollMotionAttr) => (
          <ul
            {...sortableAttr}
            {...scrollMotionAttr?.options}
            ref={(v) => {
              attachRefs(v, [containerRef, sortableRef, scrollMotionRef]);
            }}
            className={classnames(
              "brz-ul brz-list",
              containerClassName,
              scrollMotionAttr?.class
            )}
          >
            {items}
          </ul>
        )}
      </ScrollMotion>
    );
  }

  renderItemsContainer(items) {
    const { blockType, onSortableStart, onSortableEnd } = this.props;

    return (
      <Sortable
        path={this.getId()}
        type="cloneable"
        acceptElements={null}
        onStart={onSortableStart}
        onEnd={onSortableEnd}
      >
        {(sortableRef, sortableAttr) => {
          return blockType === "div"
            ? this.renderItemsContainerDiv(items, sortableRef, sortableAttr)
            : this.renderItemsContainerList(items, sortableRef, sortableAttr);
        }}
      </Sortable>
    );
  }

  renderItemWrapperDiv(item, itemKey, itemIndex) {
    const {
      renderContext,
      itemClassName,
      meta: { inIconText }
    } = this.props;
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    let content;

    const getContent = (ref) => (
      <SortableElement key={itemKey} type="shortcode">
        {isEditor(renderContext) ? (
          <div className={itemClassName} id={itemKey} ref={ref}>
            {item}
          </div>
        ) : (
          item
        )}
      </SortableElement>
    );

    if (!inIconText) {
      const shortcutsTypes = [
        "duplicate",
        "copy",
        "paste",
        "pasteStyles",
        "delete",
        "showToolbar"
      ];

      content = (
        <ContextMenuExtend
          key={itemKey}
          {...this.makeContextMenuProps(contextMenuExtendConfig)}
        >
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            {({ ref }) => (
              <HotKeys
                shortcutsTypes={shortcutsTypes}
                id={itemKey}
                onKeyDown={this.handleKeyDown}
              >
                {getContent(ref)}
              </HotKeys>
            )}
          </ContextMenu>
        </ContextMenuExtend>
      );
    }

    return content ?? getContent(null);
  }

  renderItemWrapperList(item, itemKey, itemIndex) {
    const {
      itemClassName,
      meta: { inIconText }
    } = this.props;

    const className = classnames("brz-li brz-list__item", itemClassName);
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const getContent = (ref) => (
      <SortableElement type="shortcode">
        <li key={itemKey} className={className} ref={ref}>
          {item}
        </li>
      </SortableElement>
    );

    if (!inIconText) {
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
          {...this.makeContextMenuProps(contextMenuExtendConfig)}
        >
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            {({ ref }) => (
              <HotKeys
                shortcutsTypes={shortcutsTypes}
                id={itemKey}
                onKeyDown={this.handleKeyDown}
              >
                {getContent(ref)}
              </HotKeys>
            )}
          </ContextMenu>
        </ContextMenuExtend>
      );
    }

    return getContent(null);
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData, items) {
    return this.props.blockType === "div"
      ? this.renderItemWrapperDiv(item, itemKey, itemIndex, itemData, items)
      : this.renderItemWrapperList(item, itemKey, itemIndex, itemData, items);
  }
}

export default Items;
