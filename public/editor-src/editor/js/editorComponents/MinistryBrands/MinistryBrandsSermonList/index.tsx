import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api/common";
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
import * as toolbarConfig from "../toolbarMetaTypography";
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

export class MinistryBrandsSermonList extends EditorComponent<Value, Props> {
  static get componentId(): ElementTypes.MinistryBrandsSermonList {
    return ElementTypes.MinistryBrandsSermonList;
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
    const { category, group, series } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "sermon" } },
        { value: { group }, module: { key: "groups" } },
        { value: { series }, module: { key: "series" } }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["sermon_list"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-sermonList__wrapper",
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
            toolbarConfig,
            sidebarMinistryBrandsMetaDate,
            {
              allowExtend: false
            }
          )}
          selector=".brz-ministryBrands__item--meta-date"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarConfig,
              sidebarMinistryBrandsMetaCategory,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-category"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarConfig,
                sidebarMinistryBrandsMetaGroup,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-ministryBrands__item--meta-group"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarConfig,
                  sidebarMinistryBrandsMetaSeries,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-series"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarConfig,
                    sidebarMinistryBrandsMetaPreacher,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-ministryBrands__item--meta-preacher"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarConfig,
                      sidebarMinistryBrandsMetaPassage,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-passage > .brz-sermonList__item--meta"
                  >
                    <Toolbar
                      {...this.makeToolbarPropsFromConfig2(
                        toolbarMetaItemLinkColor,
                        sidebarMinistryBrandsMetaPassage,
                        {
                          allowExtend: false
                        }
                      )}
                      selector=".brz-sermonList__item--meta--link a"
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
                            toolbarMedia,
                            undefined,
                            {
                              allowExtend: false
                            }
                          )}
                          selector=".brz-sermonList__item--media a"
                        >
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarPreview,
                              undefined,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-sermonList__item--meta--preview"
                          >
                            <Toolbar
                              {...this.makeToolbarPropsFromConfig2(
                                toolbarPagination,
                                undefined,
                                {
                                  allowExtend: false
                                }
                              )}
                              selector=".brz-ministryBrands__pagination a"
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
                                      props={{
                                        className: "brz-sermonList"
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
    );
  }
}
