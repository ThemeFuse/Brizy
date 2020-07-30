import React from "react";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";
import Toolbar from "visual/component/Toolbar";
import { stringifyAttributes } from "./utils";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Posts.Items";
  }

  static defaultProps = {
    className: "",
    rowCount: 1,
    columnCount: 2,
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
    const { showFilter } = this.props;

    return (
      <div
        key={itemKey}
        className="brz-posts__item"
        data-filter={showFilter ? "{{ brizy_dc_post_tags }}" : undefined}
      >
        {item}
      </div>
    );
  }

  renderTagsForEdit() {
    const { toolbarExtendFilter, filterStyle } = this.props;
    const listClassName = classnames(
      "brz-ul brz-posts__filter",
      `brz-posts__filter--${filterStyle}`
    );
    const itemClassName = classnames(
      "brz-li brz-posts__filter__item",
      `brz-posts__filter__item--${filterStyle}`
    );
    const tags = ["All", "art", "sport", "food"]; // tags are hardcoded (fake) in the editor

    return (
      <div className="brz-posts__filter-wrapper">
        <ul className={listClassName}>
          {tags.map((tag, index) => (
            <Toolbar key={index} {...toolbarExtendFilter}>
              <li className={itemClassName}>{tag}</li>
            </Toolbar>
          ))}
        </ul>
      </div>
    );
  }

  renderPaginationForEdit() {
    return (
      <Toolbar {...this.props.toolbarExtendPagination}>
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
      </Toolbar>
    );
  }

  renderForEdit(v) {
    const {
      className,
      rowCount,
      columnCount,
      showFilter,
      showPagination
    } = this.props;
    const item = super.renderForEdit(v);
    const items = Array(rowCount * columnCount).fill(item);

    return (
      <Sortable
        path={this.getPath()}
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
    const {
      className,
      style,
      showPagination,
      showFilter,
      filterStyle
    } = this.props;
    const item = v.map(this.renderItem);
    const filterClassName = `brz-posts__filter--${filterStyle}`;
    const filterItemClassName = `brz-posts__filter__item--${filterStyle}`;
    return (
      <div className={className} style={style}>
        {showFilter &&
          `{{ brizy_dc_post_loop_tags ulClassName='${filterClassName}' liClassName='${filterItemClassName}' }}`}
        <div className="brz-posts__wrapper">
          {`{{ brizy_dc_post_loop ${this.getLoopAttributesString()} }}`}
          {super.renderItemsContainer(item)}
          {"{{end_brizy_dc_post_loop}}"}
        </div>
        {showPagination &&
          `{{ brizy_dc_post_loop_pagination ${this.getLoopAttributesString()} }}`}
      </div>
    );
  }
}

export default Items;
