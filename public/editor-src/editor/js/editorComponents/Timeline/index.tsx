import classnames from "classnames";
import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import EditorComponent, {
  Props as EProps
} from "visual/editorComponents/EditorComponent";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { getContainerW, getMargin } from "visual/utils/meta";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET
} from "visual/utils/responsiveMode";
import { styleMarginType } from "visual/utils/style2";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import Items from "./items";
import * as sidebarExtend from "./sidebarExtend";
import * as sidebarExtendLabel from "./sidebarExtendLabel";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendLabel from "./toolbarExtendLabel";
import * as toolbarExtendParent from "./toolbarExtendParent";

export interface Value extends ElementModel {
  width: number;
  widthSuffix: string;
  tabsCount: number;

  verticalMode: "on" | "off";

  labelBgColorHex: string;
  labelBgColorPalette: string;
  labelBgColorOpacity: number;

  labelColorHex: string;
  labelColorPalette: string;
  labelColorOpacity: number;

  customCSS: string;
}

export type Props = EProps<Value, Record<string, unknown>>;

interface GetWidth {
  v: Value;
  w: number;

  wNoSpacing: number;
  device: ResponsiveMode;
  width?: number;
}

export default class Timeline extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): "Timeline" {
    return "Timeline";
  }

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  getWidthWithW(data: GetWidth): GetWidth {
    const { v, w, wNoSpacing, device } = data;

    const dvv = (key: string) =>
      defaultValueValue({ v, key, device, state: "normal" });

    const tabsCount = dvv("tabsCount");
    const verticalMode = dvv("verticalMode") === "on";
    const width = Num.read(dvv("width")) ?? 350;
    const widthSuffix = dvv("widthSuffix") === "px";

    const marginType = styleMarginType({ v, device, state: "normal" });
    const marginW = getMargin({ w, v, device, type: marginType });

    if (verticalMode) {
      if (widthSuffix) {
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

  getMeta(v: Value): ComponentsMeta {
    const { meta } = this.props;
    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getContainerW(
      this.getWidthWithW({
        v,
        w: meta.desktopW ?? 0,
        wNoSpacing: meta.desktopWNoSpacing ?? 0,
        device: DESKTOP
      })
    );
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getContainerW(
      this.getWidthWithW({
        v,
        w: meta.tabletW ?? 0,
        wNoSpacing: meta.tabletWNoSpacing ?? 0,
        device: TABLET
      })
    );
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getContainerW(
      this.getWidthWithW({
        v,
        w: meta.mobileW ?? 0,
        wNoSpacing: meta.mobileWNoSpacing ?? 0,
        device: MOBILE
      })
    );

    return Object.assign({}, meta, {
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing
    });
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { verticalMode, timelineStyle, customCSS } = v;

    const className = classnames(
      "brz-timeline__tabs",
      `brz-timeline__tabs--${timelineStyle}`,
      verticalMode === "on"
        ? "brz-timeline__tabs--vertical"
        : "brz-timeline__tabs--horizontal",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        verticalMode,
        timelineStyle,
        meta: this.getMeta(v),
        toolbarExtendLabel: this.makeToolbarPropsFromConfig2(
          toolbarExtendLabel,
          sidebarExtendLabel,
          { allowExtend: false }
        )
      },
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtend,
        { allowExtend: false }
      )
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        {({ ref: cssRef }) => (
          <Wrapper {...this.makeWrapperProps({ className, ref: cssRef })}>
            {
              // @ts-expect-error: Need transform EditorArrayComponents to ts
              <Items {...itemProps} />
            }
          </Wrapper>
        )}
      </CustomCSS>
    );
  }
}
