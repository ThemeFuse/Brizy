import React from "react";
import ReactDOM from "react-dom";
import SlickSlider from "react-slick";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Sortable from "visual/component-new/Sortable";
import EditorIcon from "visual/component-new/EditorIcon";
import { hideToolbar } from "visual/component-new/Toolbar/index";
import { t } from "visual/utils/i18n";
import { templateIconUrl } from "visual/utils/icons";
import { setDataSortable, normalizeCarouselColumns } from "./utils";

// className is added by react-slick
const SliderArrow = ({ className, extraClassName, onClick, icon }) => (
  <div className={classnames(className, extraClassName)} onClick={onClick}>
    <EditorIcon icon={icon} />
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
    sliderDots: "none",
    meta: {}
  };

  slider = null;

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
  }

  handleRefSlider = node => {
    this.slider = ReactDOM.findDOMNode(node);
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
        "data-sortable-subtype"
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

  getItemProps(itemData, itemIndex, items) {
    let { meta, slidesToShow, dynamic, toolbarExtend } = this.props;

    if (dynamic === "off") {
      const cloneRemoveConfig = {
        getItemsForDesktop: () => [
          {
            id: "emptyItem",
            type: "button",
            icon: "nc-add",
            title: t("Add new column"),
            position: 100,
            onChange: () => {
              const emptyItemData = {
                ...itemData,
                value: { ...itemData.value, items: [] }
              };
              this.insertItem(itemIndex + 1, emptyItemData);
            }
          },
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
          ...(items.length > slidesToShow
            ? [
                {
                  id: "remove",
                  type: "button",
                  title: t("Delete"),
                  icon: "nc-trash",
                  position: 250,
                  onChange: () => {
                    hideToolbar();
                    this.removeItem(itemIndex);
                  }
                }
              ]
            : [])
        ],
        getItemsForMobile: () => []
      };

      toolbarExtend = this.makeToolbarPropsFromConfig(cloneRemoveConfig);
    }

    return {
      meta,
      toolbarExtend
    };
  }

  renderItemWrapper(item, itemKey) {
    return IS_PREVIEW ? (
      <div key={itemKey} className="brz-carousel__item">
        {item}
      </div>
    ) : (
      item
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
      swipe
    } = this.props;

    if (IS_PREVIEW) {
      const arrowIcon =
        sliderArrows !== "none" &&
        templateIconUrl("editor", `right-arrow-${sliderArrows}`);

      return (
        <div
          className="brz-carousel__slider"
          data-slides-to-show={slidesToShow}
          data-slides-to-scroll={slidesToScroll}
          data-arrows={sliderArrows !== "none"}
          data-dots={sliderDots !== "none"}
          data-dots-class={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
          data-next-arrow={arrowIcon}
          data-prev-arrow={arrowIcon}
          data-auto-play={sliderAutoPlay === "on"}
          data-auto-play-speed={sliderAutoPlaySpeed * 1000}
          data-swipe={swipe === "on"}
        >
          {content}
        </div>
      );
    }

    return (
      <SlickSlider
        ref={this.handleRefSlider}
        className="brz-carousel__slider"
        slidesToShow={slidesToShow}
        slidesToScroll={slidesToScroll}
        swipe={false}
        draggable={false}
        accessibility={false}
        arrows={sliderArrows !== "none"}
        nextArrow={
          <SliderArrow
            icon={`nc-right-arrow-${sliderArrows}`}
            extraClassName="brz-slick-slider__arrow brz-slick-slider__arrow-next"
          />
        }
        prevArrow={
          <SliderArrow
            icon={`nc-right-arrow-${sliderArrows}`}
            extraClassName="brz-slick-slider__arrow brz-slick-slider__arrow-prev"
          />
        }
        dots={sliderDots !== "none"}
        dotsClass={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
        responsive={[
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
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
    const { className, style, dynamic, columns } = this.props;
    let content =
      dynamic === "on"
        ? Array(columns).fill(super.renderForEdit(v.slice(0, 1)))
        : super.renderForEdit(v);

    return (
      <Sortable
        path={this.getPath()}
        type="carousel"
        acceptElements={this.handleSortableAcceptElements}
      >
        <div className={className} style={style}>
          {this.renderSlider(content)}
        </div>
      </Sortable>
    );
  }
}

export default Items;
