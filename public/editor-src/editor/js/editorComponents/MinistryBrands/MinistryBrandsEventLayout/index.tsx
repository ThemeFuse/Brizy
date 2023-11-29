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
import * as sidebarExtendFilters from "../sidebarExtendFilters";
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import { EkklesiaMessages } from "../utils/helpers";
import * as toolbarExtendDayEvents from "./calendarToolbars/toolbarExtendDayEvents";
import * as toolbarExtendCalendarDays from "./calendarToolbars/toolbarExtendDays";
import * as toolbarExtendCalendarHeading from "./calendarToolbars/toolbarExtendHeading";
import defaultValue from "./defaultValue.json";
import * as toolbarExtendListItemMeta from "./listToolbars/toolbarExtendItemMeta";
import * as toolbarExtendListItemTitle from "./listToolbars/toolbarExtendItemTitle";
import * as toolbarExtendListItemDate from "./listToolbars/toolbarListItemDate";
import * as toolbarExtendListPagination from "./listToolbars/toolbarPagination";
import * as toolbarExtendListTitle from "./listToolbars/toolbarTitle";
import { style } from "./styles";
import * as toolbarExtendLayoutView from "./toolbarExtendLayoutView";
import * as toolbarExtendParent from "./toolbarExtendParent";
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
    const config = Config.getAll();

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
      ToastNotification.warn(EkklesiaMessages["event_layout"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-eventLayout__wrapper",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
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
            {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
              allowExtend: false
            })}
            selector=".brz-eventLayout--featured__item-title"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarDate, undefined, {
                allowExtend: false
              })}
              selector=".brz-eventLayout--featured__item p"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarPreview,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-eventLayout--featured__preview"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarExtendListPagination,
                    undefined,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-eventLayout__pagination"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarExtendListTitle,
                      undefined,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-eventLayout--list-item__title"
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
    );
  }
}
