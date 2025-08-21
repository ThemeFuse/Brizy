import classnames from "classnames";
import React from "react";
import ResizeAware from "react-resize-aware";
import Animation from "visual/component/Animation";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import HotKeys from "visual/component/HotKeys";
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
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import * as State from "visual/utils/stateMode";
import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";
import { MValue } from "visual/utils/value";
import { ComponentsMeta } from "../EditorComponent/types";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleSection } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";
import { Meta, Props, RenderType, States, Value } from "./type";
import { STICKY_ITEM_INDEX, fixedContainerPlus } from "./utils";

export default class SectionHeader extends EditorComponent<
  Value,
  Props,
  States
> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  state: States = {
    height: "auto"
  };
  isSticky = false;
  isUpdated = false;
  sectionNode = React.createRef<HTMLDivElement>();
  stickyNode = React.createRef<HTMLDivElement>();
  isPro = isPro(this.getGlobalConfig());

  static get componentId(): ElementTypes.SectionHeader {
    return ElementTypes.SectionHeader;
  }

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
    const device = this.getDeviceMode();
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

    return this.css(
      `${this.getComponentId()}-animation-${slug}`,
      `${this.getId()}-animation-${slug}`,
      styleAnimation({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        contexts: this.getContexts()
      })
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

    if (isEditor(this.props.renderContext)) {
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
      {
        "brz-section__header--animated-closed":
          isEditor(this.props.renderContext) && !isSticky
      },
      { "brz-section__header--animated-opened": isSticky },
      this.css(
        this.getComponentId(),
        this.getId(),
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
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
      <SortableZIndex zIndex={1} renderContext={this.props.renderContext}>
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
      <SortableZIndex zIndex={1} renderContext={this.props.renderContext}>
        <div className={className} ref={this.stickyNode}>
          <ToolbarExtend position={toolbarPosition}>
            {this.renderStatic(v)}
          </ToolbarExtend>
          {isEditor(this.props.renderContext) && (
            <ResizeAware onResize={this.handleUpdateHeight} />
          )}
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

  handleKeyDown = (
    e: Event,
    { keyName, id }: { keyName: string; id: string }
  ) => {
    e.preventDefault();
    const { onClone } = this.props;
    switch (keyName) {
      case "alt+D":
      case "ctrl+D":
      case "cmd+D":
      case "right_cmd+D":
        return onClone(id);
      case "alt+del":
      case "ctrl+del":
      case "cmd+del":
      case "right_cmd+del":
        return this.selfDestruct();
    }
  };

  renderForEdit(v: Value, vs: Value, vd: Value): React.JSX.Element {
    const { className, customClassName, cssClass, customAttributes, tagName } =
      v;

    const classNameSection = classnames(
      "brz-section brz-section__header",
      className,
      cssClass || customClassName,
      this.css(
        this.getComponentId(),
        this.getId(),
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: this.getId(),
      style: this.getStyle(v),
      ref: this.sectionNode,
      className: classNameSection
    };

    const shortcuts = ["delete"];
    const isGlobalBlock = this.props.meta.globalBlockId;

    if (!isGlobalBlock) {
      shortcuts.push("duplicate");
    }

    return (
      <HotKeys
        shortcutsTypes={shortcuts}
        id={this.getId()}
        onKeyDown={this.handleKeyDown}
      >
        {this.isPro ? (
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
              upgradeLink={this.getGlobalConfig()?.urls?.upgradeToPro}
              upgradeText={t("Get a PRO plan")}
              absolute={false}
              onRemove={this.handleRemove}
            />
          </header>
        )}
      </HotKeys>
    );
  }

  renderLangOrMemberOrAll(
    content: React.JSX.Element,
    v: Value
  ): React.JSX.Element {
    const { membership, membershipRoles, translationsLangs, translations } = v;

    const config = this.getGlobalConfig();
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
      cssClass,
      type
    } = v;

    const uidPlaceholder = makePlaceholder({
      content: "{{ globalblock_anchor }}",
      attr: { uid: this.getId() }
    });

    const uuid = `${uidPlaceholder}_${this.getId()}`;

    const blockName = cssID ? cssID : anchorName || uuid;
    const classNameSection = classnames(
      "brz-section brz-section__header",
      `brz-section__header-type--${type}`,
      className,
      cssClass || customClassName,
      this.css(
        this.getComponentId(),
        this.getId(),
        styleSection({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const shouldAddUidAttr = cssID || anchorName;

    const props = {
      ...parseCustomAttributes(customAttributes),
      id: blockName,
      style: this.getStyle(v),
      className: classNameSection,
      ...(shouldAddUidAttr
        ? makeDataAttr({
            name: "id",
            value: uuid
          })
        : {})
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
