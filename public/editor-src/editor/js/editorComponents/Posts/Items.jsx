import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { EditorComponentContext } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import Sortable from "visual/component/Sortable";
import Toolbar from "visual/component/Toolbar";
import { IS_WP } from "visual/utils/env";
import { stringifyAttributes } from "./utils.common";
import { TextEditor } from "visual/component/Controls/TextEditor";

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
      return `{{brizy_dc_post_terms taxonomy="${loopTagsAttributes.tax}"}}`;
    }

    return undefined;
  }

  handleSortableAcceptElements = from => {
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

  renderItemWrapper(item, itemKey) {
    return (
      <div
        key={itemKey}
        className="brz-posts__item"
        data-filter={this.getLoopItemFilter()}
      >
        {item}
      </div>
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
                    <TextEditor value={allTag} onChange={handleAllTagChange} />
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
    const items = data?.context.map(context => (
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

    const postLoopName =
      type === "upsell" ? "editor_product_upsells" : "brizy_dc_post_loop";
    const loopAttributes = this.getLoopAttributesString();

    return (
      <div className={className} style={style}>
        {showFilter &&
          `{{brizy_dc_post_loop_tags ${this.getLoopTagsAttributesString()}}}`}
        <div className="brz-posts__wrapper">
          {`{{${postLoopName} ${loopAttributes}}}`}
          {super.renderItemsContainer(item)}
          {`{{end_${postLoopName}}}`}
        </div>
        {showPagination &&
          `{{brizy_dc_post_loop_pagination ${loopAttributes}}}`}
      </div>
    );
  }

  renderForViewCloud(v) {
    const { className, style, showPagination } = this.props;
    const item = v.map(this.renderItem);
    const loopAttributes = this.getLoopAttributesString();

    return (
      <div className={className} style={style}>
        <div className="brz-posts__wrapper">
          {`{{brizy_dc_post_loop ${loopAttributes}}}`}
          {super.renderItemsContainer(item)}
          {"{{end_brizy_dc_post_loop}}"}
        </div>
        {showPagination &&
          `{{brizy_dc_post_loop_pagination ${loopAttributes}}}`}
      </div>
    );
  }
}
