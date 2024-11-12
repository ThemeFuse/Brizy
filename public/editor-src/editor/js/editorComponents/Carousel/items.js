import classnames from "classnames";
import React from "react";
import ReactDOM from "react-dom";
import SlickSlider from "react-slick";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { normalizeCarouselColumns, setDataSortable } from "./utils";

// className is added by react-slick
const SliderArrow = ({ className, extraClassName, onClick, icon }) => (
  <div className={classnames(className, extraClassName)} onClick={onClick}>
    <ThemeIcon name={icon} type="editor" />
  </div>
);

class Items extends EditorArrayComponent {
  static get componentId() {
    return "Carousel.Items";
  }

  static defaultProps = {
    containerClassName: "",
    dynamic: "off",
    taxonomy: "",
    taxonomyId: "",
    orderBy: "",
    order: "",
    slidesToShow: 2,
    slidesToScroll: 1,
    sliderArrows: "none",
    sliderAnimation: "none",
    sliderDots: "none",
    meta: {}
  };

  slider = null;
  reopenOnIndex = null;
  toolbarRef = React.createRef();
  openSlideId = null;
  componentDidMount() {
    setDataSortable(this.slider);
  }

  componentDidUpdate(nextProps) {
    const { slidesToShow, slidesToScroll } = this.props;

    if (
      slidesToShow !== nextProps.slidesToShow ||
      slidesToScroll !== nextProps.slidesToScroll
    ) {
      setDataSortable(this.slider);
    }

    if (this.toolbarRef.current) {
      this.openSlideId = setTimeout(() => {
        this.toolbarRef.current.show();
        this.reopenOnIndex = null;
        this.toolbarRef.current = null;
      }, 250);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.openSlideId);
  }

  handleRefSlider = (node) => {
    /* eslint-disable react/no-find-dom-node */
    this.slider = ReactDOM.findDOMNode(node);
    /* eslint-enabled react/no-find-dom-node */
  };

  handleSliderAfterChange = () => {
    setDataSortable(this.slider);
  };

  handleValueChange(value, meta = {}) {
    const { arrayOperation } = meta;
    const afterCloneOrRemove =
      arrayOperation === "insert" || arrayOperation === "remove";
    const newValue = afterCloneOrRemove
      ? normalizeCarouselColumns(value)
      : value;

    if (afterCloneOrRemove) {
      setDataSortable(this.slider);
    }
    super.handleValueChange(newValue, meta);
  }

  handleSortableAcceptElements = (from, to) => {
    if (from.elementType === "addable") {
      const addableSubtype = from.elementNode.getAttribute(
        makeAttr("sortable-subtype")
      );

      if (addableSubtype === "row") {
        return false;
      }
    }

    const sameNode = from.sortableNode === to.sortableNode;
    const acceptsElement =
      ["column", "shortcode", "addable"].indexOf(from.elementType) !== -1;

    return sameNode || acceptsElement;
  };

  addColumn = (itemIndex) => {
    const v = this.getValue();

    const emptyItemData = {
      ...v[itemIndex - 1],
      value: { ...v[itemIndex - 1].value, items: [] }
    };
    this.insertItem(itemIndex, emptyItemData);
  };

  getParentRef = (node) => {
    const visibleSlide = node?.closest(".slick-active");
    if (visibleSlide) {
      return this.toolbarRef;
    }
    return undefined;
  };

  getItemProps(itemData, itemIndex, items) {
    let { meta, slidesToShow, dynamic, toolbarExtend } = this.props;

    if (dynamic === "off") {
      const cloneRemoveConfig = {
        getItems: () => [
          {
            id: "emptyItem",
            type: "button",
            devices: "desktop",
            config: {
              icon: "nc-add",
              title: t("Add New Column"),
              reverseTheme: true
            },
            position: 100,
            onClick: () => {
              this.addColumn(itemIndex + 1);
            }
          },
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
            id: "order",
            type: "order",
            devices: "desktop",
            position: 95,
            roles: ["admin"],
            disabled: items.length < 2,
            config: {
              disable:
                itemIndex === 0
                  ? "prev"
                  : itemIndex === items.length - 1
                    ? "next"
                    : undefined,
              onChange: (v) => {
                switch (v) {
                  case "prev":
                    this.reopenOnIndex = itemIndex - 1;
                    this.reorderItem(itemIndex, itemIndex - 1);
                    break;
                  case "next":
                    this.reorderItem(itemIndex, itemIndex + 1);
                    this.reopenOnIndex = itemIndex + 1;
                    break;
                }
              }
            }
          },
          ...(items.length > slidesToShow
            ? [
                {
                  id: "remove",
                  type: "button",
                  devices: "desktop",
                  config: {
                    title: t("Delete"),
                    icon: "nc-trash",
                    reverseTheme: true
                  },
                  position: 250,
                  onClick: () => {
                    hideToolbar();
                    this.removeItem(itemIndex);
                  }
                }
              ]
            : [])
        ]
      };

      toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);
    }

    return {
      meta,
      toolbarExtend,
      ...(this.reopenOnIndex === itemIndex && {
        getParentRef: this.getParentRef
      })
    };
  }

  renderItemWrapper(item, itemKey, itemIndex) {
    if (IS_PREVIEW) {
      return (
        <div key={itemKey} className="brz-carousel__item">
          {item}
        </div>
      );
    }

    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);

    const keyNames = [
      "ctrl+M",
      "alt+N",
      "ctrl+N",
      "cmd+N",
      "right_cmd+N",
      "alt+D",
      "alt+C",
      "alt+V",
      "alt+shift+V",
      "shift+alt+V",
      "alt+del",
      "alt+up",
      "alt+down"
    ];

    const shortcutsTypes = [
      "duplicate",
      "copy",
      "paste",
      "pasteStyles",
      "delete",
      "horizontalAlign",
      "verticalAlign",
      "showSidebarStyling",
      "showSidebarAdvanced"
    ];

    return (
      <ContextMenuExtend
        key={itemKey}
        {...this.makeContextMenuProps(contextMenuExtendConfig)}
      >
        <HotKeys
          keyNames={keyNames}
          shortcutsTypes={shortcutsTypes}
          id={itemKey}
          onKeyDown={this.handleKeyDown}
        >
          {item}
        </HotKeys>
      </ContextMenuExtend>
    );
  }

  renderSlider(content) {
    const {
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderDots,
      sliderAnimation,
      transitionSpeed,
      swipe,
      tabletSlidesToShow,
      mobileSlidesToShow
    } = this.props;

    if (IS_PREVIEW) {
      const responsive = [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: tabletSlidesToShow,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: mobileSlidesToShow,
            slidesToScroll: 1
          }
        }
      ];

      return (
        <div
          className="brz-carousel__slider"
          data-slides-to-show={slidesToShow}
          data-slides-to-scroll={slidesToScroll}
          data-arrows={sliderArrows !== "none"}
          data-dots={sliderDots !== "none"}
          data-dots-class={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
          data-auto-play={sliderAutoPlay === "on"}
          data-auto-play-speed={sliderAutoPlaySpeed * 1000}
          data-swipe={swipe === "on"}
          data-fade={sliderAnimation === "fade"}
          data-transition-speed={transitionSpeed}
          data-responsive={encodeURIComponent(JSON.stringify(responsive))}
        >
          {content}
          {sliderArrows !== "none" && (
            <ThemeIcon
              type="editor"
              name={`right-arrow-${sliderArrows}`}
              className="brz-hidden"
            />
          )}
        </div>
      );
    }

    return (
      <SlickSlider
        ref={this.handleRefSlider}
        className={`brz-carousel__slider brz-carousel__slider--${sliderAnimation}`}
        slidesToShow={slidesToShow}
        slidesToScroll={slidesToScroll}
        swipe={false}
        draggable={false}
        accessibility={false}
        arrows={sliderArrows !== "none"}
        useTransform={false}
        speed={500}
        fade={sliderAnimation === "fade"}
        nextArrow={
          <SliderArrow
            icon={`right-arrow-${sliderArrows}`}
            extraClassName="brz-slick-slider__arrow brz-slick-slider__arrow-next"
          />
        }
        prevArrow={
          <SliderArrow
            icon={`right-arrow-${sliderArrows}`}
            extraClassName="brz-slick-slider__arrow brz-slick-slider__arrow-prev"
          />
        }
        dots={sliderDots !== "none"}
        dotsClass={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
        responsive={[
          {
            breakpoint: 991,
            settings: {
              slidesToShow: tabletSlidesToShow,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: mobileSlidesToShow,
              slidesToScroll: 1
            }
          }
        ]}
        afterChange={this.handleSliderAfterChange}
      >
        {content}
      </SlickSlider>
    );
  }

  renderForEdit(v) {
    const { className, dynamic, columns } = this.props;
    let content =
      dynamic === "on"
        ? Array(columns).fill(super.renderForEdit(v.slice(0, 1)))
        : super.renderForEdit(v);

    return (
      <Sortable
        path={this.getId()}
        type="carousel"
        acceptElements={this.handleSortableAcceptElements}
      >
        <div className={className}>{this.renderSlider(content)}</div>
      </Sortable>
    );
  }
}

export default Items;
