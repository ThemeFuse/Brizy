import React from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component-new/Sortable";

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Posts.Items";
  }

  static defaultProps = {
    gridRow: 1,
    gridColumn: 2,
    taxonomy: "",
    taxonomyId: "",
    meta: {}
  };

  getItemProps() {
    return {
      meta: this.props.meta
    };
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
    const { className, style, gridRow, gridColumn } = this.props;
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
        </div>
      </Sortable>
    );
  }

  renderForView(_v) {
    const v = _v.map(this.renderItem);
    const {
      className,
      style,
      gridColumn,
      gridRow,
      taxonomy,
      taxonomyId
    } = this.props;
    const maxPostItems = gridRow * gridColumn;

    return (
      <div className={className} style={style}>
        {`{{brizy_dc_post_loop count='${maxPostItems}' taxonomy='${taxonomy}' value='${taxonomyId}'}}`}
        {super.renderItemsContainer(v)}
        {`{{end_brizy_dc_post_loop}}`}
      </div>
    );
  }
}

export default Items;
