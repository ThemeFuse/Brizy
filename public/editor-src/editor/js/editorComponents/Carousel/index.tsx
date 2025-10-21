import { Obj, Str } from "@brizy/readers";
import classNames from "classnames";
import { isEqual, noop } from "es-toolkit";
import { get } from "es-toolkit/compat";
import React, { type ReactElement, type RefObject } from "react";
import { Subject, from } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from "rxjs/operators";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import EditorIcon from "visual/component/EditorIcon";
import Placeholder from "visual/component/Placeholder";
import { migrations } from "visual/editorComponents/Carousel/migrations";
import EditorComponent, {
  Props as EDProps
} from "visual/editorComponents/EditorComponent";
import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxyInstance";
import type { Meta } from "visual/editorComponents/ToolbarItemType";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pageSelector } from "visual/redux/selectors-new";
import type { PageCommon } from "visual/types/Page";
import { defaultPostsSources } from "visual/utils/api";
import { makePlaceholder } from "visual/utils/dynamicContent";
import {
  decodeSymbols,
  encodeSymbols,
  stringifyAttributes
} from "visual/utils/elements/posts";
import type {
  Attributes,
  ToolbarContext
} from "visual/utils/elements/posts/types";
import { getCurrentPageId } from "visual/utils/env";
import { percentageToPixels } from "visual/utils/meta";
import { attachRefs } from "visual/utils/react";
import * as json from "visual/utils/reader/json";
import Items from "./Items";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar/toolbarExtend";
import toolbarExtendParentFn from "./toolbar/toolbarExtendParent";
import type { $Subject, Props, State, Value } from "./types";
import { getLoopAttributes } from "./utils";

class Carousel extends EditorComponent<Value, Props, State> {
  subject$: Subject<$Subject | string> | undefined;
  unmounted = false;

  state = {
    dataLoading: false,
    data: undefined
  };

  static defaultValue = defaultValue;
  static defaultProps = {
    extendParentToolbar: noop,
    meta: {},
    onToolbarOpen: noop,
    onToolbarClose: noop,
    onToolbarEnter: noop,
    onToolbarLeave: noop
  };

  static get componentId(): ElementTypes.Carousel {
    return ElementTypes.Carousel;
  }

  async componentDidMount(): Promise<void> {
    const { dynamic } = this.getValue();

    if (dynamic === "on") {
      this.subscribeToData();
      this.reloadData();
    }

    const config = this.getGlobalConfig();

    const toolbarContext: ToolbarContext | undefined = await (async () => {
      try {
        const state = this.getReduxState();
        const page = pageSelector(state) as PageCommon;

        if (page) {
          const data = await defaultPostsSources(config, {
            page
          });

          return {
            collectionTypesInfo: data
          };
        }

        return {
          collectionTypesInfo: {
            sources: [],
            refsById: {}
          }
        };
      } catch (e) {
        console.error(e);
        return undefined;
      }
    })();
    const toolbarExtendParent = toolbarExtendParentFn(toolbarContext);
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      { allowExtend: false }
    );

    this.props.extendParentToolbar(toolbarExtend);

    const firstItem = get(toolbarContext, [
      "collectionTypesInfo",
      "sources",
      0,
      "id"
    ]);

    if (firstItem && !this.getValue2().v.source) {
      this.patchValue({ source: firstItem });
    }
  }

  componentDidUpdate(prevProps: EDProps<Value, Props>): void {
    const { dynamic: prevDynamic } = prevProps.dbValue;
    const hasPrevDynamicContent = prevDynamic === "on";
    const isCurrentDynamic = this.props.dbValue.dynamic === "on";

    if (!hasPrevDynamicContent && isCurrentDynamic) {
      this.subscribeToData();
    }

    if (isCurrentDynamic) {
      // NOTE: it is possible to check the patch inside handleValueChange
      // and call this.reloadData() only when the patch contains certain keys that should trigger data refetch
      // but this seems tedious and error prone, so we'll rely until then on rxjs distinctUntilChanged
      // to prevent unnecessary api calls
      this.reloadData();
    }
  }

  shouldComponentUpdate(
    nextProps: EDProps<Value, Props>,
    nextState: State
  ): boolean {
    return this.optionalSCU(nextProps) || this.compareState(nextState);
  }

  compareState(nextState: State): boolean {
    return !isEqual(this.state, nextState);
  }

  componentWillUnmount(): void {
    this.unmounted = true;

    this.subject$?.complete();
    this.subject$ = undefined;
  }

  subscribeToData(): void {
    // @ts-expect-error: Type 'Observable$Subject>' is missing the following properties from type 'Subject'
    this.subject$ = new Subject().pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => this.setState({ dataLoading: true })),
      switchMap((data) => {
        const { loop } = JSON.parse(Str.read(data) ?? "{}");
        const loops = [];

        if (loop) {
          const loopPlaceholder = makePlaceholder({
            content: `{{brizy_dc_post_loop}}`,
            attrStr: loop
          });
          loops.push(loopPlaceholder);
        }

        const globalConfig = this.getGlobalConfig();

        return from(
          DCApiProxyInstance.getDC(loops, {
            postId: getCurrentPageId(globalConfig),
            cache: false,
            globalConfig
          }).then((r) => {
            const [loop, pagination, tags] = r || [];
            return {
              loop: json.read(loop),
              pagination: json.read(pagination),
              tags: json.read(tags)
            };
          })
        );
      })
    );

    this.subject$?.subscribe((data) => {
      const { loop = { collection: [], config: undefined }, pagination = {} } =
        typeof data === "string" ? {} : data;

      if (!this.unmounted) {
        const { collection = [], config = {} } = loop || {};
        const context = collection.map((item) => {
          const dcConfig =
            Obj.readKey(item)(config) || Obj.readKey("*")(config);

          const groups =
            Obj.isObject(dcConfig) && Obj.isObject(dcConfig.dynamicContent)
              ? dcConfig.dynamicContent.groups
              : undefined;

          return {
            sheet: this.context.sheet,
            dynamicContent: {
              itemId: item,
              config: groups || {
                image: [],
                link: [],
                richText: []
              }
            }
          };
        });

        this.setState({
          dataLoading: false,
          data: {
            context,
            paginationInfo: pagination ?? { itemsPerPage: 0, totalCount: 0 }
          }
        });
      }
    });
  }

  reloadData(): void {
    const v = this.getValue();
    const attributes = {
      ...getLoopAttributes(v),
      content_type: "json"
    } as Attributes;

    const data = {
      loop: stringifyAttributes(attributes)
    };

    this.subject$?.next(JSON.stringify(data));
  }

  handleValueChange(value: Value, meta: Meta = {}): void {
    if (value.items?.length === 0) {
      this.selfDestruct();
    }
    if (Obj.isObject(meta.patch) && meta.patch.source !== undefined) {
      const metaSource = meta.patch.source;
      const currentSource = this.getValue().source;

      if (metaSource !== currentSource) {
        // INFO: reset field when source changes because each source has its own fields
        value = { ...value, field: "" };
      }

      super.handleValueChange(
        encodeSymbols({ ...value, tagsSource: "" }),
        meta
      );
    } else {
      super.handleValueChange(encodeSymbols(value), meta);
    }
  }

  getValue2(): { v: Value; vs: Value; vd: Value } {
    const values = super.getValue2();
    const v = decodeSymbols(values.v);

    return v === values.v ? values : Object.assign(values, { v });
  }

  getMeta(v: Value): Meta {
    const { meta } = this.props;
    const {
      slidesToShow,
      sliderPaddingType,
      sliderPadding,
      sliderPaddingSuffix,
      sliderPaddingLeft,
      sliderPaddingLeftSuffix,
      sliderPaddingRight,
      sliderPaddingRightSuffix,
      tabletSlidesToShow,
      tabletSliderPaddingType,
      tabletSliderPadding,
      tabletSliderPaddingSuffix,
      tabletSliderPaddingLeft,
      tabletSliderPaddingLeftSuffix,
      tabletSliderPaddingRight,
      tabletSliderPaddingRightSuffix,
      mobileSliderPaddingType,
      mobileSliderPadding,
      mobileSliderPaddingSuffix,
      mobileSliderPaddingLeft,
      mobileSliderPaddingLeftSuffix,
      mobileSliderPaddingRight,
      mobileSliderPaddingRightSuffix,
      mobileSlidesToShow
    } = v;

    const paddingW =
      sliderPaddingType === "grouped"
        ? percentageToPixels(
            sliderPadding * 2,
            sliderPaddingSuffix,
            meta.desktopW ?? 0
          )
        : percentageToPixels(
            sliderPaddingLeft,
            sliderPaddingLeftSuffix,
            meta.desktopW ?? 0
          ) +
          percentageToPixels(
            sliderPaddingRight,
            sliderPaddingRightSuffix,
            meta.desktopW ?? 0
          );

    const tabletPaddingW =
      tabletSliderPaddingType === "grouped"
        ? percentageToPixels(
            tabletSliderPadding * 2,
            tabletSliderPaddingSuffix,
            meta.tabletW ?? 0
          )
        : percentageToPixels(
            tabletSliderPaddingLeft,
            tabletSliderPaddingLeftSuffix,
            meta.tabletW ?? 0
          ) +
          percentageToPixels(
            tabletSliderPaddingRight,
            tabletSliderPaddingRightSuffix,
            meta.tabletW ?? 0
          );

    const mobilePaddingW =
      mobileSliderPaddingType === "grouped"
        ? percentageToPixels(
            mobileSliderPadding * 2,
            mobileSliderPaddingSuffix,
            meta.mobileW ?? 0
          )
        : percentageToPixels(
            mobileSliderPaddingLeft,
            mobileSliderPaddingLeftSuffix,
            meta.mobileW ?? 0
          ) +
          percentageToPixels(
            mobileSliderPaddingRight,
            mobileSliderPaddingRightSuffix,
            meta.mobileW ?? 0
          );

    const desktopW = (meta.desktopW ?? 0) - paddingW;
    const tabletW = (meta.tabletW ?? 0) - tabletPaddingW;
    const mobileW = (meta.mobileW ?? 0) - mobilePaddingW;

    return {
      ...meta,
      desktopW: Math.round(desktopW / slidesToShow),
      desktopWNoSpacing: Math.round(meta.desktopWNoSpacing ?? 0 / slidesToShow),
      tabletW: Math.round(tabletW / tabletSlidesToShow),
      tabletWNoSpacing: Math.round(
        meta.tabletWNoSpacing ?? 0 / tabletSlidesToShow
      ),
      mobileW: Math.round(mobileW / mobileSlidesToShow),
      mobileWNoSpacing: Math.round(
        meta.mobileWNoSpacing ?? 0 / mobileSlidesToShow
      ),
      inCarousel: true,
      inGrid: false
    };
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactElement {
    const { dataLoading, data } = this.state;
    const {
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderArrowsCustomFilename,
      sliderArrowsCustomName,
      sliderArrowsCustomType,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderAnimation,
      sliderDots,
      transitionSpeed,
      swipe,
      dynamic,
      columns,
      tabletSlidesToShow,
      mobileSlidesToShow,
      customCSS,
      stopSlider,
      arrowStyle,
      arrowPosition,
      sliderDotsCustomName,
      sliderDotsCustomType,
      sliderDotsCustomFilename
    } = v;

    const isDynamicContent = dynamic === "on";

    if (dataLoading && data === undefined) {
      return <Placeholder icon="posts" style={{ height: "300px" }} />;
    }

    const carouselClassName = classNames(
      "brz-carousel",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const loopAttributes = !isDynamicContent ? undefined : getLoopAttributes(v);

    // @ts-expect-error Type Partial<Value> is not assignable to type Value
    const toolbarConfig = toolbarConfigFn(v, this.handleValueChange);
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarConfig,
        undefined,
        {
          allowExtend: false,
          allowExtendFromThirdParty: true
        }
      ),
      className: carouselClassName,
      meta: this.getMeta(v),
      slidesToShow,
      slidesToScroll,
      sliderArrows,
      sliderArrowsCustomFilename,
      sliderArrowsCustomName,
      sliderArrowsCustomType,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderDots,
      sliderAnimation,
      transitionSpeed,
      swipe,
      columns,
      tabletSlidesToShow,
      mobileSlidesToShow,
      stopSlider: stopSlider === "on" && sliderAutoPlay === "on",
      isDynamicContent,
      dynamicData: data,
      dataLoading,
      loopAttributes,
      arrowStyle,
      arrowPosition,
      sliderDotsCustomName,
      sliderDotsCustomType,
      sliderDotsCustomFilename
    });

    return (
      <>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          {({ ref: cssRef }) => (
            <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
              {({ ref: contextMenuRef }: { ref: RefObject<HTMLElement> }) => (
                <>
                  {/* @ts-expect-error: Need transform EditorArrayComponents to ts */}
                  <Items
                    {...(itemsProps as Record<string, unknown>)}
                    containerRef={(el: HTMLElement) =>
                      attachRefs(el, [cssRef, contextMenuRef])
                    }
                  />
                </>
              )}
            </ContextMenu>
          )}
        </CustomCSS>
        {isDynamicContent && dataLoading && (
          <div className="brz-ed-portal__loading">
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          </div>
        )}
      </>
    );
  }
}

export default withMigrations(Carousel, migrations);
