import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import SectionItems from "./Items";
import { getStore } from "visual/redux/store";
import { createGlobalBlock, createSavedBlock } from "visual/redux/actions";
import { globalBlocksSelector } from "visual/redux/selectors";
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
            items: EditorArrayComponent.cloneItem(value.items, 0)
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
        isSlider: slider === "on",
        showOnMobile: showOnMobile === "on",
        showOnTablet: showOnTablet === "on"
      }
    });
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: "brz-section__items",
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

  renderForEdit(v) {
    return (
      <section
        id={this.getId()}
        className={sectionStyleClassName(v)}
        style={sectionStyleCSSVars(v)}
        data-block-id={this.props.blockId}
      >
        {this.renderItems(v)}
      </section>
    );
  }

  renderForView(v) {
    return (
      <section
        id={v.anchorName || this.getId()}
        className={sectionStyleClassName(v)}
        data-uid={this.getId()}
      >
        {this.renderItems(v)}
      </section>
    );
  }

  // api

  becomeSaved() {
    const { blockId } = this.props;
    const dbValue = this.getDBValue();
    const dispatch = getStore().dispatch;

    dispatch(
      createSavedBlock({
        id: uuid(),
        data: {
          type: this.constructor.componentId,
          blockId,
          value: dbValue
        },
        meta: {
          sourceBlockId: this.getId()
        }
      })
    );
  }

  becomeGlobal() {
    const { blockId, onChange } = this.props;
    const dbValue = this.getDBValue();
    const globalBlockId = uuid();
    const dispatch = getStore().dispatch;

    dispatch(
      createGlobalBlock({
        id: globalBlockId,
        data: {
          type: this.constructor.componentId,
          blockId,
          value: dbValue
        },
        meta: {
          sourceBlockId: this.getId()
        }
      })
    );

    onChange(
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
    const {
      meta: { globalBlockId },
      onChange
    } = this.props;
    const globalBlocks = globalBlocksSelector(getStore().getState());

    const globalsData = stripIds(globalBlocks[globalBlockId]);
    globalsData.value._id = this.getId();

    onChange(globalsData, {
      intent: "replace_all",
      idOptions: {
        keepExistingIds: true
      }
    });
  }
}

export default Section;
