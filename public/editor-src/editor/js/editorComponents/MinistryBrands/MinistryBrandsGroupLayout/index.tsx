import classNames from "classnames";
import React, { ReactElement } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { updateEkklesiaFields } from "visual/utils/api/common";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import * as sidebarExtendFilters from "../sidebarExtendFilters";
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
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarImage from "../toolbarImage";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMeta from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import type { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsGroupLayout extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsGroupLayout" {
    return "MinistryBrandsGroupLayout";
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
    const {
      parentCategory,
      categoryFilterParent,
      addCategoryFilterParent,
      addCategoryFilterParent2,
      addCategoryFilterParent3
    } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        {
          value: { parentCategory },
          module: { key: "smallgroupsLvl", subKey: "parents" }
        },
        {
          value: { categoryFilterParent },
          module: { key: "eventsLvl", subKey: "childs" }
        },
        {
          value: {
            addCategoryFilterParent,
            addCategoryFilterParent2,
            addCategoryFilterParent3
          },
          module: { key: "smallgroupsLvl", subKey: "childs" }
        }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["group_layout"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactElement {
    const className = classNames(
      "brz-groupLayout__wrapper",
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
          toolbarExtendFilters,
          sidebarExtendFilters,
          {
            allowExtend: false
          }
        )}
        selector=".brz-groupLayout__filters"
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
                        selector=".brz-ministryBrands__item--meta-resourceLink > span"
                      >
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarPreview,
                            undefined,
                            {
                              allowExtend: false
                            }
                          )}
                          selector=".brz-groupLayout--item__content-preview"
                        >
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarPagination,
                              undefined,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-groupLayout__pagination"
                          >
                            <Toolbar
                              {...this.makeToolbarPropsFromConfig2(
                                toolbarExtendButtons,
                                sidebarExtendButtons,
                                {
                                  allowExtend: false
                                }
                              )}
                              selector=".brz-groupLayout--item__content-detailButton"
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
                                    toolbarMetaItemLinkColor,
                                    undefined,
                                    {
                                      allowExtend: false
                                    }
                                  )}
                                  selector=".brz-groupLayout--item__content-meta a"
                                >
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarMetaItemLinkColor,
                                      sidebarMinistryBrandsMetaResourceLink,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--meta-resourceLink > a"
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
                                              "brz-ministryBrands brz-groupLayout"
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
    );
  }
}
