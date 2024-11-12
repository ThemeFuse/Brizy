import classnames from "classnames";
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
import EditorComponent, {
  Props as EDProps
} from "visual/editorComponents/EditorComponent";
import { getOpenedMegaMenu } from "visual/editorComponents/Menu/MenuItem";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import {
  makePlaceholder,
  makeEndPlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { isPro } from "visual/utils/env";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import * as State from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleSection } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";
import { STICKY_ITEM_INDEX, fixedContainerPlus } from "./utils";
import { Value, Meta, Props, RenderType, States } from "./type";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { ComponentsMeta } from "../EditorComponent/types";
import { MValue } from "visual/utils/value";
import { t } from "visual/utils/i18n";

export default class SectionHeader extends EditorComponent<
  Value,
  Props,
  States
> {
  static get componentId(): ElementTypes.SectionHeader {
    return ElementTypes.SectionHeader;
  }

  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  state: States = {
    height: "auto"
  };

  isSticky = false;
  isUpdated = false;

  sectionNode = React.createRef<HTMLDivElement>();
  stickyNode = React.createRef<HTMLDivElement>();

  shouldComponentUpdate(
    nextProps: EDProps<Value, Props>,
    nextState: States
  ): boolean {
    const stateUpdate = this.state.height !== nextState.height;

    return stateUpdate || this.optionalSCU(nextProps);
  }

  componentDidMount(): void {
    const { type } = this.getValue();

    // Need rerender for Portal component
    if (type === RenderType.Animated) {
      this.forceUpdate();
    }
  }

  componentDidUpdate(): void {
    if (this.isUpdated) {
      return;
    }

    const { type } = this.getValue();

    if (type !== RenderType.Fixed) {
      fixedContainerPlus({
        fixed: false,
        node: this.sectionNode.current
      });
    }
  }

  handleValueChange(newValue: Value, meta: Meta): void {
    if (meta.patch.type && meta.patch.type !== RenderType.Fixed) {
      this.isUpdated = true;

      this.setState({ height: "auto" }, () => (this.isUpdated = false));
    }

    this.props.onChange(newValue, meta);
  }

  handleRemove = (): void => {
    this.selfDestruct();
  };

  handleStickyChange = (isSticky: boolean): void => {
    hideToolbar();

    const tooltip = getCurrentTooltip();
    const type = this.getValue().type;
    const node = this.sectionNode.current;
    const { height } = this.state;

    if (tooltip) {
      tooltip.hide();
    }

    if (type === RenderType.Fixed) {
      fixedContainerPlus({
        fixed: isSticky,
        node,
        height
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

  handleUpdateHeight = (): void => {
    const node = this.stickyNode.current;
    if (!node) {
      return;
    }

    const { height } = node.getBoundingClientRect();

    fixedContainerPlus({
      fixed: this.isSticky,
      node,
      height
    });

    const stateHeight = this.state.height;

    if (height !== stateHeight) {
      this.setState({
        height
      });
    }
  };

  getStyle(v: Value): React.CSSProperties | null {
    return v.type === RenderType.Fixed ? { height: this.state.height } : null;
  }

  getMeta(): ComponentsMeta {
    return {
      ...this.props.meta,
      section: {}
    };
  }

  getRerender(v: Value) {
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

  dvv = (key: string): unknown => {
    const v = this.getValue();
    const device = deviceModeSelector(getStore().getState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  getAnimationClassName = (v: Value, vs: Value, vd: Value): MValue<string> => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return;
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

  renderAnimated(v: Value, vs: Value, vd: Value): MValue<React.JSX.Element> {
    let sticky = (
      <Sticky
        refSelector={`#${this.getId()}`}
        type={RenderType.Animated}
        render={(isSticky) => this.renderAnimatedSticky(v, vs, vd, isSticky)}
        onChange={this.handleStickyChange}
      />
    );

    if (IS_EDITOR) {
      // Render in #brz-ed-root because have problems with mmenu z-index
      const node = document.getElementById("brz-ed-root");

      if (!node) {
        return;
      }

      sticky = (
        <Portal node={node} className="brz-ed-portal-section-header__sticky">
          {sticky}
        </Portal>
      );
    }

    return (
      <>
        {sticky}
        {this.renderStatic(v)}
      </>
    );
  }

  renderAnimatedSticky(
    v: Value,
    vs: Value,
    vd: Value,
    isSticky: boolean
  ): React.JSX.Element {
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
        meta: this.getMeta(),
        rerender: this.getRerender(v)
      }
    });

    return (
      <SortableZIndex zIndex={1}>
        <div className={className}>
          <ToolbarExtend position="fixed">
            {
              // @ts-expect-error: Need transform EditorArrayComponents to ts
              <EditorArrayComponent {...stickyItemProps} />
            }
          </ToolbarExtend>
        </div>
      </SortableZIndex>
    );
  }

  renderFixed(v: Value): React.JSX.Element {
    return (
      <Sticky
        refSelector={`#${this.getId()}`}
        type={RenderType.Fixed}
        render={(isSticky) => this.renderFixedSticky(v, isSticky)}
        onChange={this.handleStickyChange}
      />
    );
  }

  renderFixedSticky(v: Value, isSticky: boolean): React.JSX.Element {
    const className = classnames("brz-section__header--fixed", {
      "brz-section__header--fixed-opened": isSticky
    });
    const toolbarPosition = isSticky ? "fixed" : "absolute";

    return (
      <SortableZIndex zIndex={1}>
        <div className={className} ref={this.stickyNode}>
          <ToolbarExtend position={toolbarPosition}>
            {this.renderStatic(v)}
          </ToolbarExtend>
          {IS_EDITOR && <ResizeAware onResize={this.handleUpdateHeight} />}
        </div>
      </SortableZIndex>
    );
  }

  renderStatic(v: Value): React.JSX.Element {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      sliceStartIndex: 0,
      sliceEndIndex: STICKY_ITEM_INDEX,
      itemProps: {
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig
        ),
        meta: this.getMeta(),
        rerender: this.getRerender(v)
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...itemsProps} />;
  }

  renderTypes(v: Value, vs: Value, vd: Value): MValue<React.JSX.Element> {
    const { type } = v;

    switch (type) {
      case RenderType.Static:
        return this.renderStatic(v);
      case RenderType.Fixed:
        return this.renderFixed(v);
      case RenderType.Animated:
        return this.renderAnimated(v, vs, vd);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const { className, customClassName, cssClass, customAttributes, tagName } =
      v;

    const classNameSection = classnames(
      "brz-section brz-section__header",
      className,
      cssClass || customClassName,
      css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: this.getId(),
      style: this.getStyle(v),
      ref: this.sectionNode,
      className: classNameSection
    };

    const config = Config.getAll();
    const IS_PRO = isPro(config);

    return IS_PRO ? (
      <Animation
        component={tagName}
        componentProps={props}
        animationClass={this.getAnimationClassName(v, vs, vd)}
      >
        {this.renderTypes(v, vs, vd)}
      </Animation>
    ) : (
      <header className="brz-section brz-section__header">
        <ProBlocked
          text="Header"
          message={t("Upgrade to PRO to use this")}
          upgradeLink={Config.getAll().urls.upgradeToPro}
          upgradeText={t("Get a PRO plan")}
          absolute={false}
          onRemove={this.handleRemove}
        />
      </header>
    );
  }

  renderLangOrMemberOrAll(
    content: React.JSX.Element,
    v: Value
  ): React.JSX.Element {
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

  renderForView(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const {
      tagName,
      className,
      anchorName,
      customClassName,
      customAttributes,
      cssID,
      cssClass
    } = v;

    const uidPlaceholder = makePlaceholder({
      content: "{{ random_id }}",
      attr: { key: this.getId() }
    });
    const blockName = cssID
      ? cssID
      : anchorName || `${uidPlaceholder}_${this.getId()}`;
    const classNameSection = classnames(
      "brz-section brz-section__header",
      className,
      cssClass || customClassName,
      css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: blockName,
      style: this.getStyle(v),
      className: classNameSection
    };

    const content = (
      <Animation
        component={tagName}
        componentProps={props}
        animationClass={this.getAnimationClassName(v, vs, vd)}
      >
        {this.renderTypes(v, vs, vd)}
      </Animation>
    );

    return this.renderLangOrMemberOrAll(content, v);
  }
}
