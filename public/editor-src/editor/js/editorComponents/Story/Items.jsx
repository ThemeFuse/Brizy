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
import { noop } from "es-toolkit";
import React, { forwardRef } from "react";
import SlickSlider from "react-slick";
import debounceRenderHOC from "visual/component/DebounceRenderHOC";
import EditorIcon from "visual/component/EditorIcon";
import Prompts from "visual/component/Prompts";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar, { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { useIsRTL } from "visual/global/hooks";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { importStory } from "visual/redux/actions2";
import { t } from "visual/utils/i18n";
import { attachRef } from "visual/utils/react";

const Dot = debounceRenderHOC(
  forwardRef((props, ref) => {
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
        ref={(el) => {
          setNodeRef(el);
          attachRef(el, ref);
        }}
        {...attributes}
        {...listeners}
      >
        <div className={className} />
        <div className="story-slider-dot">{children}</div>
      </li>
    );
  }),
  200
);

const Dots = (props) => {
  const { itemsIds, onClick, onSortEnd, onSortStart, children } = props;
  const isRtl = useIsRTL();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // creates a delay so the click events could trigger
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor)
  );

  // The SlickSlider add dir="lrt" on the wrapper element, so we need to add dir="rtl" to the ul element
  return (
    <ul className="brz-slick-slider__dots" dir={isRtl ? "rtl" : "ltr"}>
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
  static defaultProps = {
    className: "",
    meta: {}
  };
  state = {
    active: 0
  };

  static get componentId() {
    return "Story.Items";
  }

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
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          position: 200,
          onClick: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          devices: "desktop",
          config: { icon: "nc-trash", title: t("Delete"), reverseTheme: true },
          disabled: dbValue.length === 1,
          position: 250,
          onClick: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        },
        {
          id: "toolbarStories",
          type: "popover",
          devices: "desktop",
          disabled: true,
          options: []
        },
        {
          id: "toolbarColor",
          type: "popover",
          devices: "desktop",
          disabled: true,
          options: []
        },
        {
          id: "toolbarAutoplay",
          type: "popover",
          devices: "desktop",
          disabled: true,
          options: []
        }
      ]
    };
  };

  getItemProps() {
    const { meta, itemProps } = this.props;
    const toolbarExtendSettings = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          onClick: noop,
          disabled: true
        },
        {
          id: "remove",
          type: "button",
          devices: "desktop",
          onClick: noop,
          disabled: true
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
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
    const dispatch = this.getReduxDispatch();
    dispatch(importStory(data, meta));
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
          {...this.makeToolbarPropsFromConfig2(this.getToolbarSettings(index))}
        >
          {({ ref }) => (
            <Dot
              id={id}
              onClick={() => this.handleClick(index)}
              isActive={isActive}
              containerRef={ref}
            >
              {item}
            </Dot>
          )}
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
    if (isEditor(this.props.renderContext)) {
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
    if (isView(this.props.renderContext)) {
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
