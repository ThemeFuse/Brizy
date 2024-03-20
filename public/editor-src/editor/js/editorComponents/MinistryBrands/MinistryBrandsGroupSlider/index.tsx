import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { updateEkklesiaFields } from "visual/utils/api/common";
import { css } from "visual/utils/cssStyle";
import * as sidebarConfig from "../sidebar";
import {
  sidebarMinistryBrandsMetaCategory,
  sidebarMinistryBrandsMetaChildcare,
  sidebarMinistryBrandsMetaDay,
  sidebarMinistryBrandsMetaGroup,
  sidebarMinistryBrandsMetaResourceLink,
  sidebarMinistryBrandsMetaStatus,
  sidebarMinistryBrandsMetaTimes,
  sidebarMinistryBrandsMetaTitle
} from "../sidebars/sidebars";
import * as toolbarImage from "../toolbarImage";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarTitle from "../toolbarTitle";
import { EkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import * as sidebarButton from "./sidebarButton";
import { style } from "./styles";
import * as toolbarArrow from "./toolbarArrow";
import * as toolbarButton from "./toolbarButton";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarMeta from "./toolbarMeta";
import * as toolbarSliderDots from "./toolbarSliderDots";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsGroupSlider extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsGroupSlider" {
    return "MinistryBrandsGroupSlider";
  }
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  async componentDidMount(): Promise<void> {
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
    const { category, group } = this.getValue();
    const config = Config.getAll();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "smallgroup" } },
        { value: { group }, module: { key: "groups" } }
      ]
    });

    if (changedKeys) {
      ToastNotification.warn(EkklesiaMessages["group_slider"]);
      this.patchValue(changedKeys);
    }
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
            {...this.makeToolbarPropsFromConfig2(
              toolbarMeta,
              sidebarMinistryBrandsMetaDay,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-day"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarMeta,
                sidebarMinistryBrandsMetaTimes,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-ministryBrands__item--meta-times"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarMeta,
                  sidebarMinistryBrandsMetaCategory,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-category"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarMeta,
                    sidebarMinistryBrandsMetaGroup,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-ministryBrands__item--meta-group"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMeta,
                      sidebarMinistryBrandsMetaStatus,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-status"
                  >
                    <Toolbar
                      {...this.makeToolbarPropsFromConfig2(
                        toolbarMeta,
                        sidebarMinistryBrandsMetaChildcare,
                        {
                          allowExtend: false
                        }
                      )}
                      selector=".brz-ministryBrands__item--meta-childcare"
                    >
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMeta,
                          sidebarMinistryBrandsMetaResourceLink,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-resourceLink"
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
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarTitle,
                              sidebarMinistryBrandsMetaTitle,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-title"
                          >
                            <Toolbar
                              {...this.makeToolbarPropsFromConfig2(
                                toolbarImage,
                                undefined,
                                {
                                  allowExtend: false
                                }
                              )}
                              selector=".brz-ministryBrands__item--media"
                            >
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarLinksColor,
                                  undefined,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-groupSlider_meta--link a"
                              >
                                <Toolbar
                                  {...this.makeToolbarPropsFromConfig2(
                                    toolbarMetaIcons,
                                    undefined,
                                    {
                                      allowExtend: false
                                    }
                                  )}
                                  selector=".brz-ministryBrands__meta--icons"
                                >
                                  <Wrapper
                                    {...this.makeWrapperProps({
                                      className
                                    })}
                                  >
                                    <DynamicContentHelper
                                      placeholder={getPlaceholder(v)}
                                      props={{
                                        className:
                                          "brz-ministryBrands brz-groupSlider"
                                      }}
                                      blocked={false}
                                      tagName="div"
                                    />
                                  </Wrapper>
                                </Toolbar>
                              </Toolbar>
                            </Toolbar>
                          </Toolbar>
                        </Toolbar>
                      </Toolbar>
                    </Toolbar>
                  </Toolbar>
                </Toolbar>
              </Toolbar>
            </Toolbar>
          </Toolbar>
        </Toolbar>
      </Toolbar>
    );
  }
}
