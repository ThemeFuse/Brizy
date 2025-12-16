import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import { sidebarMinistryBrandsMeta } from "../sidebars/sidebars";
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarRegisterButton from "../toolbarRegisterButton";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import { MBMetaPrefixKey } from "../utils/types";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventFeatured extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsEventFeatured {
    return ElementTypes.MinistryBrandsEventFeatured;
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

    const { category, group, recentEvents } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "event" } },
        { value: { group }, module: { key: "groups" } },
        { value: { recentEvents }, module: { key: "events" } }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["event_featured"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-eventFeatured__wrapper",
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
        selector=".brz-ministryBrands__item--meta-title"
      >
        {({ ref: titleRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarDate,
              sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaDate),
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-date"
          >
            {({ ref: dateRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarMetaTypography,
                  sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaCategory),
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-category"
              >
                {({ ref: categoryRef }) => (
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
                          sidebarMinistryBrandsMeta(
                            MBMetaPrefixKey.metaLocation
                          ),
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-location"
                      >
                        {({ ref: locationRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMetaTypography,
                              sidebarMinistryBrandsMeta(
                                MBMetaPrefixKey.metaAddress
                              ),
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-address > .brz-eventFeatured__item--meta"
                          >
                            {({ ref: addressRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarMetaTypography,
                                  sidebarMinistryBrandsMeta(
                                    MBMetaPrefixKey.metaRoom
                                  ),
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item--meta-room"
                              >
                                {({ ref: roomRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarMetaTypography,
                                      sidebarMinistryBrandsMeta(
                                        MBMetaPrefixKey.metaCoordinator
                                      ),
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--meta-coordinator"
                                  >
                                    {({ ref: coordinatorRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarMetaTypography,
                                          sidebarMinistryBrandsMeta(
                                            MBMetaPrefixKey.metaCoordinatorEmail
                                          ),
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-ministryBrands__item--meta-coordinatorEmail > .brz-eventFeatured__item--meta"
                                      >
                                        {({ ref: coordinatorEmailRef }) => (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarMetaTypography,
                                              sidebarMinistryBrandsMeta(
                                                MBMetaPrefixKey.metaCoordinatorPhone
                                              ),
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-ministryBrands__item--meta-coordinatorPhone"
                                          >
                                            {({ ref: coordinatorPhoneRef }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarMetaTypography,
                                                  sidebarMinistryBrandsMeta(
                                                    MBMetaPrefixKey.metaCost
                                                  ),
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-ministryBrands__item--meta-cost"
                                              >
                                                {({ ref: costRef }) => (
                                                  <Toolbar
                                                    {...this.makeToolbarPropsFromConfig2(
                                                      toolbarMetaTypography,
                                                      sidebarMinistryBrandsMeta(
                                                        MBMetaPrefixKey.metaWebsite
                                                      ),
                                                      {
                                                        allowExtend: false
                                                      }
                                                    )}
                                                    selector=".brz-ministryBrands__item--meta-website > .brz-eventFeatured__item--meta"
                                                  >
                                                    {({ ref: websiteRef }) => (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarLinksColor,
                                                          undefined,
                                                          {
                                                            allowExtend: false
                                                          }
                                                        )}
                                                        selector=":is(.brz-eventFeatured__item--meta--link, .brz-eventFeatured__item--meta--preview) a"
                                                      >
                                                        {({
                                                          ref: linksRef
                                                        }) => (
                                                          <Toolbar
                                                            {...this.makeToolbarPropsFromConfig2(
                                                              toolbarMetaItemLinkColor,
                                                              sidebarMinistryBrandsMeta(
                                                                MBMetaPrefixKey.metaAddress
                                                              ),
                                                              {
                                                                allowExtend:
                                                                  false
                                                              }
                                                            )}
                                                            selector=".brz-ministryBrands__item--meta-address > a"
                                                          >
                                                            {({
                                                              ref: addressLinkRef
                                                            }) => (
                                                              <Toolbar
                                                                {...this.makeToolbarPropsFromConfig2(
                                                                  toolbarMetaItemLinkColor,
                                                                  sidebarMinistryBrandsMeta(
                                                                    MBMetaPrefixKey.metaCoordinatorEmail
                                                                  ),
                                                                  {
                                                                    allowExtend:
                                                                      false
                                                                  }
                                                                )}
                                                                selector=".brz-ministryBrands__item--meta-coordinatorEmail > a"
                                                              >
                                                                {({
                                                                  ref: coordinatorEmailLinkRef
                                                                }) => (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarMetaItemLinkColor,
                                                                      sidebarMinistryBrandsMeta(
                                                                        MBMetaPrefixKey.metaWebsite
                                                                      ),
                                                                      {
                                                                        allowExtend:
                                                                          false
                                                                      }
                                                                    )}
                                                                    selector=".brz-ministryBrands__item--meta-website > a"
                                                                  >
                                                                    {({
                                                                      ref: websiteLinkRef
                                                                    }) => (
                                                                      <Toolbar
                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                          toolbarExtendButtons,
                                                                          sidebarExtendButtons,
                                                                          {
                                                                            allowExtend:
                                                                              false
                                                                          }
                                                                        )}
                                                                        selector=".brz-ministryBrands__item--meta--button"
                                                                      >
                                                                        {({
                                                                          ref: buttonRef
                                                                        }) => (
                                                                          <Toolbar
                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                              toolbarRegisterButton,
                                                                              sidebarExtendButtons,
                                                                              {
                                                                                allowExtend:
                                                                                  false
                                                                              }
                                                                            )}
                                                                            selector=".brz-ministryBrands__item--meta--register-button"
                                                                          >
                                                                            {({
                                                                              ref: registerButtonRef
                                                                            }) => (
                                                                              <Toolbar
                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                  toolbarPreview,
                                                                                  undefined,
                                                                                  {
                                                                                    allowExtend:
                                                                                      false
                                                                                  }
                                                                                )}
                                                                                selector=".brz-eventFeatured__item--meta--preview *:not(:is(:has(a),a))"
                                                                              >
                                                                                {({
                                                                                  ref: metaPreviewRef
                                                                                }) => (
                                                                                  <Toolbar
                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                      toolbarImage,
                                                                                      undefined,
                                                                                      {
                                                                                        allowExtend:
                                                                                          false
                                                                                      }
                                                                                    )}
                                                                                    selector=".brz-ministryBrands__item--media"
                                                                                  >
                                                                                    {({
                                                                                      ref: mediaRef
                                                                                    }) => (
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
                                                                                                      titleRef,
                                                                                                      dateRef,
                                                                                                      categoryRef,
                                                                                                      groupRef,
                                                                                                      locationRef,
                                                                                                      addressRef,
                                                                                                      roomRef,
                                                                                                      coordinatorRef,
                                                                                                      coordinatorEmailRef,
                                                                                                      coordinatorPhoneRef,
                                                                                                      costRef,
                                                                                                      websiteRef,
                                                                                                      linksRef,
                                                                                                      addressLinkRef,
                                                                                                      coordinatorEmailLinkRef,
                                                                                                      websiteLinkRef,
                                                                                                      buttonRef,
                                                                                                      registerButtonRef,
                                                                                                      metaPreviewRef,
                                                                                                      mediaRef,
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
                                                                                                  "brz-eventFeatured"
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
