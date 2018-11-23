import React from "react";
import { connect } from "react-redux";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { removeAt, insert } from "timm";
import Editor from "visual/global/Editor";
import EditorIcon from "visual/component/EditorIcon";
import { blockThumbnailUrl } from "visual/utils/blocks";
import { updatePage } from "visual/redux/actionCreators";
import { t } from "visual/utils/i18n";

const SortableItem = SortableElement(({ item, onRemove }) => {
  const blockId = item.blockId;
  const blockData = Editor.getBlock(blockId);

  if (item.value._blockVisibility === "unlisted") {
    return <div hidden />;
  }

  return (
    <div className="brz-ed-sidebar-block-item">
      <div className="brz-ed-sidebar-block-image">
        <img className="brz-img" src={blockThumbnailUrl(blockData)} />
        <div className="brz-ed-sidebar-block-layout">
          <span className="brz-span brz-ed-sidebar-block-drag">
            {t("Drag to reorder")}
          </span>
        </div>
      </div>
      <div className="brz-ed-sidebar-block-remove" onClick={onRemove}>
        <EditorIcon icon="nc-circle-remove-2" className="brz-ed-bar-icon" />
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ items, onItemRemove }) => (
  <div className="brz-ed-sidebar-ordering">
    {items.map((item, index) => (
      <SortableItem
        key={index}
        index={index}
        item={item}
        onRemove={() => onItemRemove(index)}
      />
    ))}
  </div>
));

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
