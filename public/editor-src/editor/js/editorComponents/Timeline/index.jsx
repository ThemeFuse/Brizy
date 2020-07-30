import React from "react";
import classnames from "classnames";
import _ from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";
import { getContainerW, getMargin } from "visual/utils/meta";
import Items from "./items";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarExtend from "./toolbarExtend";
import * as sidebarExtend from "./sidebarExtend";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import {
  styleElementTimelineTabsCount,
  styleElementTimelineVerticalMode,
  styleElementTimelineWidth,
  styleElementTimelineWidthSuffix,
  styleMarginType
} from "visual/utils/style2";
import { Wrapper } from "../tools/Wrapper";

export default class Timeline extends EditorComponent {
  static get componentId() {
    return "Timeline";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  getWidthWithW(v, _w, device) {
    const tabsCount = styleElementTimelineTabsCount({ v, device });
    const verticalMode = styleElementTimelineVerticalMode({ v, device });
    const width = styleElementTimelineWidth({ v, device });
    const widthSuffix = styleElementTimelineWidthSuffix({ v, device });
    let dWidth = 100;
    let w = _w;

    if (verticalMode === "on") {
      if (widthSuffix === "px") {
        const marginType = styleMarginType({ v, device });
        const marginW = getMargin({ w, v, device, type: marginType });

        w = width + marginW;
      } else {
        dWidth = width;
      }
    } else {
      w = w / tabsCount;
    }

    return { w, v, device, width: dWidth };
  }

  getMeta(v) {
    const { meta } = this.props;
    const desktopW = getContainerW(
      this.getWidthWithW(v, meta.desktopW, "desktop")
    );
    const tabletW = getContainerW(
      this.getWidthWithW(v, meta.tabletW, "tablet")
    );
    const mobileW = getContainerW(
      this.getWidthWithW(v, meta.mobileW, "mobile")
    );

    return _.extend({}, meta, {
      mobileW,
      tabletW,
      desktopW
    });
  }

  renderForEdit(v, vs, vd) {
    const { verticalMode, timelineStyle } = v;
    const className = classnames(
      "brz-timeline__tabs",
      `brz-timeline__tabs--${timelineStyle}`,
      verticalMode === "on"
        ? "brz-timeline__tabs--vertical"
        : "brz-timeline__tabs--horizontal",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        verticalMode,
        timelineStyle,
        meta: this.getMeta(v),
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          toolbarExtendLabel,
          sidebarExtendLabel
        )
      },
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtend
      )
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          <Items {...itemProps} />
        </Wrapper>
      </CustomCSS>
    );
  }
}
