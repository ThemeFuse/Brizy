import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getEkklesiaMessages } from "visual/editorComponents/MinistryBrands/utils/helpers";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import * as toolbarImage from "../toolbarImage";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarSocial from "./toolbarSocial";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsStaffDetail extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsStaffDetail {
    return ElementTypes.MinistryBrandsStaffDetail;
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
    const { recentStaff } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [{ value: { recentStaff }, module: { key: "staff" } }]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["staff_detail"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-staffDetail__wrapper",
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
        {...this.makeToolbarPropsFromConfig2(toolbarImage, undefined, {
          allowExtend: false
        })}
        selector=".brz-ministryBrands__item--media"
      >
        {({ ref: mediaRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
              allowExtend: false
            })}
            selector=".brz-staffDetail__item--meta--title"
          >
            {({ ref: titleRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarMetaTypography,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-staffDetail__item--meta"
              >
                {({ ref: itemMetaRef }) => (
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
                    {({ ref: metaIconsRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarSocial,
                          undefined,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-staffDetail__item--social a"
                      >
                        {({ ref: socialRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarPreview,
                              undefined,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-staffDetail__item--about"
                          >
                            {({ ref: aboutRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarMetaLinks,
                                  undefined,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item--meta--links--previous"
                              >
                                {({ ref: previousRef }) => (
                                  <Wrapper
                                    {...this.makeWrapperProps({
                                      className,
                                      ref: (el) => {
                                        attachRefs(el, [
                                          mediaRef,
                                          titleRef,
                                          itemMetaRef,
                                          metaIconsRef,
                                          socialRef,
                                          aboutRef,
                                          previousRef
                                        ]);
                                      }
                                    })}
                                  >
                                    <DynamicContentHelper
                                      placeholder={getPlaceholder(v)}
                                      props={{ className: "brz-staffDetail" }}
                                      blocked={false}
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
    );
  }
}
