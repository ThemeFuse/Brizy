import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import type { Model } from "visual/editorComponents/EditorComponent/types";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { updateEkklesiaFields } from "visual/utils/api/common";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import * as sidebarExtendFilters from "../sidebarExtendFilters";
import {
  sidebarMinistryBrandsMetaDate,
  sidebarMinistryBrandsMetaTitle
} from "../sidebars/sidebars";
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarTitle from "../toolbarTitle";
import { getEkklesiaMessages } from "../utils/helpers";
import * as toolbarExtendDayEvents from "./calendarToolbars/toolbarExtendDayEvents";
import * as toolbarExtendCalendarDays from "./calendarToolbars/toolbarExtendDays";
import * as toolbarExtendCalendarHeading from "./calendarToolbars/toolbarExtendHeading";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendListItemMeta from "./listToolbars/toolbarExtendItemMeta";
import * as toolbarExtendListItemTitle from "./listToolbars/toolbarExtendItemTitle";
import * as toolbarGroupingDate from "./listToolbars/toolbarGroupingDate";
import * as toolbarExtendListItemDate from "./listToolbars/toolbarListItemDate";
import * as toolbarExtendListPagination from "./listToolbars/toolbarPagination";
import * as toolbarExtendListPaginationArrows from "./listToolbars/toolbarPaginationArrows";
import * as toolbarExtendListTitle from "./listToolbars/toolbarTitle";
import * as sidebarImage from "./sidebarImage";
import { style } from "./styles";
import * as toolbarExtendLayoutView from "./toolbarExtendLayoutView";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarImage from "./toolbarImage";
import type { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventLayout extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsEventLayout" {
    return "MinistryBrandsEventLayout";
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
          module: { key: "eventsLvl", subKey: "parents" }
        },
        {
          value: {
            categoryFilterParent,
            addCategoryFilterParent,
            addCategoryFilterParent2,
            addCategoryFilterParent3
          },
          module: { key: "eventsLvl", subKey: "childs" }
        }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["event_layout"]);
      this.patchValue(changedKeys);
    }
  }

  // to disable existed hover styles for month picker text
  getDBValue(): Model<Value> {
    const dbValue = super.getDBValue();

    return {
      ...dbValue,
      hoverListPaginationColorHex: null,
      hoverListPaginationColorOpacity: null,
      hoverListPaginationColorPalette: null,
      tempHoverListColorOpacity: null,
      tempHoverListColorPalette: null
    };
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-eventLayout__wrapper",
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
          toolbarExtendLayoutView,
          undefined,
          {
            allowExtend: false
          }
        )}
        selector=".brz-eventLayout--view"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtendFilters,
            sidebarExtendFilters,
            {
              allowExtend: false
            }
          )}
          selector=".brz-eventLayout--filters"
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
                  toolbarExtendListPagination,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-eventLayout__pagination span"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarExtendListPaginationArrows,
                    undefined,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-eventLayout__pagination a"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarExtendListTitle,
                      undefined,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-eventLayout--list-item__grouping-day"
                  >
                    <Toolbar
                      {...this.makeToolbarPropsFromConfig2(
                        toolbarGroupingDate,
                        undefined,
                        {
                          allowExtend: false
                        }
                      )}
                      selector=".brz-eventLayout--list-item__grouping-date"
                    >
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarExtendListItemDate,
                          undefined,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-eventLayout--list-item__content-date"
                      >
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarExtendListItemTitle,
                            undefined,
                            {
                              allowExtend: false
                            }
                          )}
                          selector=".brz-eventLayout--list-item__content__heading"
                        >
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarExtendListItemMeta,
                              undefined,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-eventLayout--list-item__content__meta"
                          >
                            <Toolbar
                              {...this.makeToolbarPropsFromConfig2(
                                toolbarExtendCalendarHeading,
                                undefined,
                                {
                                  allowExtend: false
                                }
                              )}
                              selector=".brz-eventLayout--calendar-heading th"
                            >
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarExtendCalendarDays,
                                  undefined,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-eventLayout--calendar-day"
                              >
                                <Toolbar
                                  {...this.makeToolbarPropsFromConfig2(
                                    toolbarExtendDayEvents,
                                    undefined,
                                    {
                                      allowExtend: false
                                    }
                                  )}
                                  selector=".brz-eventLayout--calendar-day li"
                                >
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarImage,
                                      sidebarImage,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--media"
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
                                      <Wrapper
                                        {...this.makeWrapperProps({
                                          className
                                        })}
                                      >
                                        <DynamicContentHelper
                                          placeholder={getPlaceholder(v)}
                                          props={{
                                            className:
                                              "brz-ministryBrands brz-eventLayout"
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
