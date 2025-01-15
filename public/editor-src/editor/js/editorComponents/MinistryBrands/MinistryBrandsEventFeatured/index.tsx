import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { updateEkklesiaFields } from "visual/utils/api/common";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import {
  sidebarMinistryBrandsMetaAddress,
  sidebarMinistryBrandsMetaCategory,
  sidebarMinistryBrandsMetaCoordinator,
  sidebarMinistryBrandsMetaCoordinatorEmail,
  sidebarMinistryBrandsMetaCoordinatorPhone,
  sidebarMinistryBrandsMetaCost,
  sidebarMinistryBrandsMetaDate,
  sidebarMinistryBrandsMetaGroup,
  sidebarMinistryBrandsMetaLocation,
  sidebarMinistryBrandsMetaRoom,
  sidebarMinistryBrandsMetaTitle,
  sidebarMinistryBrandsMetaWebsite
} from "../sidebars/sidebars";
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
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventFeatured extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsEventFeatured" {
    return "MinistryBrandsEventFeatured";
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
          renderContext: this.renderContext
        })
      )
    );

    return (
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
            toolbarDate,
            sidebarMinistryBrandsMetaDate,
            {
              allowExtend: false
            }
          )}
          selector=".brz-ministryBrands__item--meta-date"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarMetaTypography,
              sidebarMinistryBrandsMetaCategory,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-category"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarMetaTypography,
                sidebarMinistryBrandsMetaGroup,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-ministryBrands__item--meta-group"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarMetaTypography,
                  sidebarMinistryBrandsMetaLocation,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-location"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarMetaTypography,
                    sidebarMinistryBrandsMetaAddress,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-ministryBrands__item--meta-address > .brz-eventFeatured__item--meta"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMetaTypography,
                      sidebarMinistryBrandsMetaRoom,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-room"
                  >
                    <Toolbar
                      {...this.makeToolbarPropsFromConfig2(
                        toolbarMetaTypography,
                        sidebarMinistryBrandsMetaCoordinator,
                        {
                          allowExtend: false
                        }
                      )}
                      selector=".brz-ministryBrands__item--meta-coordinator"
                    >
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMetaTypography,
                          sidebarMinistryBrandsMetaCoordinatorEmail,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-coordinatorEmail > .brz-eventFeatured__item--meta"
                      >
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarMetaTypography,
                            sidebarMinistryBrandsMetaCoordinatorPhone,
                            {
                              allowExtend: false
                            }
                          )}
                          selector=".brz-ministryBrands__item--meta-coordinatorPhone"
                        >
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMetaTypography,
                              sidebarMinistryBrandsMetaCost,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-cost"
                          >
                            <Toolbar
                              {...this.makeToolbarPropsFromConfig2(
                                toolbarMetaTypography,
                                sidebarMinistryBrandsMetaWebsite,
                                {
                                  allowExtend: false
                                }
                              )}
                              selector=".brz-ministryBrands__item--meta-website > .brz-eventFeatured__item--meta"
                            >
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
                                <Toolbar
                                  {...this.makeToolbarPropsFromConfig2(
                                    toolbarMetaItemLinkColor,
                                    sidebarMinistryBrandsMetaAddress,
                                    {
                                      allowExtend: false
                                    }
                                  )}
                                  selector=".brz-ministryBrands__item--meta-address > a"
                                >
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarMetaItemLinkColor,
                                      sidebarMinistryBrandsMetaCoordinatorEmail,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--meta-coordinatorEmail > a"
                                  >
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarMetaItemLinkColor,
                                        sidebarMinistryBrandsMetaWebsite,
                                        {
                                          allowExtend: false
                                        }
                                      )}
                                      selector=".brz-ministryBrands__item--meta-website > a"
                                    >
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarExtendButtons,
                                          sidebarExtendButtons,
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-ministryBrands__item--meta--button"
                                      >
                                        <Toolbar
                                          {...this.makeToolbarPropsFromConfig2(
                                            toolbarRegisterButton,
                                            sidebarExtendButtons,
                                            {
                                              allowExtend: false
                                            }
                                          )}
                                          selector=".brz-ministryBrands__item--meta--register-button"
                                        >
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarPreview,
                                              undefined,
                                              { allowExtend: false }
                                            )}
                                            selector=".brz-eventFeatured__item--meta--preview *:not(:is(:has(a),a))"
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
                                                    placeholder={getPlaceholder(
                                                      v
                                                    )}
                                                    props={{
                                                      className:
                                                        "brz-eventFeatured"
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
