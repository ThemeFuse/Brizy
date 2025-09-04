import classnames from "classnames";
import React from "react";
import SlickSlider from "react-slick";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";

// className is added by react-slick
const SliderArrow = ({ className, extraClassName, onClick, icon }) => (
  <div className={classnames(className, extraClassName)} onClick={onClick}>
    <ThemeIcon name={icon} type="editor" />
  </div>
);

const renderSliderDots = (dots, stopSlider) => (
  <ul>
    {dots}
    {stopSlider && (
      <li className="brz-slick-slider__pause">
        <ThemeIcon name="button-circle-pause" type="glyph" />
      </li>
    )}
  </ul>
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
    const toolbarExtendSettings = {
      getItems: () => {
        return showSlider
          ? [
              {
                id: "order",
                type: "order",
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
                  onChange: (v) => {
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
                devices: "desktop",
                config: {
                  icon: "nc-duplicate",
                  title: t("Duplicate"),
                  reverseTheme: true
                },
                position: 225,
                onClick: () => {
                  this.cloneItem(itemIndex);
                }
              },
              {
                id: "remove",
                type: "button",
                devices: "desktop",
                config: {
                  icon: "nc-trash",
                  title: t("Delete"),
                  reverseTheme: true
                },
                position: 250,
                onClick: () => {
                  hideToolbar();
                  this.removeItem(itemIndex);
                }
              }
            ]
          : [];
      }
    };

    const toolbarExtend = this.makeToolbarPropsFromConfig2(
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

  handleKeyDown = (e, { keyName, id }) => {
    e.preventDefault();
    const v = this.getValue();
    const itemIndex = v.findIndex(({ value: { _id } }) => _id === id);
    switch (keyName) {
      case "ctrl+M":
      case "cmd+M":
      case "right_cmd+M":
        return this.handleOpenRightSidebar("styles");
      case "alt+D":
      case "ctrl+D":
      case "cmd+D":
      case "right_cmd+D":
        return this.cloneItem(itemIndex);
      case "alt+C":
      case "ctrl+C":
      case "cmd+C":
      case "right_cmd+C":
        return this.copy(itemIndex);
      case "alt+shift+V":
      case "ctrl+shift+V":
      case "cmd+shift+V":
      case "right_cmd+shift+V":
      case "shift+alt+V":
      case "shift+ctrl+V":
      case "shift+cmd+V":
      case "shift+right_cmd+V":
        return this.pasteStyles(itemIndex);
      case "alt+del":
      case "ctrl+del":
      case "cmd+del":
      case "right_cmd+del":
        return this.removeItem(itemIndex);
    }
  };

  renderItemWrapper(item, itemKey) {
    const shortcuts = ["copy", "pasteStyles", "delete", "showSidebarStyling"];
    const { isSlider } = this.props.meta.section;

    if (isSlider) {
      shortcuts.push("duplicate");
    }

    return (
      <HotKeys
        key={itemKey}
        shortcutsTypes={shortcuts}
        id={itemKey}
        onKeyDown={this.handleKeyDown}
      >
        {item}
      </HotKeys>
    );
  }

  updateCurrentSlide = () => {
    // In section sliders using fade mode, multiple slides are stacked.
    // We set a zIndex attribute on the current slide to enable proper drag & drop.
    const sliderList = this.slider?.innerSlider?.list;
    if (!sliderList) return;

    const disabledAttr = makeAttr("sortable-disabled");

    sliderList.querySelectorAll(".slick-slide").forEach((slide) => {
      const isCurrent = slide.classList.contains("slick-current");

      if (isCurrent) {
        slide.removeAttribute(disabledAttr);
      } else {
        slide.setAttribute(disabledAttr, "true");
      }
    });
  };

  renderItemsContainer(items) {
    const { showSlider } = this.state;
    let ret;

    if (showSlider) {
      const { sliderDots, sliderArrows, sliderAnimation, stopSlider } =
        this.props;

      if (isEditor(this.props.renderContext)) {
        ret = (
          <SlickSlider
            className={`brz-slick-slider brz-slick-slider--${sliderAnimation}`}
            ref={(el) => {
              this.slider = el;
            }}
            afterChange={this.updateCurrentSlide}
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
            appendDots={(dots) => renderSliderDots(dots, stopSlider)}
            dotsClass={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
            fade={sliderAnimation === "fade"}
            vertical={sliderAnimation === "vertical"}
          >
            {items}
          </SlickSlider>
        );
      }

      if (isView(this.props.renderContext)) {
        const {
          sliderAutoPlay,
          sliderAutoPlaySpeed,
          sliderAnimation,
          sliderAnimationSpeed
        } = this.props;

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
            data-animation-speed={sliderAnimationSpeed * 1000}
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
            {stopSlider && (
              <>
                <ThemeIcon
                  name="button-circle-pause"
                  type="glyph"
                  className="brz-hidden button-pause"
                />
                <ThemeIcon
                  name="button-circle-play"
                  type="glyph"
                  className="brz-hidden button-play"
                />
              </>
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
