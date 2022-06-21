import React from "react";
import SlickSlider from "react-slick";
import classnames from "classnames";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorIcon from "visual/component/EditorIcon";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

// className is added by react-slick
const SliderArrow = ({ className, extraClassName, onClick, icon }) => (
  <div className={classnames(className, extraClassName)} onClick={onClick}>
    <ThemeIcon name={icon} type="editor" />
  </div>
);

class SectionItems extends EditorArrayComponent {
  static get componentId() {
    return "Section.Items";
  }

  static defaultProps = {
    className: "",
    meta: {}
  };

  state = {
    showSpinner: false,
    showSlider: this.props.meta.section.isSlider
  };

  componentDidUpdate(prevProps) {
    const isSliderChanged =
      prevProps.meta.section.isSlider !== this.props.meta.section.isSlider;

    if (isSliderChanged) {
      this.setState(
        {
          showSpinner: true
        },
        () => {
          setTimeout(() => {
            this.setState(
              {
                showSlider: this.props.meta.section.isSlider
              },
              () => {
                setTimeout(() => {
                  this.setState({
                    showSpinner: false
                  });
                }, 50);
              }
            );
          }, 50);
        }
      );
    }
  }

  getItemProps(itemData, itemIndex, items) {
    const { showSlider } = this.state;
    const { meta, itemProps } = this.props;
    const desktopItems = showSlider
      ? [
          {
            id: "order",
            type: "order-dev",
            devices: "desktop",
            position: 105,
            roles: ["admin"],
            disabled: items.length < 2,
            config: {
              disable:
                itemIndex === 0
                  ? "prev"
                  : itemIndex === items.length - 1
                  ? "next"
                  : undefined,
              onChange: v => {
                switch (v) {
                  case "prev":
                    this.reorderItem(itemIndex, itemIndex - 1);
                    break;
                  case "next":
                    this.reorderItem(itemIndex, itemIndex + 1);
                    break;
                }
              }
            }
          },
          {
            id: "duplicate",
            type: "button",
            icon: "nc-duplicate",
            title: t("Duplicate"),
            position: 225,
            onChange: () => {
              this.cloneItem(itemIndex);
            }
          },
          {
            id: "remove",
            type: "button",
            icon: "nc-trash",
            title: t("Delete"),
            position: 250,
            onChange: () => {
              hideToolbar();
              this.removeItem(itemIndex);
            }
          }
        ]
      : [];
    const toolbarExtendSettings = {
      getItemsForDesktop: () => desktopItems,
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };

    const toolbarExtend = this.makeToolbarPropsFromConfig(
      toolbarExtendSettings
    );

    return {
      ...itemProps,
      meta: {
        ...meta,
        section: {
          ...meta.section,
          isSlider: showSlider
        }
      },
      toolbarExtend
    };
  }

  renderItemsContainer(items) {
    const { showSlider } = this.state;
    let ret;

    if (showSlider) {
      const { sliderDots, sliderArrows, sliderAnimation } = this.props;

      if (IS_EDITOR) {
        ret = (
          <SlickSlider
            className={`brz-slick-slider brz-slick-slider--${sliderAnimation}`}
            ref={el => {
              this.slider = el;
            }}
            slidesToShow={1}
            slidesToScroll={1}
            swipe={false}
            draggable={false}
            accessibility={false}
            arrows={sliderArrows !== "none"}
            useTransform={false}
            speed={500}
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
            fade={sliderAnimation === "fade"}
            verticalSwiping={sliderAnimation === "fade"}
            vertical={sliderAnimation === "vertical"}
          >
            {items}
          </SlickSlider>
        );
      }

      if (IS_PREVIEW) {
        const { sliderAutoPlay, sliderAutoPlaySpeed } = this.props;

        const responsive = [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ];

        // wrapped in div have problems with different padding per slide
        const _items = items.map((item, index) => (
          <div key={index}>{item}</div>
        ));

        ret = (
          <div
            className="brz-slick-slider brz-slick-slider__section"
            data-slides-to-show={1}
            data-slides-to-scroll={1}
            data-arrows={sliderArrows !== "none"}
            data-dots={sliderDots !== "none"}
            data-dots-class={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
            data-fade={sliderAnimation === "fade"}
            data-vertical={sliderAnimation === "vertical"}
            data-auto-play={sliderAutoPlay}
            data-auto-play-speed={sliderAutoPlaySpeed * 1000}
            data-swipe={true}
            data-responsive={encodeURIComponent(JSON.stringify(responsive))}
          >
            {_items}
            {sliderArrows !== "none" && (
              <ThemeIcon
                className="brz-hidden"
                type="editor"
                name={`right-arrow-${sliderArrows}`}
              />
            )}
          </div>
        );
      }
    } else {
      ret = items;
    }

    return ret;
  }

  renderForEdit(v) {
    const { showSlider, showSpinner } = this.state;
    const spinner = showSpinner && (
      <div className="brz-ed-portal__loading">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
    const items = showSlider
      ? super.renderForEdit(v)
      : // if we don't need to draw the slider
        // then only drawing the first item will be enough
        super.renderForEdit(v.slice(0, 1));

    return (
      <React.Fragment>
        {items}
        {spinner}
      </React.Fragment>
    );
  }
}

export default SectionItems;
