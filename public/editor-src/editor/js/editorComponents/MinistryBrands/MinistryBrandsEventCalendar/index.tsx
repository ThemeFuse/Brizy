import classnames from "classnames";
import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { ToastNotification } from "visual/component/Notifications";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as Str from "visual/utils/string/specs";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarDay from "./sidebarDay";
import * as sidebarSubscribeToCalendar from "./sidebarSubscribeToCalendar";
import { style } from "./styles";
import * as toolbarArrow from "./toolbarArrow";
import * as toolbarCell from "./toolbarCell";
import * as toolbarDay from "./toolbarDay";
import * as toolbarEmpty from "./toolbarEmpty";
import * as toolbarEventStartTime from "./toolbarEventStartTime";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarMonth2 from "./toolbarMonths/toolbarMonth2";
import * as toolbarMonth3 from "./toolbarMonths/toolbarMonth3";
import * as toolbarMonth4 from "./toolbarMonths/toolbarMonth4";
import * as toolbarMonth5 from "./toolbarMonths/toolbarMonth5";
import * as toolbarMonth6 from "./toolbarMonths/toolbarMonth6";
import * as toolbarMonth7 from "./toolbarMonths/toolbarMonth7";
import * as toolbarMonth8 from "./toolbarMonths/toolbarMonth8";
import * as toolbarMonth9 from "./toolbarMonths/toolbarMonth9";
import * as toolbarMonth10 from "./toolbarMonths/toolbarMonth10";
import * as toolbarMonth11 from "./toolbarMonths/toolbarMonth11";
import * as toolbarMonth12 from "./toolbarMonths/toolbarMonth12";
import * as toolbarPagination from "./toolbarPagination";
import * as toolbarSubscribeToCalendar from "./toolbarSubscribeToCalendar";
import * as toolbarTitle from "./toolbarTitle";
import * as toolbarWeekdays from "./toolbarWeekdays";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventCalendar extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;
  calendarIcon = React.createRef<Element>();
  subscribeIcon: HTMLElement | undefined;

  static get componentId(): ElementTypes.MinistryBrandsEventCalendar {
    return ElementTypes.MinistryBrandsEventCalendar;
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

    const { category, group } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "event" } },
        { value: { group }, module: { key: "groups" } }
      ]
    });
    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["event_calendar"]);
      this.patchValue(changedKeys);
    }
  }

  handleDcDone = () => {
    const icon = this.calendarIcon.current;

    if (!icon) {
      return;
    }

    this.subscribeIcon =
      icon.querySelector<HTMLElement>(".brz-eventCalendar__subscribe__icon") ??
      undefined;

    this.forceUpdate();
  };

  getIconData() {
    const v = this.getValue();
    const { iconName, iconType, iconFilename } = v;

    return {
      iconName: Str.read(iconName) ?? "",
      iconType: Str.read(iconType) ?? "",
      iconFilename: Str.read(iconFilename) ?? ""
    };
  }

  renderIconForEdit({
    iconName,
    iconType,
    iconFilename
  }: {
    iconName: string;
    iconType: string;
    iconFilename: string;
  }) {
    const iconContainer = this.subscribeIcon;

    if (!iconName || !iconType || !iconContainer) {
      return "";
    }

    const newIcon = (
      <ThemeIcon name={iconName} type={iconType} filename={iconFilename} />
    );

    return createPortal(newIcon, iconContainer);
  }

  renderIconForView({
    iconName,
    iconType
  }: {
    iconName: string;
    iconType: string;
  }) {
    if (!iconName || !iconType) {
      return "";
    }

    return `<svg class='brz-icon-svg align-[initial]' data-name='${iconName}' data-type='${iconType}'></svg>`;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { iconName, iconType, iconFilename } = this.getIconData();
    const className = classnames(
      "brz-eventCalendar__wrapper",
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
    const icon = this.renderIconForEdit({ iconName, iconType, iconFilename });
    const placeholder = getPlaceholder(v, "");

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarPagination, undefined, {
          allowExtend: false
        })}
        selector=".brz-eventCalendar-pagination"
      >
        {({ ref: paginationRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarCell, undefined, {
              allowExtend: false
            })}
            selector=".brz-eventCalendar-month1 .brz-eventCalendar-day"
          >
            {({ ref: month1Ref }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(toolbarMonth2, undefined, {
                  allowExtend: false
                })}
                selector=".brz-eventCalendar-month2 .brz-eventCalendar-day"
              >
                {({ ref: month2Ref }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMonth3,
                      undefined,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-eventCalendar-month3 .brz-eventCalendar-day"
                  >
                    {({ ref: month3Ref }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMonth4,
                          undefined,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-eventCalendar-month4 .brz-eventCalendar-day"
                      >
                        {({ ref: month4Ref }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMonth5,
                              undefined,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-eventCalendar-month5 .brz-eventCalendar-day"
                          >
                            {({ ref: month5Ref }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarMonth6,
                                  undefined,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-eventCalendar-month6 .brz-eventCalendar-day"
                              >
                                {({ ref: month6Ref }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarMonth7,
                                      undefined,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-eventCalendar-month7 .brz-eventCalendar-day"
                                  >
                                    {({ ref: month7Ref }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarMonth8,
                                          undefined,
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-eventCalendar-month8 .brz-eventCalendar-day"
                                      >
                                        {({ ref: month8Ref }) => (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarMonth9,
                                              undefined,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-eventCalendar-month9 .brz-eventCalendar-day"
                                          >
                                            {({ ref: month9Ref }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarMonth10,
                                                  undefined,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-eventCalendar-month10 .brz-eventCalendar-day"
                                              >
                                                {({ ref: month10Ref }) => (
                                                  <Toolbar
                                                    {...this.makeToolbarPropsFromConfig2(
                                                      toolbarMonth11,
                                                      undefined,
                                                      {
                                                        allowExtend: false
                                                      }
                                                    )}
                                                    selector=".brz-eventCalendar-month11 .brz-eventCalendar-day"
                                                  >
                                                    {({ ref: month11Ref }) => (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarMonth12,
                                                          undefined,
                                                          {
                                                            allowExtend: false
                                                          }
                                                        )}
                                                        selector=".brz-eventCalendar-month12 .brz-eventCalendar-day"
                                                      >
                                                        {({
                                                          ref: month12Ref
                                                        }) => (
                                                          <Toolbar
                                                            {...this.makeToolbarPropsFromConfig2(
                                                              toolbarWeekdays,
                                                              undefined,
                                                              {
                                                                allowExtend:
                                                                  false
                                                              }
                                                            )}
                                                            selector=".brz-eventCalendar-row-weekdays"
                                                          >
                                                            {({
                                                              ref: weekDaysRef
                                                            }) => (
                                                              <Toolbar
                                                                {...this.makeToolbarPropsFromConfig2(
                                                                  toolbarArrow,
                                                                  undefined,
                                                                  {
                                                                    allowExtend:
                                                                      false
                                                                  }
                                                                )}
                                                                selector=".brz-eventCalendar-pagination a"
                                                              >
                                                                {({
                                                                  ref: paginationARef
                                                                }) => (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarDay,
                                                                      sidebarDay
                                                                    )}
                                                                    selector=".brz-eventCalendar-day-number span"
                                                                  >
                                                                    {({
                                                                      ref: dayNumberRef
                                                                    }) => (
                                                                      <Toolbar
                                                                        {...this.makeToolbarPropsFromConfig2(
                                                                          toolbarEmpty,
                                                                          undefined,
                                                                          {
                                                                            allowExtend:
                                                                              false
                                                                          }
                                                                        )}
                                                                        selector=".brz-eventCalendar-day-np"
                                                                      >
                                                                        {({
                                                                          ref: dayRef
                                                                        }) => (
                                                                          <Toolbar
                                                                            {...this.makeToolbarPropsFromConfig2(
                                                                              toolbarTitle,
                                                                              undefined,
                                                                              {
                                                                                allowExtend:
                                                                                  false
                                                                              }
                                                                            )}
                                                                            selector=".brz-eventCalendar-links"
                                                                          >
                                                                            {({
                                                                              ref: linksRef
                                                                            }) => (
                                                                              <Toolbar
                                                                                {...this.makeToolbarPropsFromConfig2(
                                                                                  toolbarEventStartTime,
                                                                                  undefined,
                                                                                  {
                                                                                    allowExtend:
                                                                                      false
                                                                                  }
                                                                                )}
                                                                                selector=".brz-eventCalendar-links .brz-eventCalendar__event-start-time"
                                                                              >
                                                                                {({
                                                                                  ref: startTimeRef
                                                                                }) => (
                                                                                  <Toolbar
                                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                                      toolbarSubscribeToCalendar,
                                                                                      sidebarSubscribeToCalendar,
                                                                                      {
                                                                                        allowExtend:
                                                                                          false
                                                                                      }
                                                                                    )}
                                                                                    selector=".brz-eventCalendar__subscribe"
                                                                                  >
                                                                                    {({
                                                                                      ref: subscribeRef
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
                                                                                                  this
                                                                                                    .calendarIcon,
                                                                                                  paginationRef,
                                                                                                  month1Ref,
                                                                                                  month2Ref,
                                                                                                  month3Ref,
                                                                                                  month4Ref,
                                                                                                  month5Ref,
                                                                                                  month6Ref,
                                                                                                  month7Ref,
                                                                                                  month8Ref,
                                                                                                  month9Ref,
                                                                                                  month10Ref,
                                                                                                  month11Ref,
                                                                                                  month12Ref,
                                                                                                  weekDaysRef,
                                                                                                  paginationARef,
                                                                                                  dayNumberRef,
                                                                                                  dayRef,
                                                                                                  linksRef,
                                                                                                  startTimeRef,
                                                                                                  subscribeRef
                                                                                                ]
                                                                                              );
                                                                                            }
                                                                                          }
                                                                                        )}
                                                                                      >
                                                                                        <DynamicContentHelper
                                                                                          placeholder={
                                                                                            placeholder
                                                                                          }
                                                                                          props={{
                                                                                            className:
                                                                                              "brz-ministryBrands brz-eventCalendar"
                                                                                          }}
                                                                                          blocked={
                                                                                            false
                                                                                          }
                                                                                          tagName="div"
                                                                                          onSuccess={
                                                                                            this
                                                                                              .handleDcDone
                                                                                          }
                                                                                        />
                                                                                        {
                                                                                          icon
                                                                                        }
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
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): React.ReactNode {
    const className = classnames(
      "brz-eventCalendar__wrapper",
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
    const { iconName, iconType } = this.getIconData();
    const icon = this.renderIconForView({ iconName, iconType });

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <DynamicContentHelper
          placeholder={getPlaceholder(v, icon)}
          props={{
            className: "brz-ministryBrands brz-eventCalendar"
          }}
          blocked={false}
          tagName="div"
        />
      </Wrapper>
    );
  }
}
