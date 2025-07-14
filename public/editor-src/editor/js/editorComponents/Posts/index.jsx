import classnames from "classnames";
import { noop } from "es-toolkit";
import React from "react";
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
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxyInstance";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { isWp } from "visual/global/Config/types/configs/WP";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { pageSelector } from "visual/redux/selectors";
import { defaultPostsSources, getCollectionTypesInfo } from "visual/utils/api";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getCurrentPageId } from "visual/utils/env";
import { tabletSyncOnChange } from "visual/utils/onChange";
import { attachRefs } from "visual/utils/react";
import * as json from "visual/utils/reader/json";
import Items from "./Items";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations";
import * as sidebarExtendFilter from "./sidebarExtendFilter";
import * as sidebarExtendPagination from "./sidebarExtendPagination";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtendFilter from "./toolbarExtendFilter";
import * as toolbarExtendPagination from "./toolbarExtendPagination";
import toolbarExtendParentFn from "./toolbarExtendParent";
import { getLoopAttributes, getLoopTagsAttributes } from "./utils";
import {
  decodeSymbols,
  encodeSymbols,
  getLoopName,
  stringifyAttributes
} from "./utils.common";

export class Posts extends EditorComponent {
  static defaultValue = defaultValue;
  static defaultProps = {
    extendParentToolbar: noop
  };
  state = {
    dataLoading: false,
    data: undefined
  };
  unmounted = false;
  subject$;

  constructor(props) {
    super(props);

    if (isEditor(this.props.renderContext)) {
      this.subject$ = new Subject().pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.setState({ dataLoading: true })),
        switchMap((data) => {
          const { loop, loopTags } = JSON.parse(data);
          const loops = [];
          const v = this.getValue();
          const loopName = getLoopName(v.type);

          if (loop) {
            const loopPlaceholder = makePlaceholder({
              content: `{{${loopName}}}`,
              attrStr: loop
            });
            const loopPaginationPlaceholder = makePlaceholder({
              content: "{{brizy_dc_post_loop_pagination}}",
              attrStr: loop
            });

            loops.push(loopPlaceholder, loopPaginationPlaceholder);
          }
          if (loopTags) {
            const placeholder = makePlaceholder({
              content: "{{brizy_dc_post_loop_tags}}",
              attrStr: loopTags
            });
            loops.push(placeholder);
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

      this.subject$.subscribe(({ loop, pagination, tags }) => {
        if (!this.unmounted) {
          const { collection = [], config = {} } = loop || {};
          const context = collection.map((item) => ({
            sheet: this.context.sheet,
            dynamicContent: {
              itemId: item,
              config: (config[item] || config["*"])?.dynamicContent?.groups || {
                image: [],
                link: [],
                richText: []
              }
            }
          }));

          this.setState({
            dataLoading: false,
            data: {
              context,
              tags: tags ?? [],
              paginationInfo: pagination ?? { itemsPerPage: 0, totalCount: 0 }
            }
          });
        }
      });
    }
  }

  static get componentId() {
    return "Posts";
  }

  handleAllTagChange = (allTag) => {
    this.patchValue({ allTag });
  };

  async componentDidMount() {
    if (isView(this.props.renderContext)) {
      return;
    }

    this.reloadData();

    const config = this.getGlobalConfig();

    const toolbarContext = await (async () => {
      try {
        // INFO: this "id" persists only in Shopify and arrive in "v" from shortcodes in next elements: ProductList, CollectionList, BlogPostList
        const { collectionTypeId } = this.getValue();
        const state = this.getReduxState();
        const page = pageSelector(state);

        if (page) {
          const { collectionFilters } = this.getComponentConfig() ?? {};

          const params = collectionFilters ? { collectionFilters } : {};

          const data = await defaultPostsSources(config, {
            page,
            filterManualId: collectionTypeId,
            ...params
          });

          return {
            collectionTypesInfo: data
          };
        }

        return {
          collectionTypesInfo: {
            collectionTypes: [],
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

    const firstItem = toolbarContext?.collectionTypesInfo?.sources[0]?.id;
    if (firstItem && !this.getValue2().v.source) {
      this.patchValue({ source: firstItem });
    }
  }

  componentDidUpdate() {
    // NOTE: it is possible to check the patch inside handleValueChange
    // and call this.reloadData() only when the patch contains certain keys that should trigger data refetch
    // but this seems tedious and error prone, so we'll rely until then on rxjs distinctUntilChanged
    // to prevent unnecessary api calls
    this.reloadData();
  }

  componentWillUnmount() {
    this.unmounted = true;

    this.subject$?.complete();
    this.subject$ = undefined;
  }

  reloadData() {
    const v = this.getValue();
    const data = {
      loop: stringifyAttributes(
        Object.assign({ content_type: "json" }, getLoopAttributes(v))
      )
    };

    if (isWp(this.getGlobalConfig())) {
      const loopAttr = getLoopTagsAttributes(v);

      if (loopAttr) {
        data.loopTags = stringifyAttributes(
          Object.assign({ content_type: "json" }, loopAttr)
        );
      }
    }

    this.subject$?.next(JSON.stringify(data));
  }

  handleValueChange(newValue, meta) {
    if (meta.patch.source !== undefined) {
      super.handleValueChange(
        encodeSymbols({ ...newValue, tagsSource: "" }),
        meta
      );
    } else {
      super.handleValueChange(encodeSymbols(newValue), meta);
    }
  }

  getValue2() {
    const values = super.getValue2();
    const v = decodeSymbols(values.v);

    return v === values.v ? values : Object.assign(values, { v });
  }

  getMeta(v) {
    const { meta } = this.props;
    const { gridColumn, padding, tabletGridColumn } = v;
    const desktopW = meta.desktopW / gridColumn;
    const desktopWNoSpacing = meta.desktopWNoSpacing / gridColumn;
    const tabletW = meta.tabletW / tabletGridColumn;
    const tabletWNoSpacing = meta.tabletWNoSpacing / tabletGridColumn;

    const tabletPadding = tabletSyncOnChange(v, "padding");

    return {
      ...meta,
      desktopW: Math.round((desktopW - padding) * 10) / 10,
      desktopWNoSpacing,
      tabletW: Math.round((tabletW - tabletPadding) * 10) / 10,
      tabletWNoSpacing,
      inGrid: false,
      posts: true
    };
  }

  renderForEdit(v, vs, vd) {
    const { data, dataLoading } = this.state;

    if (data === undefined) {
      return <Placeholder icon="posts" style={{ height: "300px" }} />;
    }

    const { type, pagination, filter, filterStyle, allTag, masonryFilter } = v;
    const className = classnames(
      "brz-posts",
      { "brz-posts--masonry": filter === "on" && masonryFilter === "on" },
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
    const itemsProps = this.makeSubcomponentProps({
      allTag,
      handleAllTagChange: this.handleAllTagChange,
      bindWithKey: "items",
      className,
      type,
      data,
      filterStyle,
      meta: this.getMeta(v),
      showPagination: pagination === "on",
      showFilter: filter === "on",
      needMasonry: filter === "on" && masonryFilter === "on",
      isLoading: dataLoading,
      toolbarExtendPagination: this.makeToolbarPropsFromConfig2(
        toolbarExtendPagination,
        sidebarExtendPagination,
        { allowExtend: false }
      ),
      toolbarExtendFilter: this.makeToolbarPropsFromConfig2(
        toolbarExtendFilter,
        sidebarExtendFilter,
        { allowExtend: false }
      ),
      loopAttributes: getLoopAttributes(v)
    });

    return (
      <>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          {({ ref: cssRef }) => (
            <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
              {({ ref: contextMenuRef }) => (
                <Items
                  {...itemsProps}
                  containerRef={(el) =>
                    attachRefs(el, [cssRef, contextMenuRef])
                  }
                />
              )}
            </ContextMenu>
          )}
        </CustomCSS>
        {dataLoading && (
          <div className="brz-ed-portal__loading">
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          </div>
        )}
      </>
    );
  }

  renderForView(v, vs, vd) {
    const { type, pagination, filter, masonryFilter } = v;
    const className = classnames(
      "brz-posts",
      { "brz-posts--masonry": filter === "on" && masonryFilter === "on" },
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
    const tagsAttribute = getLoopTagsAttributes(v);
    const itemsProps = this.makeSubcomponentProps({
      type,
      className,
      handleAllTagChange: this.handleAllTagChange,
      bindWithKey: "items",
      meta: this.getMeta(v),
      showPagination: pagination === "on",
      showFilter: filter === "on" && tagsAttribute,
      loopAttributes: getLoopAttributes(v),
      loopTagsAttributes: tagsAttribute
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
          <Items {...itemsProps} />
        </ContextMenu>
      </CustomCSS>
    );
  }
}

export default withMigrations(Posts, migrations, {
  getValue: async (renderContext, config) =>
    isEditor(renderContext)
      ? await getCollectionTypesInfo(config)
      : Promise.resolve(undefined)
});
