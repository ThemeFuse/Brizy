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
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import {
  sidebarMinistryBrandsMetaCategory,
  sidebarMinistryBrandsMetaDate,
  sidebarMinistryBrandsMetaGroup,
  sidebarMinistryBrandsMetaPassage,
  sidebarMinistryBrandsMetaPreacher,
  sidebarMinistryBrandsMetaSeries,
  sidebarMinistryBrandsMetaTitle
} from "../sidebars/sidebars";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarMedia from "../toolbarMedia";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { EkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsSermonFeatured extends EditorComponent<
  Value,
  Props
> {
  static get componentId(): "MinistryBrandsSermonFeatured" {
    return "MinistryBrandsSermonFeatured";
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
    const { category, group, series, sermonRecentList } = this.getValue();
    const config = Config.getAll();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "sermon" } },
        { value: { group }, module: { key: "groups" } },
        { value: { series }, module: { key: "series" } },
        { value: { sermonRecentList }, module: { key: "recentSermons" } }
      ]
    });

    if (changedKeys) {
      ToastNotification.warn(EkklesiaMessages["sermon_featured"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-sermonFeatured__wrapper",
      "brz-ministryBrands",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
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
            toolbarMetaTypography,
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
                  sidebarMinistryBrandsMetaSeries,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-series"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarMetaTypography,
                    sidebarMinistryBrandsMetaPreacher,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-ministryBrands__item--meta-preacher"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMetaTypography,
                      sidebarMinistryBrandsMetaPassage,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-passage > .brz-sermonFeatured__item--meta"
                  >
                    <Toolbar
                      {...this.makeToolbarPropsFromConfig2(
                        toolbarMedia,
                        undefined,
                        {
                          allowExtend: false
                        }
                      )}
                      selector=".brz-sermonFeatured__item--media--links a"
                    >
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMetaItemLinkColor,
                          sidebarMinistryBrandsMetaPassage,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-sermonFeatured__item--meta-passage a"
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
                            selector=".brz-sermonFeatured__item--meta--preview"
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
                                    props={{ className: "brz-sermonFeatured" }}
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
    );
  }
}
