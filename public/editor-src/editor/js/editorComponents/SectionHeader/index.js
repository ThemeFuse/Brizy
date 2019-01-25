import React from "react";
import classnames from "classnames";
import ResizeAware from "react-resize-aware";
import jQuery from "jquery";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Portal from "visual/component/Portal";
import Sticky from "visual/component/Sticky";
import SortableZIndex from "visual/component/Sortable/SortableZIndex";
import { ToolbarExtend, hideToolbar } from "visual/component/Toolbar";
import { currentTooltip } from "visual/component/Controls/Tooltip";
import { getStore } from "visual/redux/store";
import { updateGlobals } from "visual/redux/actionCreators";
import { uuid } from "visual/utils/uuid";
import { capitalize } from "visual/utils/string";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendConfig from "./toolbarExtend";

const STICKY_ITEM_INDEX = 1;

const fixedContainerPlus = ({ fixed = false, node = null, height = 0 }) => {
  const $adderBlock = jQuery(node).siblings(".brz-ed-container-plus");

  if (fixed) {
    $adderBlock.addClass("brz-ed-container-plus--fixed").css({
      top: `${height}px`
    });
  } else {
    $adderBlock.removeClass("brz-ed-container-plus--fixed").css({
      top: "auto"
    });
  }
};

class SectionHeader extends EditorComponent {
  static get componentId() {
    return "SectionHeader";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  state = {
    height: "auto"
  };

  isSticky = false;
  isUpdated = false;

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.height !== nextState.height;

    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentDidUpdate() {
    if (this.isUpdated) {
      return;
    }

    const { type } = this.getValue();

    if (type !== "fixed") {
      fixedContainerPlus({
        fixed: false,
        node: this.sectionNode
      });
    }
  }

  handleValueChange(newValue, meta) {
    if (meta.patch.type && meta.patch.type !== "fixed") {
      this.isUpdated = true;

      this.setState(
        {
          height: "auto"
        },
        () => (this.isUpdated = false)
      );
    }

    this.props.onChange(newValue, meta);
  }

  handleSectionRef = el => {
    this.sectionNode = el;
  };

  handleStickyRef = el => {
    this.stickyNode = el;
  };

  handleStickyChange = isSticky => {
    hideToolbar();

    if (currentTooltip) {
      currentTooltip.hide();
    }

    if (this.getValue().type === "fixed") {
      fixedContainerPlus({
        fixed: isSticky,
        node: this.sectionNode,
        height: this.state.height
      });
      this.isSticky = isSticky;

      // Rerenders because state maybe old
      this.forceUpdate();
    } else {
      this.isSticky = false;
    }
  };

  handleUpdateHeight = () => {
    const { height } = this.stickyNode.getBoundingClientRect();

    fixedContainerPlus({
      fixed: this.isSticky,
      node: this.sectionNode,
      height
    });

    if (height !== this.state.height) {
      this.setState({
        height
      });
    }
  };

  getStyle(v) {
    return v.type === "fixed" ? { height: this.state.height } : null;
  }

  renderAnimated = () => {
    let sticky = (
      <Sticky
        refSelector={`#${this.getId()}`}
        type="animated"
        render={this.renderAnimatedSticky}
        onChange={this.handleStickyChange}
      />
    );

    if (IS_EDITOR) {
      // Render in #brz-ed-root because have problems with mmenu z-index
      const node = document.getElementById("brz-ed-root");

      sticky = (
        <Portal node={node} className="brz-ed-portal-section-header__sticky">
          {sticky}
        </Portal>
      );
    }

    return (
      <React.Fragment>
        {sticky}
        {this.renderStatic()}
      </React.Fragment>
    );
  };

  renderAnimatedSticky = isSticky => {
    const className = classnames("brz-section__header--animated", {
      "brz-section__header--animated-opened": isSticky
    });
    const stickyItemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: STICKY_ITEM_INDEX,
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig),
        meta: this.props.meta
      }
    });

    return (
      <SortableZIndex zindex={1}>
        <div className={className}>
          <ToolbarExtend position="fixed">
            <EditorArrayComponent {...stickyItemProps} />
          </ToolbarExtend>
        </div>
      </SortableZIndex>
    );
  };

  renderFixed = () => {
    return (
      <Sticky
        refSelector={`#${this.getId()}`}
        type="fixed"
        render={this.renderFixedSticky}
        onChange={this.handleStickyChange}
      />
    );
  };

  renderFixedSticky = isSticky => {
    const className = classnames("brz-section__header--fixed", {
      "brz-section__header--fixed-opened": isSticky
    });
    const toolbarPosition = isSticky ? "fixed" : "absolute";

    return (
      <SortableZIndex zindex={1}>
        <div className={className} ref={this.handleStickyRef}>
          <ToolbarExtend position={toolbarPosition}>
            {this.renderStatic()}
          </ToolbarExtend>
          <ResizeAware onResize={this.handleUpdateHeight} />
        </div>
      </SortableZIndex>
    );
  };

  renderStatic = () => {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: STICKY_ITEM_INDEX,
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig),
        meta: this.props.meta
      }
    });

    return <EditorArrayComponent {...itemsProps} />;
  };

  renderForEdit(v) {
    let className = "brz-section__header";
    let content = this[`render${capitalize(v.type)}`]();

    return (
      <section
        id={this.getId()}
        className={className}
        style={this.getStyle(v)}
        ref={this.handleSectionRef}
      >
        {content}
      </section>
    );
  }

  renderForView(v) {
    let content = this[`render${capitalize(v.type)}`]();

    return (
      <section
        id={v.anchorName || this.getId()}
        className="brz-section__header"
        data-uid={this.getId()}
      >
        {content}
      </section>
    );
  }

  // api
  becomeSaved() {
    const { blockId } = this.props;
    const dbValue = this.getDBValue();
    const store = getStore();
    const { savedBlocks = [] } = store.getState().globals.project;

    store.dispatch(
      updateGlobals("savedBlocks", [
        ...savedBlocks,
        {
          type: "SectionHeader",
          blockId,
          value: dbValue
        }
      ])
    );
  }

  becomeGlobal() {
    const { blockId } = this.props;
    const dbValue = this.getDBValue();
    const store = getStore();
    const { globalBlocks = {} } = store.getState().globals.project;
    const globalBlockId = uuid(10);

    store.dispatch(
      updateGlobals("globalBlocks", {
        ...globalBlocks,
        [globalBlockId]: {
          type: "SectionHeader",
          blockId,
          value: dbValue
        }
      })
    );

    this.props.onChange(
      {
        type: "GlobalBlock",
        blockId,
        value: { globalBlockId }
      },
      {
        intent: "replace_all"
      }
    );
  }

  becomeNormal() {
    const store = getStore();
    const { globalBlocks = {} } = store.getState().globals.project;
    const { globalBlockId } = this.props.meta;

    this.props.onChange(globalBlocks[globalBlockId], {
      intent: "replace_all"
    });
  }
}

export default SectionHeader;
