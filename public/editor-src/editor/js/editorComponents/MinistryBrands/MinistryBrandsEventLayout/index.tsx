import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import type { Model } from "visual/editorComponents/EditorComponent/types";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import * as sidebarExtendFilters from "../sidebarExtendFilters";
import { sidebarMinistryBrandsMeta } from "../sidebars/sidebars";
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarTitle from "../toolbarTitle";
import { getEkklesiaMessages } from "../utils/helpers";
import { MBMetaPrefixKey } from "../utils/types";
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
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsEventLayout {
    return ElementTypes.MinistryBrandsEventLayout;
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
          contexts: this.getContexts()
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
        {({ ref: viewRef }) => (
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
            {({ ref: filtersRef }) => (
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
                          toolbarExtendListPagination,
                          undefined,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-eventLayout__pagination span"
                      >
                        {({ ref: paginationRef }) => (
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
                            {({ ref: paginationArrowsRef }) => (
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
                                {({ ref: groupingDayRef }) => (
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
                                    {({ ref: groupingDateRef }) => (
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
                                        {({ ref: contentDateRef }) => (
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
                                            {({ ref: headingRef }) => (
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
                                                {({ ref: metaRef }) => (
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
                                                    {({
                                                      ref: calendarHeadingRef
                                                    }) => (
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
                                                        {({
                                                          ref: calendarDayRef
                                                        }) => (
                                                          <Toolbar
                                                            {...this.makeToolbarPropsFromConfig2(
                                                              toolbarExtendDayEvents,
                                                              undefined,
                                                              {
                                                                allowExtend:
                                                                  false
                                                              }
                                                            )}
                                                            selector=".brz-eventLayout--calendar-day li"
                                                          >
                                                            {({
                                                              ref: dayEventsRef
                                                            }) => (
                                                              <Toolbar
                                                                {...this.makeToolbarPropsFromConfig2(
                                                                  toolbarImage,
                                                                  sidebarImage,
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
                                                                                  viewRef,
                                                                                  filtersRef,
                                                                                  titleRef,
                                                                                  dateRef,
                                                                                  paginationRef,
                                                                                  paginationArrowsRef,
                                                                                  groupingDayRef,
                                                                                  groupingDateRef,
                                                                                  contentDateRef,
                                                                                  headingRef,
                                                                                  metaRef,
                                                                                  calendarHeadingRef,
                                                                                  calendarDayRef,
                                                                                  dayEventsRef,
                                                                                  mediaRef,
                                                                                  buttonRef
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
                                                                              "brz-ministryBrands brz-eventLayout"
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
    );
  }
}
