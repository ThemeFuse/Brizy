import classnames from "classnames";
import React from "react";
import { from, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap
} from "rxjs/operators";
import { noop } from "underscore";
import { getCurrentPageId } from "visual/bootstraps/editor/getCurrentPageId";
import ContextMenu from "visual/component/ContextMenu";
import CustomCSS from "visual/component/CustomCSS";
import EditorIcon from "visual/component/EditorIcon";
import Placeholder from "visual/component/Placeholder";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxy";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import Config from "visual/global/Config";
import {
  isCloud,
  isCollectionPage,
  isCustomerPage
} from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { pageSelector } from "visual/redux/selectors";
import { getPostsSourceRefs } from "visual/utils/api";
import { css } from "visual/utils/cssStyle";
import { tabletSyncOnChange } from "visual/utils/onChange";
import * as json from "visual/utils/reader/json";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import Items from "./Items";
import { migrations } from "./migrations";
import * as sidebarExtendFilter from "./sidebarExtendFilter";
import * as sidebarExtendPagination from "./sidebarExtendPagination";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtendFilter from "./toolbarExtendFilter";
import * as toolbarExtendPagination from "./toolbarExtendPagination";
import toolbarExtendParentFn from "./toolbarExtendParent";
import { getCollectionTypesInfo } from "./toolbarExtendParent/utils";
import { getLoopAttributes, getLoopTagsAttributes } from "./utils";
import {
  decodeSymbols,
  encodeSymbols,
  getLoopName,
  stringifyAttributes
} from "./utils.common";

export class Posts extends EditorComponent {
  static get componentId() {
    return "Posts";
  }

  static defaultValue = defaultValue;

  handleAllTagChange = (allTag) => {
    this.patchValue({ allTag });
  };

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

    if (IS_EDITOR) {
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
            loops.push(
              `{{${loopName} ${loop}}}`,
              `{{brizy_dc_post_loop_pagination ${loop}}}`
            );
          }
          if (loopTags) {
            loops.push(`{{brizy_dc_post_loop_tags ${loopTags}}}`);
          }

          return from(
            DCApiProxyInstance.getDC(loops, {
              postId: getCurrentPageId(),
              cache: false
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
            dynamicContent: {
              itemId: item,
              config: (config[item] || config["*"])?.dynamicContent || {
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

  async componentDidMount() {
    this.reloadData();

    const toolbarContext = await (async () => {
      try {
        const state = this.getReduxState();
        const page = pageSelector(state);

        if (isCollectionPage(page)) {
          return {
            collectionTypesInfo: await getPostsSourceRefs(
              page.collectionType.id
            )
          };
        }

        if (isCustomerPage(page)) {
          return {
            collectionTypesInfo: await getPostsSourceRefs(page.id)
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

    const firstItem =
      toolbarContext?.collectionTypesInfo?.collectionTypes[0]?.id;
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

    if (isWp(Config.getAll())) {
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

    const { type, pagination, filter, filterStyle, allTag } = v;
    const className = classnames(
      "brz-posts",
      { "brz-posts--masonry": filter === "on" },
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
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
      toolbarExtendPagination: this.makeToolbarPropsFromConfig2(
        toolbarExtendPagination,
        sidebarExtendPagination,
        { allowExtend: false }
      ),
      toolbarExtendFilter: this.makeToolbarPropsFromConfig2(
        toolbarExtendFilter,
        sidebarExtendFilter,
        { allowExtend: false }
      )
    });

    return (
      <>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <ContextMenu {...this.makeContextMenuProps(contextMenuConfig)}>
            <Items {...itemsProps} />
          </ContextMenu>
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
    const { type, pagination, filter } = v;
    const className = classnames(
      "brz-posts",
      { "brz-posts--masonry": filter === "on" },
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
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
  getValue: async () => {
    return IS_EDITOR && isCloud(Config.getAll())
      ? await getCollectionTypesInfo()
      : Promise.resolve(undefined);
  }
});
