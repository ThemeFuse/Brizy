import React from "react";
import classnames from "classnames";
import ResizeAware from "react-resize-aware";
import { css } from "glamor";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import Portal from "visual/component-new/Portal";
import Sticky from "visual/component-new/Sticky";
import SortableZIndex from "visual/component-new//Sortable/SortableZIndex";
import { currentTooltip } from "visual/component/controls/Tooltip";
import { ToolbarExtend, hideToolbar } from "visual/component-new/Toolbar";
import { getStore } from "visual/redux/store";
import { updateGlobals } from "visual/redux/actionCreators";
import { uuid } from "visual/utils/uuid";
import { capitalize } from "visual/utils/string";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendConfig from "./toolbarExtend";

const STICKY_ITEM_INDEX = 1;
const ADD_BLOCK_Z_INDEX = 1051;

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

  shouldComponentUpdate(nextProps, nextState) {
    const stateUpdate = this.state.height !== nextState.height;

    return stateUpdate || this.optionalSCU(nextProps);
  }

  handleRef = el => {
    this.node = el;
  };

  // handleStickyClose = () => {
  //   if (currentTooltip) {
  //     currentTooltip.hide();
  //   }
  //   hideToolbar();

  //   if (this.state.isOpen) {
  //     this.setState({
  //       isOpen: false
  //     });
  //   }
  // };

  // handleStickyOpen = () => {
  //   if (currentTooltip) {
  //     currentTooltip.hide();
  //   }
  //   hideToolbar();

  //   if (!this.state.isOpen) {
  //     this.setState({
  //       isOpen: true
  //     });
  //   }
  // };

  handleUpdateHeight = () => {
    const { height } = this.node.getBoundingClientRect();

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
      />
    );

    if (IS_EDITOR) {
      sticky = (
        <Portal
          node={document.body}
          className="brz-ed-portal-section-header__sticky"
        >
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
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig)
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
        <div className={className}>
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
        toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig)
      }
    });

    return <EditorArrayComponent {...itemsProps} />;
  };

  renderForEdit(v) {
    let className = "brz-section__header";
    let content = this[`render${capitalize(v.type)}`]();

    // TODO: SEE WHAT TO DO WITH THE PLUS AFTER FIXED HEADER
    // className = classnames(
    //   className,
    //   isOpen &&
    //     String(
    //       css({
    //         "& + .brz-ed-container-plus": {
    //           position: "fixed",
    //           top: height,
    //           left: 0,
    //           width: "100%",
    //           zIndex: ADD_BLOCK_Z_INDEX
    //         }
    //       })
    //     )
    // );

    return (
      <section
        ref={this.handleRef}
        id={this.getId()}
        className={className}
        style={this.getStyle(v)}
      >
        {content}
      </section>
    );
  }

  renderForView(v) {
    let content = this[`render${capitalize(v.type)}`]();

    return (
      <section id={this.getId()} className="brz-section__header">
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
