import React from "react";
import classnames from "classnames";
import _ from "underscore";

import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Items from "./items";
import Background from "visual/component/Background";
import ContainerBorder from "visual/component/ContainerBorder";
import { Roles } from "visual/component/Roles";
import { CollapsibleToolbar, ToolbarExtend } from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

class StoryItem extends EditorComponent {
  static get componentId() {
    return "StoryItem";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  collapsibleToolbarRef = React.createRef();

  shouldUpdateBecauseOfParent(nextProps) {
    return !_.isEqual(this.props.rerender, nextProps.rerender);
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.optionalSCU(nextProps) || this.shouldUpdateBecauseOfParent(nextProps)
    );
  }

  handleToolbarEscape = () => {
    this.collapsibleToolbarRef.current.open();
  };

  getMeta() {
    const { meta } = this.props;
    const desktopW = Math.round(meta.desktopW * 10) / 10;
    const tabletW = Math.round(meta.tabletW * 10) / 10;
    const mobileW = Math.round(meta.mobileW * 10) / 10;

    return { ...meta, mobileW, tabletW, desktopW };
  }

  renderToolbar() {
    return (
      <CollapsibleToolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.collapsibleToolbarRef}
        className="brz-ed-collapsible--section"
        animation="rightToLeft"
      />
    );
  }

  renderItems(v) {
    const meta = this.getMeta();
    const classNameContainer = classnames(
      "brz-container",
      v.containerClassName
    );

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: classNameContainer,
      meta
    });

    return (
      <Background value={v} meta={meta}>
        <Items {...itemsProps} />
      </Background>
    );
  }

  renderForEdit(v, vs, vd) {
    const { className } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      className,
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, this.props)
      )
    );

    return (
      <ContainerBorder type="story__item" activateOnContentClick={false}>
        {({ ref: containerBorderRef, attr: containerBorderAttr }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <div
              {...containerBorderAttr}
              id={this.getId()}
              className={classNameSectionContent}
              ref={containerBorderRef}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={() => this.renderItems(v)}
              >
                {this.renderToolbar()}
                <ToolbarExtend onEscape={this.handleToolbarEscape}>
                  {this.renderItems(v)}
                </ToolbarExtend>
              </Roles>
            </div>
          </CustomCSS>
        )}
      </ContainerBorder>
    );
  }

  renderForView(v, vs, vd) {
    const { className } = v;
    const classNameSectionContent = classnames(
      "brz-section__content",
      className,
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, this.props)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={classNameSectionContent}>
          {this.renderItems(v)}
          <div className="brz-slick-slider__inner-arrow brz-slick-slider__inner-arrow-next" />
          <div className="brz-slick-slider__inner-arrow brz-slick-slider__inner-arrow-prev" />
        </div>
      </CustomCSS>
    );
  }
}

export default StoryItem;
