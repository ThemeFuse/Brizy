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
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarSubscribeToEvent from "./toolbarSubscribeToEvent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventDetail extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsEventDetail" {
    return "MinistryBrandsEventDetail";
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
                  selector=".brz-ministryBrands__item--meta-address > .brz-eventDetail__item--meta"
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
                        selector=".brz-ministryBrands__item--meta-coordinatorEmail > .brz-eventDetail__item--meta"
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
                              selector=".brz-ministryBrands__item--meta-website > .brz-eventDetail__item--meta"
                            >
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
                                            toolbarMetaLinks,
                                            undefined,
                                            {
                                              allowExtend: false
                                            }
                                          )}
                                          selector=".brz-ministryBrands__item--meta--links--previous"
                                        >
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarPreview,
                                              undefined,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-eventDetail__item--meta--preview *:not(:is(:has(a),a))"
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
                                                <Toolbar
                                                  {...this.makeToolbarPropsFromConfig2(
                                                    toolbarSubscribeToEvent,
                                                    sidebarExtendButtons,
                                                    {
                                                      allowExtend: false
                                                    }
                                                  )}
                                                  selector=".brz-eventDetail__item--subscribe-event"
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
                                                          "brz-eventDetail"
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
      </Toolbar>
    );
  }
}
