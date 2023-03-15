import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classnames from "classnames";
import React from "react";
import { connect } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { removeBlock, reorderBlocks } from "visual/redux/actions2";
import {
  globalBlocksSelector,
  pageBlocksAssembledSelector,
  pageSelector
} from "visual/redux/selectors";
import { canUseCondition } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import { isPopup, isStory } from "visual/utils/models";
import BlockThumbnail from "./BlockThumbnail";

const DragHandle = ({ item }) => <BlockThumbnail blockData={item} />;

const SortableItem = ({ item, globalBlocks, page, onRemove, id }) => {
  if (item.type === "GlobalBlock") {
    const { _id } = item.value;

    try {
      if (!canUseCondition(globalBlocks[_id], page)) {
        return <div />;
      }
    } catch {
      return <div />;
    }
  }

  const { active, attributes, listeners, transform, transition, setNodeRef } =
    useSortable({ id });

  const isActive = active?.id === id;
  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };

  return (
    <div
      className="brz-ed-sidebar-block-item"
      style={{ zIndex: isActive ? 1 : 0 }}
    >
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <DragHandle item={item} />
      </div>
      <div className="brz-ed-sidebar-block-remove" onClick={onRemove}>
        <EditorIcon icon="nc-circle-remove-2" className="brz-ed-bar-icon" />
      </div>
    </div>
  );
};

const SortableList = ({
  isSorting,
  items,
  globalBlocks,
  page,
  onItemRemove,
  onSortEnd,
  onSortStart
}) => {
  //sortable context doesnt accept complex objects (array of ids needed)
  const filteredItemsIds = [];
  const filteredItems = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const id = item.value._id;

    if (item.value._blockVisibility === "unlisted") continue;

    filteredItemsIds.push(id);
    filteredItems.push(
      <SortableItem
        key={item.value._id}
        item={item}
        globalBlocks={globalBlocks}
        page={page}
        id={id}
        onRemove={() => onItemRemove(i)}
      />
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // creates a delay so the click events could trigger
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor)
  );

  const className = classnames("brz-ed-sidebar-sortable", {
    "brz-ed-sidebar-sortable--sorting": isSorting
  });

  return (
    <div className={className}>
      <DndContext
        onDragStart={onSortStart}
        onDragEnd={onSortEnd}
        sensors={sensors}
        modifiers={[restrictToWindowEdges, restrictToVerticalAxis]}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={filteredItemsIds}
          strategy={verticalListSortingStrategy}
        >
          {filteredItems}
        </SortableContext>
      </DndContext>
    </div>
  );
};

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

    if (props.pageBlocks !== state.blocks) {
      return {
        blocks: props.pageBlocks || []
      };
    }

    return null;
  }

  state = {
    blocks: [],
    isSorting: false
  };

  content = React.createRef();

  handleSortStart = () => {
    this.setState({ isSorting: true });
  };

  getContentWindow = () => {
    return window.parent;
  };

  getContainer = () => {
    const node = this.content.current;

    return node && node.parentElement;
  };

  handleSortEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      return this.setState({
        isSorting: false
      });
    }
    const oldIndex = this.state.blocks.findIndex(
      (item) => item.value._id === active.id
    );
    const newIndex = this.state.blocks.findIndex(
      (item) => item.value._id === over.id
    );

    if (oldIndex === newIndex) {
      return this.setState({
        isSorting: false
      });
    }
    // make an optimistic update,
    // after which update the store fo real
    this.setState(
      (state) => {
        const { blocks } = state;

        return {
          blocks: arrayMove(blocks, oldIndex, newIndex),
          optimistic: true,
          isSorting: false
        };
      },
      () => {
        this.props.dispatch(reorderBlocks({ oldIndex, newIndex }));
      }
    );
  };

  handleItemRemove = (index) => {
    const {
      value: { _id }
    } = this.state.blocks[index];

    this.props.dispatch(removeBlock({ index, id: _id }));
  };

  render() {
    const { blocks, isSorting } = this.state;
    const { page, globalBlocks } = this.props;

    return (
      <SortableList
        helperClass="brz-ed-sidebar-block-item-helper"
        isSorting={isSorting}
        items={blocks}
        globalBlocks={globalBlocks}
        distance={5}
        useDragHandle={true}
        innerRef={this.content}
        page={page}
        contentWindow={this.getContentWindow}
        getContainer={this.getContainer}
        onSortStart={this.handleSortStart}
        onSortEnd={this.handleSortEnd}
        onItemRemove={this.handleItemRemove}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  pageBlocks: pageBlocksAssembledSelector(state),
  globalBlocks: globalBlocksSelector(state),
  page: pageSelector(state)
});

export const BlocksSortable = {
  id: LeftSidebarOptionsIds.reorderBlock,
  type: "drawer",
  icon: "nc-reorder",
  disabled: isPopup(Config.getAll()) || isStory(Config.getAll()),
  drawerTitle: t("Reorder Blocks"),
  drawerComponent: connect(mapStateToProps)(DrawerComponent)
};
