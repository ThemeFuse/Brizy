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
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import { capitalize } from "visual/utils/string";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleSection } from "./styles";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import { getOpenedMegaMenu } from "visual/editorComponents/Menu/MenuItem";

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

export default class SectionHeader extends EditorComponent {
  static get componentId() {
    return "SectionHeader";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  state = {
    height: "auto"
  };

  isSticky = false;
  isUpdated = false;

  sectionNode = React.createRef();
  stickyNode = React.createRef();

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
        node: this.sectionNode.current
      });
    }
  }

  handleValueChange(newValue, meta) {
    if (meta.patch.type && meta.patch.type !== "fixed") {
      this.isUpdated = true;

      this.setState({ height: "auto" }, () => (this.isUpdated = false));
    }

    this.props.onChange(newValue, meta);
  }

  handleStickyChange = isSticky => {
    hideToolbar();

    const tooltip = getCurrentTooltip();

    if (tooltip) {
      tooltip.hide();
    }

    if (this.getValue().type === "fixed") {
      fixedContainerPlus({
        fixed: isSticky,
        node: this.sectionNode.current,
        height: this.state.height
      });
      this.isSticky = isSticky;

      // Rerenders because state maybe old
      this.forceUpdate();
    } else {
      this.isSticky = false;

      const megaMenu = getOpenedMegaMenu();

      if (megaMenu) {
        megaMenu.close();
      }
    }
  };

  handleUpdateHeight = () => {
    const { height } = this.stickyNode.current.getBoundingClientRect();

    fixedContainerPlus({
      fixed: this.isSticky,
      node: this.sectionNode.current,
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

  getMeta() {
    return {
      ...this.props.meta,
      section: {}
    };
  }

  getRerender(v) {
    const {
      showOnDesktop,
      showOnMobile,
      showOnTablet,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes,
      customAttributesPopulation
    } = v;

    return {
      showOnDesktop,
      showOnMobile,
      showOnTablet,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes,
      customAttributesPopulation
    };
  }

  renderAnimated({ v, vs, vd }) {
    let sticky = (
      <Sticky
        refSelector={`#${this.getId()}`}
        type="animated"
        render={isSticky => this.renderAnimatedSticky({ v, vs, vd, isSticky })}
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
      <>
        {sticky}
        {this.renderStatic({ v })}
      </>
    );
  }

  renderAnimatedSticky({ v, vs, vd, isSticky }) {
    const className = classnames(
      "brz-section__header--animated",
      { "brz-section__header--animated-closed": IS_EDITOR && !isSticky },
      { "brz-section__header--animated-opened": isSticky },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    const stickyItemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: STICKY_ITEM_INDEX,
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig
        ),
        meta: this.getMeta(v),
        rerender: this.getRerender(v)
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
  }

  renderFixed({ v }) {
    return (
      <Sticky
        refSelector={`#${this.getId()}`}
        type="fixed"
        render={isSticky => this.renderFixedSticky({ v, isSticky })}
        onChange={this.handleStickyChange}
      />
    );
  }

  renderFixedSticky({ v, isSticky }) {
    const className = classnames("brz-section__header--fixed", {
      "brz-section__header--fixed-opened": isSticky
    });
    const toolbarPosition = isSticky ? "fixed" : "absolute";

    return (
      <SortableZIndex zindex={1}>
        <div className={className} ref={this.stickyNode}>
          <ToolbarExtend position={toolbarPosition}>
            {this.renderStatic({ v })}
          </ToolbarExtend>
          <ResizeAware onResize={this.handleUpdateHeight} />
        </div>
      </SortableZIndex>
    );
  }

  renderStatic({ v }) {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: STICKY_ITEM_INDEX,
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig
        ),
        meta: this.getMeta(v),
        rerender: this.getRerender(v)
      }
    });

    return <EditorArrayComponent {...itemsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const {
      className,
      customClassName,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-section brz-section__header",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    return (
      <section
        id={this.getId()}
        className={classNameSection}
        style={this.getStyle(v)}
        ref={this.sectionNode}
        {...parseCustomAttributes(customAttributes)}
      >
        {this[`render${capitalize(v.type)}`]({ v, vs, vd })}
      </section>
    );
  }

  renderForView(v, vs, vd) {
    const {
      className,
      customClassName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-section brz-section__header",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    return (
      <section
        id={
          cssIDPopulation === ""
            ? v.anchorName || this.getId()
            : cssIDPopulation
        }
        className={classNameSection}
        data-uid={this.getId()}
        {...parseCustomAttributes(customAttributes)}
      >
        {this[`render${capitalize(v.type)}`]({ v, vs, vd })}
      </section>
    );
  }
}
