import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from "react-sortable-hoc";
import { removeAt, insert } from "timm";
import EditorIcon from "visual/component/EditorIcon";
import { pageAssembledSelector } from "visual/redux/selectors";
import { removeBlock, reorderBlocks } from "visual/redux/actions";
import { t } from "visual/utils/i18n";
import BlockThumbnail from "./BlockThumbnail";

const DragHandle = SortableHandle(({ item }) => (
  <BlockThumbnail blockData={item} />
));

const SortableItem = SortableElement(({ item, onRemove }) => {
  return (
    <div className="brz-ed-sidebar-block-item">
      <DragHandle item={item} />
      <div className="brz-ed-sidebar-block-remove" onClick={onRemove}>
        <EditorIcon icon="nc-circle-remove-2" className="brz-ed-bar-icon" />
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ isSorting, items, onItemRemove }) => {
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

  const className = classnames("brz-ed-sidebar-sortable", {
    "brz-ed-sidebar-sortable--sorting": isSorting
  });
  return <div className={className}>{filteredItems}</div>;
});

class DrawerComponent extends React.Component {
  static getDerivedStateFromProps(props, state) {
    // the 'optimistic' flag tells us to keep the state
    // to perform an optimistic update until we get new props.
    // This is why we discard the flag after accepting the state
    if (state.optimistic) {
      return {
        blocks: state.blocks,
        optimistic: false
      };
    }

    if (props.page.data.items !== state.blocks) {
      return {
        blocks: props.page.data.items || []
      };
    }

    return null;
  }

  state = {
    blocks: [],
    isSorting: false
  };

  handleBeforeSortStart = () => {
    this.setState({
      isSorting: true
    });
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      // make an optimistic update,
      // after which update the store fo real
      this.setState(
        state => {
          const { blocks } = state;
          const movedBlock = blocks[oldIndex];

          return {
            blocks: insert(removeAt(blocks, oldIndex), newIndex, movedBlock),
            optimistic: true,
            isSorting: false
          };
        },
        () => {
          setTimeout(() => {
            this.props.dispatch(reorderBlocks({ oldIndex, newIndex }));
          }, 100);
        }
      );
    } else {
      this.setState({
        isSorting: false
      });
    }
  };

  handleItemRemove = index => {
    this.props.dispatch(removeBlock({ index }));
  };

  render() {
    const { blocks, isSorting } = this.state;

    return (
      <SortableList
        helperClass="brz-ed-sidebar-block-item-helper"
        isSorting={isSorting}
        items={blocks}
        distance={5}
        useDragHandle={true}
        contentWindow={() => window.parent}
        onSortStart={this.handleBeforeSortStart}
        onSortEnd={this.handleSortEnd}
        onItemRemove={this.handleItemRemove}
      />
    );
  }
}

const mapStateToProps = state => ({
  page: pageAssembledSelector(state)
});

export const BlocksSortable = {
  id: "blocksSortable",
  icon: "nc-reorder",
  drawerTitle: t("Reorder Blocks"),
  drawerComponent: connect(mapStateToProps)(DrawerComponent)
};
