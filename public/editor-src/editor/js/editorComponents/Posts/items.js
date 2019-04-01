import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component/Sortable";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Posts.Items";
  }

  static defaultProps = {
    gridRow: 1,
    gridColumn: 2,
    pagination: false,
    loopAttributes: {},
    meta: {}
  };

  getItemProps() {
    return {
      meta: this.props.meta
    };
  }

  getLoopAttributes() {
    const { loopAttributes } = this.props;

    return Object.keys(loopAttributes).reduce((acc, curr) => {
      return `${acc} ${curr}='${loopAttributes[curr]}'`;
    }, "");
  }

  handleSortableAcceptElements = (from, to) => {
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

  renderForEdit(v) {
    const { className, style, gridRow, gridColumn, pagination } = this.props;
    const item = super.renderForEdit(v);
    const items = Array(gridRow * gridColumn).fill(item);

    return (
      <Sortable
        path={this.getPath()}
        type="posts"
        acceptElements={this.handleSortableAcceptElements}
      >
        <div className={className} style={style}>
          {items}
          {pagination && (
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
          )}
        </div>
      </Sortable>
    );
  }

  renderForView(_v) {
    const v = _v.map(this.renderItem);
    const { className, style, pagination } = this.props;

    return (
      <div className={className} style={style}>
        {`{{ brizy_dc_post_loop ${this.getLoopAttributes()} }}`}
        {super.renderItemsContainer(v)}
        {`{{end_brizy_dc_post_loop}}`}
        {pagination &&
          `{{ brizy_dc_post_loop_pagination ${this.getLoopAttributes()} }}`}
      </div>
    );
  }
}

export default Items;
