import classnames from "classnames";
import React from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Model } from "visual/editorComponents/EditorComponent/types";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import { read as readNum } from "visual/utils/reader/number";
import { read as readString } from "visual/utils/reader/string";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import { sidebarMinistryBrandsMeta } from "../sidebars/sidebars";
import * as toolbarImage from "../toolbarImage";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars//toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import { MBMetaPrefixKey } from "../utils/types";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarArrow from "./toolbarArrow";
import * as toolbarButton from "./toolbarButton";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarMeta from "./toolbarMeta";
import * as toolbarSliderDots from "./toolbarSliderDots";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsGroupSlider extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsGroupSlider {
    return ElementTypes.MinistryBrandsGroupSlider;
  }

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
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "smallgroup" } },
        { value: { group }, module: { key: "groups" } }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["group_slider"]);
      this.patchValue(changedKeys);
    }
  }

  getDBValue(): Model<Value> {
    const dbValue = super.getDBValue();

    const buttonBorderRadius = readNum(dbValue?.buttonBorderRadius) ?? 0;
    const buttonBorderRadiusSuffix =
      readString(dbValue?.buttonBorderRadiusSuffix) ?? "px";

    const buttonsBorderRadius = readNum(dbValue?.buttonsBorderRadius);
    const buttonsBorderRadiusSuffix = readString(
      dbValue?.buttonsBorderRadiusSuffix
    );

    return {
      ...dbValue,
      buttonsBorderRadius: buttonsBorderRadius ?? buttonBorderRadius,
      buttonsBorderRadiusSuffix:
        buttonsBorderRadiusSuffix ?? buttonBorderRadiusSuffix
    };
  }

  renderForEdit(v: Value, vs: Value, vd: Value): JSX.Element {
    const className = classnames(
      "brz-groupSlider__wrapper",
      "brz-ministryBrands",
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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarArrow, undefined, {
          allowExtend: false
        })}
        selector=".brz-swiper-arrow"
      >
        {({ ref: arrowRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarButton,
              sidebarExtendButtons,
              {
                allowExtend: false
              }
            )}
            selector=".brz-groupSlider_detail_button .brz-button"
          >
            {({ ref: buttonRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarMeta,
                  sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaDay),
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-day"
              >
                {({ ref: dayRef }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMeta,
                      sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaTimes),
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-times"
                  >
                    {({ ref: timesRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMeta,
                          sidebarMinistryBrandsMeta(
                            MBMetaPrefixKey.metaCategory
                          ),
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-category"
                      >
                        {({ ref: categoryRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMeta,
                              sidebarMinistryBrandsMeta(
                                MBMetaPrefixKey.metaGroup
                              ),
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-group"
                          >
                            {({ ref: groupRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarMeta,
                                  sidebarMinistryBrandsMeta(
                                    MBMetaPrefixKey.metaStatus
                                  ),
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item--meta-status"
                              >
                                {({ ref: statusRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarMeta,
                                      sidebarMinistryBrandsMeta(
                                        MBMetaPrefixKey.metaChildcare
                                      ),
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--meta-childcare"
                                  >
                                    {({ ref: childcareRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarMeta,
                                          sidebarMinistryBrandsMeta(
                                            MBMetaPrefixKey.metaResourceLink
                                          ),
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-ministryBrands__item--meta-resourceLink > .brz-groupSlider_meta"
                                      >
                                        {({ ref: resourceLinkRef }) => (
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
                                            {({ ref: dotsRef }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarTitle,
                                                  sidebarMinistryBrandsMeta(
                                                    MBMetaPrefixKey.metaTitle
                                                  ),
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-ministryBrands__item--meta-title"
                                              >
                                                {({ ref: titleRef }) => (
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
                                                    {({ ref: imageRef }) => (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarMetaItemLinkColor,
                                                          sidebarMinistryBrandsMeta(
                                                            MBMetaPrefixKey.metaResourceLink
                                                          ),
                                                          {
                                                            allowExtend: false
                                                          }
                                                        )}
                                                        selector=".brz-groupSlider_meta--link a"
                                                      >
                                                        {({ ref: linkRef }) => (
                                                          <Toolbar
                                                            {...this.makeToolbarPropsFromConfig2(
                                                              toolbarMetaIcons,
                                                              undefined,
                                                              {
                                                                allowExtend:
                                                                  false
                                                              }
                                                            )}
                                                            selector=".brz-ministryBrands__meta--icons"
                                                          >
                                                            {({
                                                              ref: iconsRef
                                                            }) => (
                                                              <Wrapper
                                                                {...this.makeWrapperProps(
                                                                  {
                                                                    className,
                                                                    ref: (
                                                                      el
                                                                    ) => {
                                                                      attachRefs(
                                                                        el,
                                                                        [
                                                                          arrowRef,
                                                                          buttonRef,
                                                                          dayRef,
                                                                          timesRef,
                                                                          categoryRef,
                                                                          groupRef,
                                                                          statusRef,
                                                                          childcareRef,
                                                                          resourceLinkRef,
                                                                          dotsRef,
                                                                          titleRef,
                                                                          imageRef,
                                                                          linkRef,
                                                                          iconsRef
                                                                        ]
                                                                      );
                                                                    }
                                                                  }
                                                                )}
                                                              >
                                                                <DynamicContentHelper
                                                                  placeholder={getPlaceholder(
                                                                    v
                                                                  )}
                                                                  props={{
                                                                    className:
                                                                      "brz-ministryBrands brz-groupSlider"
                                                                  }}
                                                                  blocked={
                                                                    false
                                                                  }
                                                                  tagName="div"
                                                                />
                                                              </Wrapper>
                                                            )}
                                                          </Toolbar>
                                                        )}
                                                      </Toolbar>
                                                    )}
                                                  </Toolbar>
                                                )}
                                              </Toolbar>
                                            )}
                                          </Toolbar>
                                        )}
                                      </Toolbar>
                                    )}
                                  </Toolbar>
                                )}
                              </Toolbar>
                            )}
                          </Toolbar>
                        )}
                      </Toolbar>
                    )}
                  </Toolbar>
                )}
              </Toolbar>
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}
