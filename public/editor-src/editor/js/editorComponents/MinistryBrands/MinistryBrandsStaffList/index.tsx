import classnames from "classnames";
import React from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { toolbarMinistryBrandsMeta } from "visual/editorComponents/MinistryBrands/toolbars/toolbars";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import { sidebarMinistryBrandsMeta } from "../sidebars/sidebars";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarSocial from "../toolbarSocial";
import * as toolbarSocialDescription from "../toolbarSocialDescription";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarImage from "../toolbars/toolbarMinistryStaffImage";
import { getEkklesiaMessages } from "../utils/helpers";
import { MBMetaPrefixKey } from "../utils/types";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsStaffList extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsStaffList {
    return ElementTypes.MinistryBrandsStaffList;
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
    const { category } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [{ value: { category }, module: { key: "groups" } }]
    });

    if (changedKeys) {
      ToastNotification.warn(getEkklesiaMessages()["staff_list"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): JSX.Element {
    const className = classnames(
      "brz-staffList__wrapper",
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
        {...this.makeToolbarPropsFromConfig2(
          toolbarTitle,
          sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaTitle),
          {
            allowExtend: false
          }
        )}
        selector=".brz-staffList__heading"
      >
        {({ ref: headingRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarMetaTypography,
              sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaCategory),
              {
                allowExtend: false
              }
            )}
            selector=".brz-staffList__position"
          >
            {({ ref: positionRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarMetaTypography,
                  sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaGroup),
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-group"
              >
                {({ ref: groupRef }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMetaTypography,
                      sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaWorkphone),
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-workphone"
                  >
                    {({ ref: workphoneRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMetaTypography,
                          sidebarMinistryBrandsMeta(
                            MBMetaPrefixKey.metaCellphone
                          ),
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-cellphone"
                      >
                        {({ ref: cellphoneRef }) => (
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
                            {({ ref: mediaRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarSocial,
                                  undefined,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-staffList__link"
                              >
                                {({ ref: emailRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarMinistryBrandsMeta(
                                        MBMetaPrefixKey.metaEmail
                                      ),
                                      sidebarMinistryBrandsMeta(
                                        MBMetaPrefixKey.metaEmail
                                      ),
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--meta-full-email"
                                  >
                                    {({ ref: linkRef }) => (
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
                                        {({ ref: iconsRef }) => (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarSocialDescription,
                                              undefined,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-staffList__detail_page--button-text"
                                          >
                                            {({ ref: paginationRef }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarPagination,
                                                  undefined,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-staffList__pagination"
                                              >
                                                {({ ref: buttonTextRef }) => (
                                                  <Wrapper
                                                    {...this.makeWrapperProps({
                                                      className,
                                                      ref: (el) => {
                                                        attachRefs(el, [
                                                          headingRef,
                                                          positionRef,
                                                          groupRef,
                                                          workphoneRef,
                                                          cellphoneRef,
                                                          mediaRef,
                                                          linkRef,
                                                          iconsRef,
                                                          buttonTextRef,
                                                          emailRef,
                                                          paginationRef
                                                        ]);
                                                      }
                                                    })}
                                                  >
                                                    <DynamicContentHelper
                                                      placeholder={getPlaceholder(
                                                        v
                                                      )}
                                                      props={{
                                                        className:
                                                          "brz-staffList"
                                                      }}
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
