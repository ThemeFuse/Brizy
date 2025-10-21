import classnames from "classnames";
import React, { createRef } from "react";
import { ContextMenuExtend } from "visual/component/ContextMenu";
import { TextEditor } from "visual/component/Controls/TextEditor";
import HotKeys from "visual/component/HotKeys";
import Sortable from "visual/component/Sortable";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { EditorComponentContext } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { isWp } from "visual/global/Config";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { getLoopName, stringifyAttributes } from "visual/utils/elements/posts";
import { applyFilter } from "visual/utils/filters";
import {
  makeAttr,
  makeDataAttr,
  makeDataAttrString
} from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { DynamicContentHelper } from "../WordPress/common/DynamicContentHelper";
import contextMenuExtendConfigFn from "./contextMenuExtend";
import { disconnect, observe } from "./resizeObserver";

export default class Items extends EditorArrayComponent {
  node = createRef();
  isotope = null;

  static get componentId() {
    return "Posts.Items";
  }

  static defaultProps = {
    className: "",
    showPagination: false,
    toolbarExtendPagination: {},
    showFilter: false,
    filterStyle: "",
    toolbarExtendFilter: {},
    loopAttributes: {},
    meta: {}
  };

  isWp = isWp(this.getGlobalConfig());

  componentDidMount() {
    const { needMasonry } = this.props;
    if (needMasonry && this.node.current) {
      this.observeItems();
      this.initIsotope();
    }
  }

  componentDidUpdate(prevProps) {
    const { needMasonry, isLoading } = this.props;
    const { needMasonry: prevNeedMasonry, isLoading: prevIsLoading } =
      prevProps;

    if (needMasonry !== prevNeedMasonry) {
      if (needMasonry && this.node.current) {
        this.observeItems();
        this.initIsotope();
      } else {
        this.destroyIsotope();
      }
    }

    if (needMasonry && prevIsLoading && !isLoading) {
      this.observeItems();
      this.reinitIsotope();
    }
  }

  componentWillUnmount() {
    if (this.isotope) {
      this.isotope.destroy();
    }

    if (this.node.current) {
      this.node.current.childNodes.forEach((child) => {
        disconnect(child);
      });
      this.node.current = null;
    }
  }

  getItemProps() {
    return {
      meta: this.props.meta
    };
  }

  getLoopAttributesString() {
    return stringifyAttributes(this.props.loopAttributes);
  }

  getLoopTagsAttributesString() {
    return stringifyAttributes(this.props.loopTagsAttributes);
  }

  getLoopItemFilter() {
    const { loopTagsAttributes, showFilter } = this.props;

    if (loopTagsAttributes && showFilter) {
      return makePlaceholder({
        content: "{{brizy_dc_post_terms}}",
        attr: { taxonomy: loopTagsAttributes.tax }
      });
    }

    return undefined;
  }

  handleSortableAcceptElements = (from) => {
    const meta = this.props.meta;
    const sortableType = makeDataAttrString({
      name: "sortable-type",
      value: "row"
    });
    const sortableElement = makeDataAttrString({
      name: "sortable-element",
      value: "true"
    });

    if (meta.row && meta.row.isInner) {
      if (from.elementType === "column" || from.elementType === "row") {
        return false;
      }

      if (from.elementType === "addable") {
        const addableSubtype = from.elementNode.getAttribute(
          makeAttr("sortable-subtype")
        );

        return addableSubtype !== "row" && addableSubtype !== "columns";
      }
    } else {
      if (from.elementType === "row" || from.elementType === "column") {
        return (
          from.elementNode.querySelector(
            `${sortableType}${sortableElement}`
          ) === null // hasn't inner row (thus avoiding level 3 columns)
        );
      }
    }

    return true;
  };

  renderItemWrapper(item, itemKey, itemIndex) {
    const contextMenuExtendConfig = contextMenuExtendConfigFn(itemIndex);
    const keyNames = ["alt+C", "alt+shift+V", "shift+alt+V"];
    const shortcutsTypes = ["copy", "pasteStyles"];

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
          <div
            className="brz-posts__item"
            {...makeDataAttr({
              name: "filter",
              value: this.getLoopItemFilter()
            })}
          >
            {item}
          </div>
        </HotKeys>
      </ContextMenuExtend>
    );
  }

  renderTagsForEdit() {
    const {
      toolbarExtendFilter,
      filterStyle,
      allTag,
      data,
      handleAllTagChange
    } = this.props;
    const { tags = [] } = data;
    const allTags = [{ name: allTag }, ...tags];
    const listClassName = classnames(
      "brz-ul brz-posts__filter",
      `brz-posts__filter--${filterStyle}`
    );

    return (
      allTags.length > 1 && (
        <div className="brz-posts__filter-wrapper">
          <ul className={listClassName}>
            {allTags.map((tag, index) => {
              const itemClassName = classnames(
                "brz-li brz-posts__filter__item",
                `brz-posts__filter__item--${filterStyle}`,
                { "brz-posts-filter__item--active": index === 0 }
              );

              return (
                <Toolbar key={index} {...toolbarExtendFilter}>
                  {({ ref }) => (
                    <li className={itemClassName} ref={ref}>
                      {tag.name === allTag ? (
                        <TextEditor
                          value={allTag}
                          onChange={handleAllTagChange}
                        />
                      ) : (
                        tag.name
                      )}
                    </li>
                  )}
                </Toolbar>
              );
            })}
          </ul>
        </div>
      )
    );
  }

  renderPaginationForEdit() {
    const loopAttributes = this.getLoopAttributesString();
    const className = "brz-posts__pagination__wrapper";
    const placeholder = makePlaceholder({
      content: "{{brizy_dc_post_loop_pagination}}",
      attrStr: loopAttributes
    });

    return (
      <Toolbar {...this.props.toolbarExtendPagination}>
        {({ ref }) => (
          <Wrapper
            {...this.makeWrapperProps({
              className,
              ref
            })}
          >
            <DynamicContentHelper
              placeholder={placeholder}
              tagName="div"
              placeholderIcon="wp-post-info"
              blocked={false}
            />
          </Wrapper>
        )}
      </Toolbar>
    );
  }

  renderForEdit(v) {
    const { className, showFilter, showPagination, data, containerRef } =
      this.props;
    const item = super.renderForEdit(v);
    const items = data?.context.map((context) => (
      <EditorComponentContext.Provider
        key={context.dynamicContent.itemId}
        value={context}
      >
        {item}
      </EditorComponentContext.Provider>
    ));

    return (
      <Sortable
        path={this.getId()}
        type="posts"
        acceptElements={this.handleSortableAcceptElements}
      >
        <div className={className}>
          {showFilter && this.renderTagsForEdit()}
          <div
            className="brz-posts__wrapper"
            ref={(el) => attachRefs(el, [this.node, containerRef])}
          >
            {items}
          </div>
          {showPagination && this.renderPaginationForEdit()}
        </div>
      </Sortable>
    );
  }

  renderForView(v) {
    return this.isWp ? this.renderForViewWP(v) : this.renderForViewCloud(v);
  }

  renderForViewWP(v) {
    const { type, className, style, showPagination, showFilter } = this.props;
    const item = v.map(this.renderItem);

    const postLoopName = getLoopName(type);
    const loopAttributes = this.getLoopAttributesString();
    const startPlaceholder = makeStartPlaceholder({
      content: `{{${postLoopName}}}`,
      attrStr: loopAttributes
    });
    const endPlaceholder = makeEndPlaceholder({
      content: `{{end_${postLoopName}}}`
    });
    const filterPlaceholder = showFilter
      ? makePlaceholder({
          content: "{{brizy_dc_post_loop_tags}}",
          attrStr: this.getLoopTagsAttributesString()
        })
      : undefined;
    const paginationPlaceholder = showPagination
      ? makePlaceholder({
          content: "{{brizy_dc_post_loop_pagination}}",
          attrStr: loopAttributes
        })
      : undefined;

    return (
      <div className={className} style={style}>
        {filterPlaceholder}
        <div className="brz-posts__wrapper">
          {startPlaceholder}
          {super.renderItemsContainer(item)}
          {endPlaceholder}
        </div>
        {paginationPlaceholder}
      </div>
    );
  }

  renderForViewCloud(v) {
    const { className, style, showPagination } = this.props;
    const item = v.map(this.renderItem);
    const loopAttributes = this.getLoopAttributesString();
    const startPlaceholder = makeStartPlaceholder({
      content: "{{brizy_dc_post_loop}}",
      attrStr: loopAttributes
    });
    const endPlaceholder = makeEndPlaceholder({
      content: "{{end_brizy_dc_post_loop}}"
    });
    const paginationPlaceholder = showPagination
      ? makePlaceholder({
          content: "{{brizy_dc_post_loop_pagination}}",
          attrStr: loopAttributes
        })
      : undefined;

    return (
      <div className={className} style={style}>
        <div className="brz-posts__wrapper">
          {startPlaceholder}
          {super.renderItemsContainer(item)}
          {endPlaceholder}
        </div>
        {paginationPlaceholder}
      </div>
    );
  }

  initIsotope = () => {
    const Isotope = this.getIsotopeLib();
    if (Isotope && this.node.current) {
      this.isotope = new Isotope(this.node.current, {
        itemSelector: ".brz-posts__item",
        layoutMode: "masonry"
      });
    }
  };

  observeItems = () => {
    if (this.node.current) {
      this.node.current.childNodes.forEach((child) => {
        observe(child, this.handleResize);
      });
    }
  };

  handleResize = () => {
    if (this.node.current && this.isotope) {
      this.isotope.layout();
    }
  };

  getIsotopeLib() {
    return applyFilter("getLibs", {}).Isotope;
  }

  reinitIsotope = () => {
    this.destroyIsotope();
    this.initIsotope();
  };

  destroyIsotope = () => {
    if (this.isotope) {
      this.isotope.destroy();
      this.isotope = null;
    }
  };
}
