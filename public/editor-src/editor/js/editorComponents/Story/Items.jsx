import React from "react";
import classnames from "classnames";
import { insert, removeAt } from "timm";
import SlickSlider from "react-slick";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorIcon from "visual/component/EditorIcon";
import ThemeIcon from "visual/component/ThemeIcon";
import { hideToolbar } from "visual/component/Toolbar";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { importStory } from "visual/redux/actions2";
import debounceRenderHOC from "visual/component/DebounceRenderHOC";
import { t } from "visual/utils/i18n";
import Prompts from "visual/component/Prompts";

const Dot = SortableElement(
  debounceRenderHOC(({ item, onClick, isActive }) => {
    const className = classnames("story-slider-curtain", {
      "story-slider-dot--active": isActive
    });

    return (
      <li onClick={onClick}>
        <div key="curtain" className={className} onClick={item.props.onClick} />
        <div key="item" className="story-slider-dot">
          {item}
        </div>
      </li>
    );
  }, 200)
);

const Dots = SortableContainer(({ items, onClick }) => {
  return (
    <ul className="brz-slick-slider__dots">
      {items}
      <li onClick={onClick}>
        <div className="story-slider-curtain" />
        <div className="brz-slick-slider__dots--add-new">
          <EditorIcon icon="nc-add" />
        </div>
      </li>
    </ul>
  );
});

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

  getToolbarSettings = itemIndex => {
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
        }
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };
  };

  getItemProps() {
    const { meta } = this.props;
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
      toolbarExtend
    };
  }

  handleSortEnd = ({ newIndex, oldIndex }) => {
    let { active } = this.state;
    const dbValue = this.getDBValue() || [];

    const updatedValue = insert(
      removeAt(dbValue, oldIndex),
      newIndex,
      dbValue[oldIndex]
    );

    this.handleValueChange(updatedValue);

    if (oldIndex < active && active <= newIndex) {
      active--;
    } else if (newIndex <= active && active < oldIndex) {
      active++;
    } else if (active === oldIndex) {
      active = newIndex;
    }

    this.setState({ active });
  };

  handleClick = active => {
    this.setState({ active });
  };

  handleAddStory = data => {
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

  renderDots = dots => {
    let items = dots.map((item, index) => {
      const isActive = index === this.state.active;

      return (
        <Toolbar
          key={item.key}
          {...this.makeToolbarPropsFromConfig(this.getToolbarSettings(index))}
        >
          <Dot
            item={item}
            index={index}
            onClick={() => this.handleClick(index)}
            isActive={isActive}
          />
        </Toolbar>
      );
    });

    return (
      <Dots
        distance={5}
        axis="x"
        helperClass="slick-dots-is-dragging"
        items={items}
        onClick={this.handleAddNewElement}
        onSortEnd={this.handleSortEnd}
      />
    );
  };

  renderItemsContainer(items) {
    if (IS_EDITOR) {
      return (
        <SlickSlider
          className={"brz-slick-slider"}
          ref={el => {
            this.slider = el;
          }}
          centerMode={false}
          centerPadding={"0px"}
          variableWidth={false}
          focusOnSelect={false}
          alwaysShowDots={true}
          slidesToShow={1}
          infinite={false}
          slidesToScroll={1}
          initialSlide={0}
          lazyLoad={"ondemand"}
          swipe={false}
          draggable={false}
          accessibility={false}
          arrows={false}
          dots={true}
          dotsClass={"brz-slick-slider__dots"}
          fade={false}
          verticalSwiping={false}
          vertical={false}
          appendDots={() => this.renderDots(items)}
        >
          {items}
        </SlickSlider>
      );
    }

    if (IS_PREVIEW) {
      const responsive = [
        {
          breakpoint: 767,
          settings: {
            variableWidth: true,
            lazyLoad: "ondemand",
            arrows: true,
            centerMode: true,
            centerPadding: "40px",
            slidesToShow: 1,
            swipe: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            variableWidth: true,
            arrows: true,
            lazyLoad: "ondemand",
            centerMode: true,
            centerPadding: "40px",
            slidesToShow: 1,
            swipe: true
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
          data-infinite={false}
          data-touch-threshold={15}
          data-slides-to-scroll={1}
          data-lazy-load="ondemand"
          data-arrows={true}
          data-dots={true}
          data-dots-class="brz-slick-slider__dots"
          data-fade={false}
          data-vertical={false}
          data-auto-play={false}
          data-swipe={true}
          data-responsive={encodeURIComponent(JSON.stringify(responsive))}
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
