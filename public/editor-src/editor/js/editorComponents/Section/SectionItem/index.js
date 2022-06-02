import React from "react";
import classnames from "classnames";
import _ from "underscore";
import { mergeDeep } from "timm";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Items from "./items";
import Background from "visual/component/Background";
import PaddingResizer from "visual/component/PaddingResizer";
import ContainerBorder from "visual/component/ContainerBorder";
import { Roles } from "visual/component/Roles";
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style, styleContainer } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import {
  styleElementSectionContainerType,
  styleSizeContainerSize
} from "visual/utils/style2";
import { hasMembership } from "visual/utils/membership";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";

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

  handlePaddingResizerChange = patch => {
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

  getMeta(v) {
    const { meta } = this.props;
    const containerType = styleElementSectionContainerType({ v });
    const size = styleSizeContainerSize({ v, device: DESKTOP });
    const tabletSize = styleSizeContainerSize({ v, device: TABLET });
    const mobileSize = styleSizeContainerSize({ v, device: MOBILE });

    const _desktopW =
      containerType === "fullWidth" ? meta.desktopFullW : meta.desktopBoxedW;
    const _desktopWNoSpacing =
      containerType === "fullWidth"
        ? meta.desktopFullWNoSpacing
        : meta.desktopBoxedWNoSpacing;

    const desktopW = _desktopW * (size / 100);
    const desktopWNoSpacing = _desktopWNoSpacing * (size / 100);

    const tabletW = meta.tabletW * (tabletSize / 100);
    const tabletWNoSpacing = meta.tabletWNoSpacing * (tabletSize / 100);

    const mobileW = meta.mobileW * (mobileSize / 100);
    const mobileWNoSpacing = meta.mobileWNoSpacing * (mobileSize / 100);

    return {
      ...meta,
      desktopW: Math.round(desktopW * 10) / 10,
      desktopWNoSpacing: Math.round(desktopWNoSpacing * 10) / 10,
      tabletW: Math.round(tabletW * 10) / 10,
      tabletWNoSpacing: Math.round(tabletWNoSpacing * 10) / 10,
      mobileW: Math.round(mobileW * 10) / 10,
      mobileWNoSpacing: Math.round(mobileWNoSpacing * 10) / 10
    };
  }

  renderToolbar() {
    const { globalBlockId } = this.props.meta;
    const { membership, membershipRoles } = this.props.rerender;

    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
        global={!!globalBlockId}
        membership={hasMembership(membership, membershipRoles)}
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
