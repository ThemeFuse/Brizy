import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { getContainerW } from "visual/utils/meta";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleSection } from "./styles";
import StoryItems from "./Items";
import defaultValue from "./defaultValue.json";

import { DW, TW, MW } from "./utils";

class Story extends EditorComponent {
  static get componentId() {
    return "Story";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  getMeta(v) {
    const { meta } = this.props;

    const desktopW = getContainerW({
      v,
      w: IS_EDITOR ? DW : 470,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: IS_EDITOR ? TW : 470,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: IS_EDITOR ? MW : 470,
      device: "mobile"
    });

    return Object.assign({}, meta, {
      desktopW,
      tabletW,
      mobileW,
      blockId: this.props.blockId,
      section: {
        isSlider: true
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  renderItems(v) {
    const { sliderAutoPlay, sliderAutoPlaySpeed, sliderAnimation } = v;

    const itemsProps = this.makeSubcomponentProps({
      sliderAnimation,
      sliderAutoPlaySpeed,
      bindWithKey: "items",
      meta: this.getMeta(v),
      sliderAutoPlay: sliderAutoPlay === "on",
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig
      )
    });

    return <StoryItems {...itemsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const { className, customClassName, cssClassPopulation } = v;

    const classNameSection = classnames(
      "brz-section",
      "brz-story",
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
        data-block-id={this.props.blockId}
        data-uid={this.getId()}
      >
        {this.renderItems(v)}
      </section>
    );
  }

  renderForView(v, vs, vd) {
    const { className, customClassName, cssClassPopulation } = v;

    const classNameSection = classnames(
      "brz-section",
      "brz-story",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    return (
      <section className={classNameSection} data-uid={this.getId()}>
        {this.renderItems(v)}
      </section>
    );
  }
}

export default Story;
