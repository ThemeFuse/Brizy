import React from "react";
import { connect } from "react-redux";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { removeAt, insert } from "timm";
import EditorIcon from "visual/component/EditorIcon";
import { updatePage } from "visual/redux/actions";
import { t } from "visual/utils/i18n";
import BlockThumbnail from "./BlockThumbnail";

const SortableItem = SortableElement(({ item, onRemove }) => {
  return (
    <div className="brz-ed-sidebar-block-item">
      <BlockThumbnail blockData={item} />
      <div className="brz-ed-sidebar-block-remove" onClick={onRemove}>
        <EditorIcon icon="nc-circle-remove-2" className="brz-ed-bar-icon" />
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ items, onItemRemove }) => {
  const filteredItems = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.value._blockVisibility === "unlisted") {
      continue;
    }

    filteredItems.push(
      <SortableItem
        key={item.value._id}
        item={item}
        index={i}
        onRemove={() => onItemRemove(i)}
      />
    );
  }

  return <div className="brz-ed-sidebar-ordering">{filteredItems}</div>;
});

class DrawerComponent extends React.Component {
  static defaultProps = {
    items: [],
    onSortEnd: () => {},
    onItemRemove: () => {}
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const { pageBlocks } = this.props;
      const movedBlock = pageBlocks[oldIndex];
      const updatedBlocks = insert(
        removeAt(pageBlocks, oldIndex),
        newIndex,
        movedBlock
      );

      this.updatePageBlocks(updatedBlocks);
    }
  };

  handleItemRemove = index => {
    const { pageBlocks } = this.props;
    const updatedBlocks = removeAt(pageBlocks, index);

    this.updatePageBlocks(updatedBlocks);
  };

  updatePageBlocks = blocks => {
    const { pageData, onPageDataChange } = this.props;

    onPageDataChange({ ...pageData, items: blocks });
  };

  render() {
    return (
      <SortableList
        helperClass="brz-ed-sidebar-block-item-helper"
        items={this.props.pageBlocks}
        distance={5}
        contentWindow={() => window.parent}
        onSortEnd={this.handleSortEnd}
        onItemRemove={this.handleItemRemove}
      />
    );
  }
}

const mapStateToProps = state => ({
  pageData: state.page.data,
  pageBlocks: state.page.data.items || []
});

const mapDispatchToProps = dispatch => ({
  onPageDataChange: data => {
    dispatch(updatePage({ data }));
  }
});

export const BlocksSortable = {
  id: "blocksSortable",
  icon: "nc-reorder",
  drawerTitle: t("Reorder Blocks"),
  drawerComponent: connect(
    mapStateToProps,
    mapDispatchToProps
  )(DrawerComponent)
};
