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
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";

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

  getWidthWithW(data) {
    const { v, w, wNoSpacing, device } = data;
    const tabsCount = styleElementTimelineTabsCount({ v, device });
    const verticalMode = styleElementTimelineVerticalMode({ v, device });

    if (verticalMode === "on") {
      const width = styleElementTimelineWidth({ v, device });
      const widthSuffix = styleElementTimelineWidthSuffix({ v, device });

      if (widthSuffix === "px") {
        const marginType = styleMarginType({ v, device });
        const marginW = getMargin({ w, v, device, type: marginType });

        return {
          v,
          device,
          w: width + marginW,
          wNoSpacing: width
        };
      }

      return {
        v,
        w,
        wNoSpacing,
        device,
        width
      };
    }

    return {
      v,
      device,
      w: w / tabsCount,
      wNoSpacing: wNoSpacing / tabsCount
    };
  }

  getMeta(v) {
    const { meta } = this.props;
    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW(
      this.getWidthWithW({
        v,
        w: meta.desktopW,
        wNoSpacing: meta.desktopWNoSpacing,
        device: DESKTOP
      })
    );
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW(
      this.getWidthWithW({
        v,
        w: meta.tabletW,
        wNoSpacing: meta.tabletWNoSpacing,
        device: TABLET
      })
    );
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW(
      this.getWidthWithW({
        v,
        w: meta.mobileW,
        wNoSpacing: meta.mobileWNoSpacing,
        device: MOBILE
      })
    );

    return _.extend({}, meta, {
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
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
