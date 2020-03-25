import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomTag from "visual/component/CustomTag";
import {
  wInBoxedPage,
  wInTabletPage,
  wInMobilePage,
  wInFullPage
} from "visual/config/columns";
import { getStore } from "visual/redux/store";
import { createGlobalBlock, createSavedBlock } from "visual/redux/actions";
import { globalBlocksAssembled2Selector } from "visual/redux/selectors";
import { uuid } from "visual/utils/uuid";
import { stripIds } from "visual/utils/models";
import { css } from "visual/utils/cssStyle";
import { getContainerW } from "visual/utils/meta";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleSection } from "./styles";
import SectionItems from "./Items";
import defaultValue from "./defaultValue.json";
import { styleMarginType } from "visual/utils/style2";

class Section extends EditorComponent {
  static get componentId() {
    return "Section";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  marginType = null;

  getMeta(v) {
    const { meta } = this.props;
    const {
      showOnDesktop,
      showOnMobile,
      showOnTablet,
      slider,
      verticalAlign,
      fullHeight
    } = v;
    const desktopFullW = getContainerW({
      v,
      w: wInFullPage,
      device: "desktop"
    });
    const desktopBoxedW = getContainerW({
      v,
      w: wInBoxedPage,
      device: "desktop"
    });
    const tabletW = getContainerW({
      v,
      w: wInTabletPage,
      device: "tablet"
    });
    const mobileW = getContainerW({
      v,
      w: wInMobilePage,
      device: "mobile"
    });

    return Object.assign({}, meta, {
      desktopFullW,
      desktopBoxedW,
      tabletW,
      mobileW,
      section: {
        isSlider: slider === "on",
        showOnDesktop: showOnDesktop === "on",
        showOnMobile: showOnMobile === "on",
        showOnTablet: showOnTablet === "on",
        marginType: this.marginType,
        verticalAlign,
        fullHeight
      }
    });
  }

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

    // need rerender sectionItem when the margin type changed
    const { deviceMode: device } = getStore().getState().ui;
    const marginType = styleMarginType({ device, v: value, state: "normal" });
    this.marginType = `${device}-${marginType}`;
  }

  getAttributes = customAttributes => {
    let myAttributes = customAttributes
      .split(" ")
      .join("")
      .split(":")
      .join(" ")
      .split("\n")
      .join(" ");

    let atributesToObj = [];
    let atributesToMas = myAttributes.split(" ");

    for (let i = 0; i < atributesToMas.length; i += 2) {
      atributesToObj[atributesToMas[i]] = atributesToMas[i + 1];
    }

    return Object.assign({}, atributesToObj);
  };

  renderItems(v) {
    const {
      sliderDots,
      sliderArrows,
      sliderAutoPlay,
      sliderAutoPlaySpeed,
      sliderAnimation
    } = v;

    const itemsProps = this.makeSubcomponentProps({
      sliderDots,
      sliderArrows,
      sliderAnimation,
      sliderAutoPlaySpeed,
      bindWithKey: "items",
      meta: this.getMeta(v),
      className: "brz-section__items",
      sliderAutoPlay: sliderAutoPlay === "on",
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtendConfig,
        sidebarExtendConfig
      )
    });

    return <SectionItems {...itemsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const {
      className,
      customClassName,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-section",
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
        {...this.getAttributes(customAttributes)}
      >
        {this.renderItems(v)}
      </section>
    );
  }

  renderForView(v, vs, vd) {
    const {
      className,
      tagName,
      customClassName,
      cssIDPopulation,
      cssClassPopulation,
      customAttributes
    } = v;

    const classNameSection = classnames(
      "brz-section",
      className,
      cssClassPopulation === "" ? customClassName : cssClassPopulation,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleSection(v, vs, vd)
      )
    );

    return (
      <CustomTag
        tagName={tagName}
        id={
          cssIDPopulation === ""
            ? v.anchorName || this.getId()
            : cssIDPopulation
        }
        className={classNameSection}
        data-uid={this.getId()}
        {...this.getAttributes(customAttributes)}
      >
        {this.renderItems(v)}
      </CustomTag>
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
    const globalBlocks = globalBlocksAssembled2Selector(getStore().getState());

    const globalsData = stripIds(globalBlocks[globalBlockId]).data;
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
