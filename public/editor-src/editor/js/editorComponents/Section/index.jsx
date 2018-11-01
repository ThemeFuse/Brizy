import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import SectionItems from "./Items";
import { cloneItem } from "visual/editorComponents/EditorArrayComponent";
import { getStore } from "visual/redux/store";
import { updateGlobals } from "visual/redux/actionCreators";
import { uuid } from "visual/utils/uuid";
import { stripIds } from "visual/utils/models";
import * as toolbarExtendConfig from "./toolbarExtend";
import { sectionStyleClassName, sectionStyleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";

class Section extends EditorComponent {
  static get componentId() {
    return "Section";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  shouldComponentUpdate(nextProps) {
    return this.optionalSCU(nextProps);
  }

  handleValueChange(value, meta) {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      const { patch } = meta;

      if (patch && patch.slider === "on" && value.items.length === 1) {
        super.handleValueChange(
          {
            ...value,
            items: cloneItem(value.items, 0)
          },
          meta
        );
      } else {
        super.handleValueChange(value, meta);
      }
    }
  }

  renderItems(v) {
    const {
      showOnMobile,
      showOnTablet,
      slider,
      sliderDots,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderAnimation
    } = v;
    const meta = Object.assign({}, this.props.meta, {
      section: {
        showOnMobile: showOnMobile === "on",
        showOnTablet: showOnTablet === "on",
      }
    });
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: "brz-section__items",
      showSlider: slider === "on",
      sliderDots,
      sliderArrows,
      sliderAnimation,
      sliderAutoPlay: sliderAutoPlay === "on",
      sliderAutoPlaySpeed,
      meta,
      toolbarExtend: this.makeToolbarPropsFromConfig(toolbarExtendConfig)
    });

    return <SectionItems {...itemsProps} />;
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.sliderArrowsColorPalette &&
        `${_v.sliderArrowsColorPalette}__arrowsColor`,
      _v.sliderDotsColorPalette && `${_v.sliderDotsColorPalette}__dotsColor`
    ]);

    return (
      <section
        id={this.getId()}
        className={sectionStyleClassName(v)}
        data-block-id={this.props.blockId}
        style={sectionStyleCSSVars(v)}
      >
        {this.renderItems(v)}
      </section>
    );
  }

  renderForView(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.sliderArrowsColorPalette &&
        `${_v.sliderArrowsColorPalette}__arrowsColor`,
      _v.sliderDotsColorPalette && `${_v.sliderDotsColorPalette}__dotsColor`
    ]);

    return (
      <section id={this.getId()} className={sectionStyleClassName(v)}>
        {this.renderItems(v)}
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
          type: "Section",
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
    const globalBlockId = uuid();

    store.dispatch(
      updateGlobals("globalBlocks", {
        ...globalBlocks,
        [globalBlockId]: {
          type: "Section",
          blockId,
          value: dbValue
        }
      })
    );

    this.props.onChange(
      {
        type: "GlobalBlock",
        blockId,
        value: {
          _id: this.getId(),
          globalBlockId
        }
      },
      {
        intent: "replace_all",
        idOptions: {
          keepExistingIds: true
        }
      }
    );
  }

  becomeNormal() {
    const store = getStore();
    const { globalBlocks = {} } = store.getState().globals.project;
    const { globalBlockId } = this.props.meta;

    const globalsData = stripIds(globalBlocks[globalBlockId]);
    globalsData.value._id = this.getId();

    this.props.onChange(globalsData, {
      intent: "replace_all",
      idOptions: {
        keepExistingIds: true
      }
    });
  }
}

export default Section;
