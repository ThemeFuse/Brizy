import classnames from "classnames";
import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import StoryItems from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleSection } from "./styles";
import * as toolbarExtendConfig from "./toolbarExtend";
import { DW, MW, TW } from "./utils";

class Story extends EditorComponent {
  static defaultProps = {
    meta: {}
  };
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId() {
    return ElementTypes.Story;
  }

  getMeta() {
    const { meta } = this.props;
    const _isEditor = isEditor(this.props.renderContext);

    const Dwidth = _isEditor ? DW : 470;
    const Twidth = _isEditor ? TW : 470;
    const Mwidth = _isEditor ? MW : 470;

    const desktopW = Math.round(Dwidth * 10) / 10;
    const tabletW = Math.round(Twidth * 10) / 10;
    const mobileW = Math.round(Mwidth * 10) / 10;

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
    const {
      sliderLoop,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderAnimation,
      cssClass,
      customClassName
    } = v;

    const itemsProps = this.makeSubcomponentProps({
      sliderLoop,
      sliderAnimation,
      sliderAutoPlay,
      sliderAutoPlaySpeed,

      itemProps: {
        rerender: {
          sliderLoop,
          sliderAutoPlay,
          sliderAutoPlaySpeed,
          cssClass,
          customClassName
        }
      },
      bindWithKey: "items",
      meta: this.getMeta(),
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig
      )
    });

    return <StoryItems {...itemsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const { className, customClassName, cssClass } = v;

    const classNameSection = classnames(
      "brz-section",
      "brz-story",
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

    return (
      <section
        id={this.getId()}
        className={classNameSection}
        {...makeDataAttr({ name: "block-id", value: this.props.blockId })}
        {...makeDataAttr({ name: "uid", value: this.getId() })}
      >
        {this.renderItems(v)}
      </section>
    );
  }

  renderForView(v, vs, vd) {
    const { className, customClassName, cssClass } = v;

    const classNameSection = classnames(
      "brz-section",
      "brz-story",
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

    return (
      <section
        className={classNameSection}
        {...makeDataAttr({ name: "uid", value: this.getId() })}
      >
        {this.renderItems(v)}
      </section>
    );
  }
}

export default Story;
