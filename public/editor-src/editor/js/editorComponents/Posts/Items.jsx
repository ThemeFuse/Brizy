import classnames from "classnames";
import React from "react";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import { TextEditor } from "visual/component/Controls/TextEditor";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { EditorComponentContext } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { IS_WP } from "visual/utils/env";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { getLoopName, stringifyAttributes } from "./utils.common";

export default class Items extends EditorArrayComponent {
  static get componentId() {
    return "Posts.Items";
  }

  static defaultProps = {
    className: "",
    showPagination: false,
    toolbarExtendPagination: {},
    showFilter: false,
    filterStyle: "",
    toolbarExtendFilter: {},
    loopAttributes: {},
    meta: {}
  };

  getItemProps() {
    return {
      meta: this.props.meta
    };
  }

  getLoopAttributesString() {
    return stringifyAttributes(this.props.loopAttributes);
  }

  getLoopTagsAttributesString() {
    return stringifyAttributes(this.props.loopTagsAttributes);
  }

  getLoopItemFilter() {
    const { loopTagsAttributes, showFilter } = this.props;

    if (loopTagsAttributes && showFilter) {
      return makePlaceholder({
        content: "{{brizy_dc_post_terms}}",
        attr: { taxonomy: loopTagsAttributes.tax }
      });
    }

    return undefined;
  }

  handleSortableAcceptElements = (from) => {
    const meta = this.props.meta;

    if (meta.row && meta.row.isInner) {
      if (from.elementType === "column" || from.elementType === "row") {
        return false;
      }

      if (from.elementType === "addable") {
        const addableSubtype = from.elementNode.getAttribute(
          "data-sortable-subtype"
        );

        return addableSubtype !== "row" && addableSubtype !== "columns";
      }
    } else {
      if (from.elementType === "row" || from.elementType === "column") {
        return (
          from.elementNode.querySelector(
            "[data-sortable-type=row][data-sortable-element=true]"
          ) === null // hasn't inner row (thus avoiding level 3 columns)
        );
      }
    }

    return true;
  };

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);
    const keyNames = ["alt+C", "alt+shift+V", "shift+alt+V"];
    const shortcutsTypes = ["copy", "pasteStyles"];

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <HotKeys
          keyNames={keyNames}
          shortcutsTypes={shortcutsTypes}
          id={itemKey}
          onKeyDown={this.handleKeyDown}
        >
          <div
            className="brz-posts__item"
            data-filter={this.getLoopItemFilter()}
          >
            {item}
          </div>
        </HotKeys>
      </ContextMenuExtend>
    );
  }

  renderTagsForEdit() {
    const {
      toolbarExtendFilter,
      filterStyle,
      allTag,
      data,
      handleAllTagChange
    } = this.props;
    const { tags = [] } = data;
    const allTags = [{ name: allTag }, ...tags];
    const listClassName = classnames(
      "brz-ul brz-posts__filter",
      `brz-posts__filter--${filterStyle}`
    );

    return (
      allTags.length > 1 && (
        <div className="brz-posts__filter-wrapper">
          <ul className={listClassName}>
            {allTags.map((tag, index) => {
              const itemClassName = classnames(
                "brz-li brz-posts__filter__item",
                `brz-posts__filter__item--${filterStyle}`,
                { "brz-posts-filter__item--active": index === 0 }
              );

              return (
                <Toolbar key={index} {...toolbarExtendFilter}>
                  <li className={itemClassName}>
                    {tag.name === allTag ? (
                      <TextEditor
                        value={allTag}
                        onChange={handleAllTagChange}
                      />
                    ) : (
                      tag.name
                    )}
                  </li>
                </Toolbar>
              );
            })}
          </ul>
        </div>
      )
    );
  }

  renderPaginationForEdit() {
    return (
      <Toolbar {...this.props.toolbarExtendPagination}>
        <div className="brz-posts__pagination">
          <ul className="page-numbers">
            <li>
              <span className="page-numbers current">1</span>
            </li>
            <li>
              <a className="page-numbers" href="#">
                2
              </a>
            </li>
            <li>
              <a className="page-numbers" href="#">
                3
              </a>
            </li>
            <li>
              <a className="page-numbers" href="#">
                ...
              </a>
            </li>
            <li>
              <a className="page-numbers" href="#">
                10
              </a>
            </li>
            <li>
              <a className="page-numbers" href="#">
                11
              </a>
            </li>
          </ul>
        </div>
      </Toolbar>
    );
  }

  renderForEdit(v) {
    const { className, showFilter, showPagination, data } = this.props;
    const item = super.renderForEdit(v);
    const items = data?.context.map((context) => (
      <EditorComponentContext.Provider
        key={context.dynamicContent.itemId}
        value={context}
      >
        {item}
      </EditorComponentContext.Provider>
    ));

    return (
      <Sortable
        path={this.getId()}
        type="posts"
        acceptElements={this.handleSortableAcceptElements}
      >
        <div className={className}>
          {showFilter && this.renderTagsForEdit()}
          <div className="brz-posts__wrapper">{items}</div>
          {showPagination && this.renderPaginationForEdit()}
        </div>
      </Sortable>
    );
  }

  renderForView(v) {
    return IS_WP ? this.renderForViewWP(v) : this.renderForViewCloud(v);
  }

  renderForViewWP(v) {
    const { type, className, style, showPagination, showFilter } = this.props;
    const item = v.map(this.renderItem);

    const postLoopName = getLoopName(type);
    const loopAttributes = this.getLoopAttributesString();
    const startPlaceholder = makeStartPlaceholder({
      content: `{{${postLoopName}}}`,
      attrStr: loopAttributes
    });
    const endPlaceholder = makeEndPlaceholder({
      content: `{{end_${postLoopName}}}`
    });
    const filterPlaceholder = showFilter
      ? makePlaceholder({
          content: "{{brizy_dc_post_loop_tags}}",
          attrStr: this.getLoopTagsAttributesString()
        })
      : undefined;
    const paginationPlaceholder = showPagination
      ? makePlaceholder({
          content: "{{brizy_dc_post_loop_pagination}}",
          attrStr: loopAttributes
        })
      : undefined;

    return (
      <div className={className} style={style}>
        {filterPlaceholder}
        <div className="brz-posts__wrapper">
          {startPlaceholder}
          {super.renderItemsContainer(item)}
          {endPlaceholder}
        </div>
        {paginationPlaceholder}
      </div>
    );
  }

  renderForViewCloud(v) {
    const { className, style, showPagination } = this.props;
    const item = v.map(this.renderItem);
    const loopAttributes = this.getLoopAttributesString();
    const startPlaceholder = makeStartPlaceholder({
      content: "{{brizy_dc_post_loop}}",
      attrStr: loopAttributes
    });
    const endPlaceholder = makeEndPlaceholder({
      content: "{{end_brizy_dc_post_loop}}"
    });
    const paginationPlaceholder = showPagination
      ? makePlaceholder({
          content: "{{brizy_dc_post_loop_pagination}}",
          attrStr: loopAttributes
        })
      : undefined;

    return (
      <div className={className} style={style}>
        <div className="brz-posts__wrapper">
          {startPlaceholder}
          {super.renderItemsContainer(item)}
          {endPlaceholder}
        </div>
        {paginationPlaceholder}
      </div>
    );
  }
}
