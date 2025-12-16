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
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import { MBMetaPrefixKey } from "../utils/types";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarSubscribeToEvent from "./toolbarSubscribeToEvent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventDetail extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsEventDetail {
    return ElementTypes.MinistryBrandsEventDetail;
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
    const { recentEvents } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [{ value: { recentEvents }, module: { key: "events" } }]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["event_detail"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-eventDetail__wrapper",
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
            {({ ref: dataRef }) => (
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
                    {({ ref: metaGroupRef }) => (
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
                            selector=".brz-ministryBrands__item--meta-address > .brz-eventDetail__item--meta"
                          >
                            {({ ref: itemMetaRef }) => (
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
                                {({ ref: metaRoomRef }) => (
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
                                    {({ ref: metaCoordinatorRef }) => (
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
                                        selector=".brz-ministryBrands__item--meta-coordinatorEmail > .brz-eventDetail__item--meta"
                                      >
                                        {({ ref: eventItemMetaRef }) => (
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
                                            {({ ref: phoneRef }) => (
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
                                                    selector=".brz-ministryBrands__item--meta-website > .brz-eventDetail__item--meta"
                                                  >
                                                    {({
                                                      ref: websiteMetaRef
                                                    }) => (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarLinksColor,
                                                          undefined,
                                                          {
                                                            allowExtend: false
                                                          }
                                                        )}
                                                        selector=".brz-eventDetail__item :not(.brz-eventDetail__item--meta--preview, .brz-ministryBrands__item--meta--button) a"
                                                      >
                                                        {({
                                                          ref: metaButtonRef
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
                                                              ref: metaAdressRef
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
                                                                  ref: coordinatorEmailRef
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
                                                                      ref: websiteRef
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
                                                                          ref: itemMetaButtonRef
                                                                        }) => (
                                                                          <Toolbar
                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                              toolbarMetaLinks,
                                                                              undefined,
                                                                              {
                                                                                allowExtend:
                                                                                  false
                                                                              }
                                                                            )}
                                                                            selector=".brz-ministryBrands__item--meta--links--previous"
                                                                          >
                                                                            {({
                                                                              ref: linksPreviousRef
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
                                                                                selector=".brz-eventDetail__item--meta--preview *:not(:is(:has(a),a))"
                                                                              >
                                                                                {({
                                                                                  ref: previewRef
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
                                                                                      ref: itemMediaRef
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
                                                                                          ref: metaIconsRef
                                                                                        }) => (
                                                                                          <Toolbar
                                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                                              toolbarSubscribeToEvent,
                                                                                              sidebarExtendButtons,
                                                                                              {
                                                                                                allowExtend:
                                                                                                  false
                                                                                              }
                                                                                            )}
                                                                                            selector=".brz-eventDetail__item--subscribe-event"
                                                                                          >
                                                                                            {({
                                                                                              ref: subscribeEventRef
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
                                                                                                          dataRef,
                                                                                                          categoryRef,
                                                                                                          metaGroupRef,
                                                                                                          locationRef,
                                                                                                          itemMetaRef,
                                                                                                          metaRoomRef,
                                                                                                          metaCoordinatorRef,
                                                                                                          eventItemMetaRef,
                                                                                                          phoneRef,
                                                                                                          costRef,
                                                                                                          websiteMetaRef,
                                                                                                          metaButtonRef,
                                                                                                          metaAdressRef,
                                                                                                          coordinatorEmailRef,
                                                                                                          websiteRef,
                                                                                                          itemMetaButtonRef,
                                                                                                          linksPreviousRef,
                                                                                                          previewRef,
                                                                                                          itemMediaRef,
                                                                                                          metaIconsRef,
                                                                                                          subscribeEventRef
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
                                                                                                      "brz-eventDetail"
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
        )}
      </Toolbar>
    );
  }
}
