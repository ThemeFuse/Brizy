import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classnames from "classnames";
import React from "react";
import SlickSlider from "react-slick";
import debounceRenderHOC from "visual/component/DebounceRenderHOC";
import EditorIcon from "visual/component/EditorIcon";
import Prompts from "visual/component/Prompts";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { hideToolbar } from "visual/component/Toolbar";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { importStory } from "visual/redux/actions2";
import { getStore } from "visual/redux/store";
import { t } from "visual/utils/i18n";

const Dot = debounceRenderHOC((props) => {
  const { id, onClick, isActive, children } = props;
  const {
    active: dragged,
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef
  } = useSortable({ id });

  const isDragged = dragged?.id === id;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragged ? 1 : 0
  };
  const className = classnames("story-slider-curtain", {
    "story-slider-dot--active": isActive
  });

  return (
    <li
      onClick={onClick}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div className={className} />
      <div className="story-slider-dot">{children}</div>
    </li>
  );
}, 200);

const Dots = (props) => {
  const { itemsIds, onClick, onSortEnd, onSortStart, children } = props;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // creates a delay so the click events could trigger
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <ul className="brz-slick-slider__dots">
      <DndContext
        onDragEnd={onSortEnd}
        onDragStart={onSortStart}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext items={itemsIds}>{children}</SortableContext>
      </DndContext>
      <li onClick={onClick}>
        <div className="story-slider-curtain" />
        <div className="brz-slick-slider__dots--add-new">
          <EditorIcon icon="nc-add" />
        </div>
      </li>
    </ul>
  );
};
class StoryItems extends EditorArrayComponent {
  static get componentId() {
    return "Story.Items";
  }
  static defaultProps = {
    className: "",
    meta: {}
  };
  state = {
    active: 0
  };

  componentDidUpdate(_, { active }) {
    if (this.state.active !== active) {
      this.slider.slickGoTo(this.state.active);
    }
  }

  removeItem(index) {
    super.removeItem(index);
    this.setState({ active: Math.max(0, index - 1) });
  }

  getToolbarSettings = (itemIndex) => {
    const dbValue = this.getDBValue();
    return {
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 200,
          onChange: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          icon: "nc-trash",
          title: t("Delete"),
          disabled: dbValue.length === 1,
          position: 250,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        },
        {
          id: "toolbarStories",
          type: "popover-dev",
          disabled: true,
          options: []
        },
        {
          id: "toolbarColor",
          type: "popover-dev",
          disabled: true,
          options: []
        },
        {
          id: "toolbarAutoplay",
          type: "popover-dev",
          disabled: true,
          options: []
        }
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };
  };

  getItemProps() {
    const { meta, itemProps } = this.props;
    const toolbarExtendSettings = {
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
          disabled: true
        },
        {
          id: "remove",
          type: "button",
          disabled: true
        }
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig(
      toolbarExtendSettings
    );
    return {
      meta,
      toolbarExtend,
      ...itemProps
    };
  }

  handleSortEnd = (event) => {
    let { active } = this.state;
    const { active: activeDrag, over: overDrag } = event;

    if (!overDrag) return;

    const dbValue = this.getDBValue() || [];
    const oldIndex = dbValue.findIndex(
      (item) => item.value._id === activeDrag.id
    );
    const newIndex = dbValue.findIndex(
      (item) => item.value._id === overDrag.id
    );

    if (oldIndex !== newIndex) {
      const updatedValue = arrayMove(dbValue, oldIndex, newIndex);
      this.handleValueChange(updatedValue);
    }

    if (oldIndex < active && active <= newIndex) {
      active--;
    } else if (newIndex <= active && active < oldIndex) {
      active++;
    } else if (active === oldIndex) {
      active = newIndex;
    }
    this.setState({ active });
  };

  handleClick = (active) => {
    this.setState({ active });
  };

  handleAddStory = (data) => {
    const dbValue = this.getDBValue() || [];
    const insertIndex = dbValue.length;
    const meta = { insertIndex };
    this.setState({ active: insertIndex });
    getStore().dispatch(importStory(data, meta));
  };

  handleAddNewElement = () => {
    Prompts.open({
      prompt: "blocks",
      mode: "single",
      props: {
        activeTab: "template",
        showTemplate: true,
        showBlocks: false,
        showSaved: false,
        showGlobal: false,
        templateSidebar: true,
        blocksSidebar: false,
        savedSidebar: false,
        globalSidebar: false,
        templateSearch: true,
        blocksSearch: false,
        savedSearch: false,
        globalSearch: false,
        onChangeTemplate: this.handleAddStory
      }
    });
  };

  renderDots = (dots, v) => {
    const items = dots.map((item, index) => {
      const itemV = v[index] ?? {};
      const isActive = index === this.state.active;
      const id = itemV.value._id;

      return (
        <Toolbar
          key={id}
          {...this.makeToolbarPropsFromConfig(this.getToolbarSettings(index))}
        >
          <Dot
            id={id}
            onClick={() => this.handleClick(index)}
            isActive={isActive}
          >
            {item}
          </Dot>
        </Toolbar>
      );
    });

    return (
      <Dots
        distance={5}
        axis="x"
        helperClass="slick-dots-is-dragging"
        itemsIds={v.map((v) => v.value._id)}
        onClick={this.handleAddNewElement}
        onSortEnd={this.handleSortEnd}
      >
        {items}
      </Dots>
    );
  };

  renderItemsContainer(items, v) {
    if (IS_EDITOR) {
      return (
        <SlickSlider
          className={"brz-slick-slider"}
          ref={(el) => {
            this.slider = el;
          }}
          centerMode={false}
          centerPadding={"0px"}
          variableWidth={false}
          focusOnSelect={false}
          alwaysShowDots={true}
          slidesToShow={1}
          infinite={true}
          slidesToScroll={1}
          initialSlide={0}
          swipe={false}
          draggable={false}
          accessibility={false}
          arrows={false}
          dots={true}
          dotsClass={"brz-slick-slider__dots"}
          fade={false}
          verticalSwiping={false}
          vertical={false}
          appendDots={() => this.renderDots(items, v)}
        >
          {items}
        </SlickSlider>
      );
    }
    if (IS_PREVIEW) {
      const { sliderAutoPlay, sliderAutoPlaySpeed, sliderLoop } = this.props;
      const responsive = [
        {
          breakpoint: 767,
          settings: {
            centerPadding: "40px",
            slidesToShow: 1,
            speed: 300
          }
        }
      ];
      return (
        <div
          className="brz-slick-slider brz-slick-slider__story"
          data-center-mode={true}
          data-center-padding="60px"
          data-variable-width={true}
          data-focus-on-select={true}
          data-slider-loop={sliderLoop === "on"}
          data-touch-threshold={15}
          data-slides-to-scroll={1}
          data-arrows={true}
          data-dots={true}
          data-dots-class="brz-slick-slider__dots"
          data-fade={false}
          data-vertical={false}
          data-auto-play={sliderAutoPlay === "on"}
          data-auto-play-speed={sliderAutoPlaySpeed * 1000}
          data-swipe={true}
          data-responsive={encodeURIComponent(JSON.stringify(responsive))}
          data-speed={300}
        >
          {items}
          <ThemeIcon
            className="brz-hidden"
            type="editor"
            name={"right-arrow-thin"}
          />
          <ThemeIcon className="brz-hidden" type="glyph" name={"undo-29"} />
        </div>
      );
    }
  }
}

export default StoryItems;
