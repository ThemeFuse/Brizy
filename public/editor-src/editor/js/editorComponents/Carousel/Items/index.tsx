import { Num, Obj } from "@brizy/readers";
import classnames from "classnames";
import React, {
  type FC,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type RefObject,
  createRef
} from "react";
import SlickSlider, { type ResponsiveObject } from "react-slick";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import type { ElementModel } from "visual/component/Elements/Types";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import type { SortablePluginOptions } from "visual/component/Sortable/plugin/types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { hideToolbar } from "visual/component/Toolbar";
import type { PortalToolbarType } from "visual/component/Toolbar/PortalToolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { EditorComponentContext } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import type { Model } from "visual/editorComponents/EditorComponent/types";
import type {
  Meta,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isView } from "visual/providers/RenderProvider";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { stringifyAttributes } from "visual/utils/elements/posts";
import type { Attributes } from "visual/utils/elements/posts/types";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";
import { attachRef } from "visual/utils/react";
import type { MValue } from "visual/utils/value";
import contextMenuExtendConfigFn from "../contextMenuExtend";
import { ArrowStyle } from "../types";
import { normalizeCarouselColumns, setDataSortable } from "../utils.common";
import type { OwnProps, Props } from "./types";

interface SliderArrowProps {
  className?: string;
  extraClassName: string;
  onClick?: VoidFunction;
  iconName: string;
  iconFilename?: string;
  iconType: string;
}

// className is added by react-slick
const SliderArrow: FC<SliderArrowProps> = ({
  className,
  extraClassName,
  onClick,
  iconName,
  iconFilename,
  iconType
}) => (
  <div className={classnames(className, extraClassName)} onClick={onClick}>
    <ThemeIcon name={iconName} type={iconType} filename={iconFilename} />
  </div>
);

const renderSliderDots = (
  dots: ReactNode,
  stopSlider: boolean
): ReactElement => (
  <ul>
    {dots}
    {stopSlider && (
      <li className="brz-slick-slider__pause">
        <ThemeIcon name="button-circle-pause" type="glyph" />
      </li>
    )}
  </ul>
);

class Items extends EditorArrayComponent {
  static defaultProps = {
    containerClassName: "",
    slidesToShow: 2,
    slidesToScroll: 1,
    sliderArrows: "none",
    sliderAnimation: "none",
    sliderDots: "none",
    meta: {},
    itemProps: {},
    sliceStartIndex: 0,
    sliceEndIndex: Infinity
  };
  slider: HTMLElement | null = null;
  reopenOnIndex: number | null = null;
  toolbarRef: MutableRefObject<PortalToolbarType | null> = createRef();
  openSlideId: MValue<NodeJS.Timeout>;

  static get componentId(): ElementTypes.CarouselItems {
    return ElementTypes.CarouselItems;
  }

  componentDidMount(): void {
    setDataSortable(this.slider);
  }

  componentDidUpdate(nextProps: Props): void {
    const { slidesToShow, slidesToScroll } = this.props;

    if (
      slidesToShow !== nextProps.slidesToShow ||
      slidesToScroll !== nextProps.slidesToScroll
    ) {
      setDataSortable(this.slider);
    }

    if (this.toolbarRef.current) {
      this.openSlideId = setTimeout(() => {
        this.toolbarRef?.current?.show();
        this.reopenOnIndex = null;
        this.toolbarRef.current = null;
      }, 250);
    }
  }

  componentWillUnmount(): void {
    clearTimeout(this.openSlideId);
  }

  handleRefSlider = (ref: SlickSlider): void => {
    if (ref) {
      const { list } = ref.innerSlider ?? {};
      const { containerRef } = this.props;

      if (list) {
        this.slider = list;
        attachRef(list, containerRef as RefObject<HTMLDivElement>);
      }
    }
  };

  handleSliderAfterChange = (): void => {
    setDataSortable(this.slider);
  };

  handleValueChange(value: ElementModel, meta: Meta = {}): void {
    const { arrayOperation } = meta;
    const afterCloneOrRemove =
      arrayOperation === "insert" || arrayOperation === "remove";
    const newValue =
      afterCloneOrRemove && Array.isArray(value)
        ? normalizeCarouselColumns(value)
        : value;

    if (afterCloneOrRemove) {
      setDataSortable(this.slider);
    }
    super.handleValueChange(newValue as ElementModel, meta);
  }

  handleSortableAcceptElements: SortablePluginOptions["acceptElements"] = (
    from,
    to
  ) => {
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

  addColumn = (itemIndex: number): void => {
    const v: Model<ElementModel[]> = this.getValue() as unknown as Model<
      ElementModel[]
    >;

    const lastElement = v[itemIndex - 1];
    const lastElementValue = Obj.readKey("value")(lastElement) ?? {};

    const emptyItemData = {
      ...lastElement,
      value: { ...lastElementValue, items: [] }
    };
    this.insertItem(itemIndex, emptyItemData);
  };

  getParentRef = (
    node: HTMLElement
  ): MValue<MutableRefObject<PortalToolbarType | null>> => {
    const visibleSlide = node?.closest(".slick-active");
    if (visibleSlide) {
      return this.toolbarRef;
    }
    return undefined;
  };

  getItemProps(
    _: unknown,
    itemIndex: number,
    items: ReactNode[]
  ): Record<string, unknown> {
    const { meta, slidesToShow, isDynamicContent } = this.props;
    let { toolbarExtend } = this.props;

    if (!isDynamicContent) {
      const cloneRemoveConfig = {
        getItems: (): ToolbarItemType[] => [
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
              onChange: (v: string) => {
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
          ...((items.length > (Num.read(slidesToShow) ?? 0)
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
            : []) as ToolbarItemType[])
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

  getProps(): OwnProps {
    return this.props as unknown as OwnProps;
  }

  renderItemWrapper(
    item: ReactNode,
    itemKey: string,
    itemIndex: number
  ): ReactElement {
    if (isView(this.props.renderContext)) {
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

  renderSlider(content: ReactNode): ReactElement {
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
      mobileSlidesToShow,
      stopSlider,
      sliderArrowsCustomFilename,
      sliderArrowsCustomName,
      sliderArrowsCustomType,
      arrowStyle,
      arrowPosition,
      sliderDotsCustomName,
      sliderDotsCustomType,
      sliderDotsCustomFilename
    } = this.getProps();

    let arrowName = "";
    let arrowType = "";
    let arrowFilename = "";

    if (sliderArrows === "custom") {
      arrowName = sliderArrowsCustomName;
      arrowType = sliderArrowsCustomType;
      arrowFilename = sliderArrowsCustomFilename;
    } else {
      arrowName = `right-arrow-${sliderArrows}`;
      arrowType = "editor";
    }

    const shouldRenderArrow = arrowStyle !== ArrowStyle.style3 && !!arrowName;

    const isPreview = isView(this.props.renderContext);
    const isStyle2 = arrowStyle === ArrowStyle.style2;

    const classNames = classnames(
      "brz-carousel__slider",
      isStyle2 && [
        "brz-carousel__slider--arrows-custom-position",
        `brz-carousel__slider--arrow-${arrowPosition}`
      ],
      !isPreview && `brz-carousel__slider--${sliderAnimation}`
    );

    if (isPreview) {
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
          className={classNames}
          data-slides-to-show={slidesToShow}
          data-slides-to-scroll={slidesToScroll}
          data-arrows={sliderArrows !== "none"}
          data-dots={sliderDots !== "none"}
          data-dots-class={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
          data-auto-play={sliderAutoPlay === "on"}
          data-auto-play-speed={(Num.read(sliderAutoPlaySpeed) ?? 0) * 1000}
          data-swipe={swipe === "on"}
          data-fade={sliderAnimation === "fade"}
          data-transition-speed={transitionSpeed}
          data-responsive={encodeURIComponent(JSON.stringify(responsive))}
        >
          {content}
          {shouldRenderArrow && (
            <ThemeIcon
              name={arrowName}
              type={arrowType}
              filename={arrowFilename}
              className="brz-hidden"
            />
          )}
          {sliderDots === "custom" && sliderDotsCustomName && (
            <ThemeIcon
              name={sliderDotsCustomName}
              type={sliderDotsCustomType}
              filename={sliderDotsCustomFilename}
              className="brz-carousel-dot-custom brz-hidden"
            />
          )}
          {!!stopSlider && (
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

    const settings: ResponsiveObject[] = [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: Num.read(tabletSlidesToShow) ?? 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: Num.read(mobileSlidesToShow) ?? 1,
          slidesToScroll: 1
        }
      }
    ];

    return (
      <SlickSlider
        ref={this.handleRefSlider}
        className={classNames}
        slidesToShow={Num.read(slidesToShow) ?? 1}
        slidesToScroll={Num.read(slidesToScroll) ?? 0}
        swipe={false}
        draggable={false}
        accessibility={false}
        arrows={shouldRenderArrow}
        useTransform={false}
        speed={500}
        fade={sliderAnimation === "fade"}
        customPaging={() => {
          const isCustomDots = sliderDots === "custom";
          if (isCustomDots && sliderDotsCustomName) {
            return (
              <button>
                <ThemeIcon
                  name={sliderDotsCustomName}
                  type={sliderDotsCustomType}
                  filename={sliderDotsCustomFilename}
                  className="brz-carousel-dot-custom"
                />
              </button>
            );
          }
          return <button />;
        }}
        appendDots={(dots) => renderSliderDots(dots, !!stopSlider)}
        nextArrow={
          <SliderArrow
            iconName={arrowName}
            iconType={arrowType}
            iconFilename={arrowFilename}
            extraClassName="brz-slick-slider__arrow brz-slick-slider__arrow-next"
          />
        }
        prevArrow={
          <SliderArrow
            iconName={arrowName}
            iconType={arrowType}
            iconFilename={arrowFilename}
            extraClassName="brz-slick-slider__arrow brz-slick-slider__arrow-prev"
          />
        }
        dots={sliderDots !== "none"}
        dotsClass={`brz-slick-slider__dots brz-slick-slider__dots--${sliderDots}`}
        responsive={settings}
        afterChange={this.handleSliderAfterChange}
      >
        {content}
      </SlickSlider>
    );
  }

  renderForEdit(v: ElementModel[]): ReactElement {
    const { className, isDynamicContent, dynamicData } = this.getProps();
    const context = dynamicData?.context ? dynamicData.context : [];

    const content =
      isDynamicContent && context.length > 0
        ? context.map((context) => (
            <EditorComponentContext.Provider
              key={context.dynamicContent.itemId}
              value={context}
            >
              {super.renderForEdit(v.slice(0, 1))}
            </EditorComponentContext.Provider>
          ))
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

  renderForView(_v: ElementModel): ReactElement {
    const { className, style, isDynamicContent } = this.props;
    const v = Array.isArray(_v) ? _v : [_v];
    const items = isDynamicContent ? v.slice(0, 1) : v;
    let content: ReactElement[] | ReactElement = items.map(this.renderItem);

    if (isDynamicContent) {
      content = this.renderForViewDynamic(content);
    }

    const styles = Obj.isObject(style) ? style : undefined;

    return (
      <div className={className} style={styles}>
        {this.renderSlider(content)}
      </div>
    );
  }

  renderForViewDynamic(content: ReactElement[]): ReactElement {
    const { loopAttributes } = this.props;
    const stringifiedAttributes = stringifyAttributes(
      loopAttributes as Attributes
    );
    const startPlaceholder = makeStartPlaceholder({
      content: "{{brizy_dc_post_loop}}",
      attrStr: stringifiedAttributes
    });
    const endPlaceholder = makeEndPlaceholder({
      content: "{{end_brizy_dc_post_loop}}"
    });

    return (
      <>
        {startPlaceholder}
        {content}
        {endPlaceholder}
      </>
    );
  }
}

export default Items;
