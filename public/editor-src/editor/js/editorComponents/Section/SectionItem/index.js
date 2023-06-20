import classnames from "classnames";
import React from "react";
import { mergeDeep } from "timm";
import _ from "underscore";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import CustomCSS from "visual/component/CustomCSS";
import PaddingResizer from "visual/component/PaddingResizer";
import { Roles } from "visual/component/Roles";
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { deviceModeSelector } from "visual/redux/selectors";
import { css } from "visual/utils/cssStyle";
import { hasMembership } from "visual/utils/membership";
import { hasMultiLanguage } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarConfig from "./sidebar";
import { style, styleContainer } from "./styles";
import * as toolbarConfig from "./toolbar";

class SectionItem extends EditorComponent {
  static get componentId() {
    return "SectionItem";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  mounted = false;

  collapsibleToolbarRef = React.createRef();

  state = {
    isDragging: false,
    paddingPatch: null
  };

  getDBValue() {
    if (this.state.paddingPatch) {
      return mergeDeep(this.props.dbValue, this.state.paddingPatch);
    } else {
      return this.props.dbValue;
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  shouldUpdateBecauseOfParent(nextProps) {
    return (
      this.props.meta.section.isSlider ||
      !_.isEqual(this.props.rerender, nextProps.rerender)
    );
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.optionalSCU(nextProps) ||
      this.shouldUpdateBecauseOfParent(nextProps) ||
      this.state.paddingPatch
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarEscape = () => {
    this.collapsibleToolbarRef.current.open();
  };

  onPaddingResizerStart = () => {
    this.setState({ isDragging: true });
  };

  handlePaddingResizerChange = (patch) => {
    if (this.state.isDragging) {
      this.setState({ paddingPatch: patch });
    } else {
      this.patchValue(patch);
    }
  };

  onPaddingResizerEnd = () => {
    const paddingPatch = this.state.paddingPatch;
    this.setState({ isDragging: false, paddingPatch: null }, () =>
      this.handlePaddingResizerChange(paddingPatch)
    );
  };

  dvv = (key, device) => {
    const v = this.getValue();
    return defaultValueValue({ v, key, device });
  };

  getMeta() {
    const { meta } = this.props;
    const device = deviceModeSelector(this.getReduxState());

    const size = this.dvv("containerSize", DESKTOP);
    const tabletSize = this.dvv("containerSize", TABLET);
    const mobileSize = this.dvv("containerSize", MOBILE);

    const desktopSuffix = this.dvv("containerSizeSuffix", DESKTOP);
    const tabletSuffix = this.dvv("containerSizeSuffix", TABLET);
    const mobileSuffix = this.dvv("containerSizeSuffix", MOBILE);

    const containerType = this.dvv("containerType", device);

    const _desktopW =
      containerType === "fullWidth" ? meta.desktopFullW : meta.desktopBoxedW;

    const _desktopWNoSpacing =
      containerType === "fullWidth"
        ? meta.desktopFullWNoSpacing
        : meta.desktopBoxedWNoSpacing;

    const desktopW =
      desktopSuffix === "%"
        ? Math.round(_desktopW * (size / 100) * 10) / 10
        : size;
    const desktopWNoSpacing =
      desktopSuffix === "%"
        ? Math.round(_desktopWNoSpacing * (size / 100) * 10) / 10
        : size;

    const tabletW =
      tabletSuffix === "%"
        ? Math.round(meta.tabletW * (tabletSize / 100) * 10) / 10
        : tabletSize;
    const tabletWNoSpacing =
      tabletSuffix === "%"
        ? Math.round(meta.tabletWNoSpacing * (tabletSize / 100) * 10) / 10
        : tabletSize;

    const mobileW =
      mobileSuffix === "%"
        ? Math.round(meta.mobileW * (mobileSize / 100) * 10) / 10
        : mobileSize;
    const mobileWNoSpacing =
      mobileSuffix === "%"
        ? Math.round(meta.mobileWNoSpacing * (mobileSize / 100) * 10) / 10
        : mobileSize;

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;
    const { membership, membershipRoles, translations, translationsLangs } =
      this.props.rerender;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        global={!!globalBlockId}
        membership={hasMembership(membership, membershipRoles)}
        language={hasMultiLanguage(translations, translationsLangs)}
      />
    );
  }

  renderItems(v, vs, vd) {
    const meta = this.getMeta(v);
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName,
      css(
        `${this.constructor.componentId}-container`,
        `${this.getId()}-container`,
        styleContainer(v, vs, vd)
      )
    );
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: classNameContainer,
      meta
    });

    return (
      <Background value={v} meta={meta}>
        <PaddingResizer
          value={v}
          onStart={this.onPaddingResizerStart}
          onChange={this.handlePaddingResizerChange}
          onEnd={this.onPaddingResizerEnd}
        >
          <Items {...itemsProps} />
        </PaddingResizer>
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    const { className, containerType, customCSS } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      `brz-section--${containerType}`,
      className,
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, this.props)
      )
    );

    return (
      <ContainerBorder
        type="section__item"
        hiddenInResponsive={true}
        activateOnContentClick={false}
      >
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <div
              {...containerBorderAttr}
              ref={containerBorderRef}
              className={classNameSectionContent}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v, vs, vd)}
              >
                {this.renderToolbar()}
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v, vs, vd)}
                </ToolbarExtend>
              </Roles>
            </div>
          </CustomCSS>
        )}
      </ContainerBorder>
    );
  }

  renderForView(v, vs, vd) {
    const { className, containerType, customCSS } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      `brz-section--${containerType}`,
      className,
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, this.props)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={classNameSectionContent}>
          {this.renderItems(v, vs, vd)}
        </div>
      </CustomCSS>
    );
  }
}

export default SectionItem;
