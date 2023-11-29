import classnames from "classnames";
import jQuery from "jquery";
import React from "react";
import ResizeAware from "react-resize-aware";
import Animation from "visual/component/Animation";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import Portal from "visual/component/Portal";
import { ProBlocked } from "visual/component/ProBlocked";
import { SortableZIndex } from "visual/component/Sortable/SortableZIndex";
import Sticky from "visual/component/Sticky";
import { ToolbarExtend, hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getOpenedMegaMenu } from "visual/editorComponents/Menu/MenuItem";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import {
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { IS_PRO } from "visual/utils/env";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import * as State from "visual/utils/stateMode";
import { capitalize } from "visual/utils/string";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleSection } from "./styles";
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

  componentDidMount() {
    const { type } = this.getValue();

    // Need rerender for Portal component
    if (type === "animated") {
      this.forceUpdate();
    }
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

  handleRemove = () => {
    this.selfDestruct();
  };

  handleStickyChange = (isSticky) => {
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
      membership,
      membershipRoles,
      showOnDesktop,
      showOnMobile,
      showOnTablet,
      cssID,
      cssClass,
      customAttributes,
      animationName,
      animationDuration,
      animationDelay,
      animationInfiniteAnimation,
      tabletAnimationName,
      tabletAnimationDuration,
      tabletAnimationDelay,
      tabletAnimationInfiniteAnimation,
      mobileAnimationName,
      mobileAnimationDuration,
      mobileAnimationDelay,
      mobileAnimationInfiniteAnimation,
      translations,
      translationsLangs
    } = v;

    return {
      membership,
      membershipRoles,
      showOnDesktop,
      showOnMobile,
      showOnTablet,
      cssID,
      cssClass,
      customAttributes,
      animationName,
      animationDuration,
      animationDelay,
      tabletAnimationName,
      tabletAnimationDuration,
      tabletAnimationDelay,
      tabletAnimationInfiniteAnimation,
      animationInfiniteAnimation,
      mobileAnimationName,
      mobileAnimationDuration,
      mobileAnimationDelay,
      mobileAnimationInfiniteAnimation,
      translations,
      translationsLangs
    };
  }

  dvv = (key) => {
    const v = this.getValue();
    const device = deviceModeSelector(getStore().getState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getAnimationClassName = (v, vs, vd) => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = this.dvv("animationName");
    const animationDuration = this.dvv("animationDuration");
    const animationDelay = this.dvv("animationDelay");
    const animationInfiniteAnimation = this.dvv("animationInfiniteAnimation");

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

    return classnames(
      css(
        `${this.getComponentId()}-animation-${slug}`,
        `${this.getId()}-animation-${slug}`,
        styleAnimation(v, vs, vd)
      )
    );
  };

  renderAnimated({ v, vs, vd }) {
    let sticky = (
      <Sticky
        refSelector={`#${this.getId()}`}
        type="animated"
        render={(isSticky) =>
          this.renderAnimatedSticky({ v, vs, vd, isSticky })
        }
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
        `${this.getComponentId()}`,
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
      <SortableZIndex zIndex={1}>
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
        render={(isSticky) => this.renderFixedSticky({ v, isSticky })}
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
      <SortableZIndex zIndex={1}>
        <div className={className} ref={this.stickyNode}>
          <ToolbarExtend position={toolbarPosition}>
            {this.renderStatic({ v })}
          </ToolbarExtend>
          {IS_EDITOR && <ResizeAware onResize={this.handleUpdateHeight} />}
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
    const { className, customClassName, cssClass, customAttributes, tagName } =
      v;
    return IS_PRO ? (
      <Animation
        component={tagName}
        componentProps={{
          ...parseCustomAttributes(customAttributes),
          id: this.getId(),
          style: this.getStyle(v),
          ref: this.sectionNode,
          className: classnames(
            "brz-section brz-section__header",
            className,
            cssClass || customClassName,
            css(
              `${this.getComponentId()}`,
              `${this.getId()}`,
              styleSection(v, vs, vd)
            )
          )
        }}
        animationClass={this.getAnimationClassName(v, vs, vd)}
      >
        {this[`render${capitalize(v.type)}`]({ v, vs, vd })}
      </Animation>
    ) : (
      <header className="brz-section brz-section__header">
        <ProBlocked
          text="Header"
          absolute={false}
          onRemove={this.handleRemove}
        />
      </header>
    );
  }

  renderLangOrMemberOrAll(content, v) {
    const { membership, membershipRoles, translationsLangs, translations } = v;

    const config = Config.getAll();
    const roles = JSON.parse(membershipRoles).join(",");
    const languages = JSON.parse(translationsLangs).join(",");
    const onlyCloud = !(isCloud(config) && isShopify(config));

    if (membership === "on" && translations === "off" && onlyCloud) {
      const startPlaceholder = makeStartPlaceholder({
        content: "{{display_by_roles}}",
        attr: { roles }
      });
      const endPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_roles}}"
      });
      return (
        <>
          {startPlaceholder}
          {content}
          {endPlaceholder}
        </>
      );
    } else if (membership === "off" && translations === "on" && onlyCloud) {
      const startPlaceholder = makeStartPlaceholder({
        content: "{{display_by_translations}}",
        attr: { translations: languages }
      });
      const endPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_translations}}"
      });
      return (
        <>
          {startPlaceholder}
          {content}
          {endPlaceholder}
        </>
      );
    } else if (membership === "on" && translations === "on" && onlyCloud) {
      const startRolesPlaceholder = makeStartPlaceholder({
        content: "{{display_by_roles}}",
        attr: { roles }
      });
      const endRolesPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_roles}}"
      });
      const startTranslationsPlaceholder = makeStartPlaceholder({
        content: "{{display_by_translations}}",
        attr: { translations: languages }
      });
      const endTranslationsPlaceholder = makeEndPlaceholder({
        content: "{{end_display_by_translations}}"
      });
      return (
        <>
          {startRolesPlaceholder}
          {startTranslationsPlaceholder}
          {content}
          {endTranslationsPlaceholder}
          {endRolesPlaceholder}
        </>
      );
    }

    return content;
  }

  renderForView(v, vs, vd) {
    const {
      type,
      tagName,
      className,
      anchorName,
      customClassName,
      customAttributes,
      cssID,
      cssClass
    } = v;

    const blockName = cssID ? cssID : anchorName || this.getId();

    const content = (
      <Animation
        component={tagName}
        componentProps={{
          ...parseCustomAttributes(customAttributes),
          id: blockName,
          style: this.getStyle(v),
          ref: this.sectionNode,
          className: classnames(
            "brz-section brz-section__header",
            className,
            cssClass || customClassName,
            css(
              `${this.getComponentId()}`,
              `${this.getId()}`,
              styleSection(v, vs, vd)
            )
          )
        }}
        animationClass={this.getAnimationClassName(v, vs, vd)}
      >
        {this[`render${capitalize(type)}`]({ v, vs, vd })}
      </Animation>
    );

    return this.renderLangOrMemberOrAll(content, v);
  }
}
