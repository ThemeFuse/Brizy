import classnames from "classnames";
import React, { ReactNode } from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { css } from "visual/utils/cssStyle";
import * as sidebarConfig from "../sidebar";
import * as toolbarTitle from "../toolbarTitle";
import defaultValue from "./defaultValue.json";
import * as sidebarButton from "./sidebarButton";
import { style } from "./styles";
import * as toolbarArrow from "./toolbarArrow";
import * as toolbarButton from "./toolbarButton";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarMeta from "./toolbarMeta";
import * as toolbarSliderDots from "./toolbarSliderDots";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils";

export class MinistryBrandsGroupSlider extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsGroupSlider" {
    return "MinistryBrandsGroupSlider";
  }
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );

    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-groupSlider__wrapper",
      "brz-ministryBrands",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarArrow, undefined, {
          allowExtend: false
        })}
        selector=".brz-swiper-arrow"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarButton, sidebarButton, {
            allowExtend: false
          })}
          selector=".brz-groupSlider_detail_button .brz-button"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarMeta, undefined, {
              allowExtend: false
            })}
            selector=".brz-groupSlider_meta"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarSliderDots,
                undefined,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-slick-slider__dots li"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
                  allowExtend: false
                })}
                selector=".brz-groupSlider_heading"
              >
                <Wrapper
                  {...this.makeWrapperProps({
                    className
                  })}
                >
                  <DynamicContentHelper
                    placeholder={getPlaceholder(v)}
                    props={{ className: "brz-ministryBrands brz-groupSlider" }}
                    blocked={false}
                    tagName="div"
                  />
                </Wrapper>
              </Toolbar>
            </Toolbar>
          </Toolbar>
        </Toolbar>
      </Toolbar>
    );
  }
}
