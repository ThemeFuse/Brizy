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
  sidebarMinistryBrandsMetaCategory,
  sidebarMinistryBrandsMetaChildcare,
  sidebarMinistryBrandsMetaDay,
  sidebarMinistryBrandsMetaGroup,
  sidebarMinistryBrandsMetaResourceLink,
  sidebarMinistryBrandsMetaStatus,
  sidebarMinistryBrandsMetaTimes,
  sidebarMinistryBrandsMetaTitle
} from "../sidebars/sidebars";
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsGroupFeatured extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsGroupFeatured" {
    return "MinistryBrandsGroupFeatured";
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
    const { category, group, groupRecentList } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category, groupRecentList }, module: { key: "smallgroup" } },
        { value: { group }, module: { key: "groups" } }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["group_featured"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-groupFeatured__wrapper",
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
            sidebarMinistryBrandsMetaDay,
            {
              allowExtend: false
            }
          )}
          selector=".brz-ministryBrands__item--meta-day"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarDate,
              sidebarMinistryBrandsMetaTimes,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-times"
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
                    sidebarMinistryBrandsMetaStatus,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-ministryBrands__item--meta-status"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMetaTypography,
                      sidebarMinistryBrandsMetaChildcare,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-childcare"
                  >
                    <Toolbar
                      {...this.makeToolbarPropsFromConfig2(
                        toolbarMetaTypography,
                        sidebarMinistryBrandsMetaResourceLink,
                        {
                          allowExtend: false
                        }
                      )}
                      selector=".brz-ministryBrands__item--meta-resourceLink > span"
                    >
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMetaItemLinkColor,
                          sidebarMinistryBrandsMetaResourceLink,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta--links"
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
                              toolbarPreview,
                              undefined,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-groupFeatured__item--meta--preview *"
                          >
                            <Toolbar
                              {...this.makeToolbarPropsFromConfig2(
                                toolbarPagination,
                                undefined,
                                {
                                  allowExtend: false
                                }
                              )}
                              selector=".brz-ministryBrands__pagination"
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
                                      placeholder={getPlaceholder(v)}
                                      props={{ className: "brz-groupFeatured" }}
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
