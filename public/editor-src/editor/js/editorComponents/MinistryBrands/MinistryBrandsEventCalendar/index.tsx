import classnames from "classnames";
import React, { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ToastNotification } from "visual/component/Notifications";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  Props as ModelProps
} from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import Config from "visual/global/Config";
import { updateEkklesiaFields } from "visual/utils/api/common";
import { css } from "visual/utils/cssStyle";
import * as Str from "visual/utils/string/specs";
import { EkklesiaMessages } from "../utils/helpers";
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
import * as toolbarMonth10 from "./toolbarMonths/toolbarMonth10";
import * as toolbarMonth11 from "./toolbarMonths/toolbarMonth11";
import * as toolbarMonth12 from "./toolbarMonths/toolbarMonth12";
import * as toolbarMonth2 from "./toolbarMonths/toolbarMonth2";
import * as toolbarMonth3 from "./toolbarMonths/toolbarMonth3";
import * as toolbarMonth4 from "./toolbarMonths/toolbarMonth4";
import * as toolbarMonth5 from "./toolbarMonths/toolbarMonth5";
import * as toolbarMonth6 from "./toolbarMonths/toolbarMonth6";
import * as toolbarMonth7 from "./toolbarMonths/toolbarMonth7";
import * as toolbarMonth8 from "./toolbarMonths/toolbarMonth8";
import * as toolbarMonth9 from "./toolbarMonths/toolbarMonth9";
import * as toolbarPagination from "./toolbarPagination";
import * as toolbarSubscribeToCalendar from "./toolbarSubscribeToCalendar";
import * as toolbarTitle from "./toolbarTitle";
import * as toolbarWeekdays from "./toolbarWeekdays";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventCalendar extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsEventCalendar" {
    return "MinistryBrandsEventCalendar";
  }
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  calendarIcon = React.createRef<Element>();
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
    const config = Config.getAll();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "event" } },
        { value: { group }, module: { key: "groups" } }
      ]
    });
    if (changedKeys) {
      ToastNotification.warn(EkklesiaMessages["event_calendar"]);
      this.patchValue(changedKeys);
    }
  }

  componentDidUpdate(prevProps: ModelProps<Value, Props>): void {
    const { iconName, iconType, iconFilename } = this.getIconData();
    const { iconName: prevIconName, iconType: prevIconType } =
      prevProps.dbValue;

    const _prevIconName = Str.read(prevIconName);
    const _prevIconType = Str.read(prevIconType);

    if (iconName !== _prevIconName || iconType !== _prevIconType) {
      this.renderIcon({ iconName, iconType, iconFilename });
    }
  }

  getIconData() {
    const v = this.getValue();
    const { iconName, iconType, iconFilename } = v;

    return {
      iconName: Str.read(iconName) ?? "",
      iconType: Str.read(iconType) ?? "",
      iconFilename: Str.read(iconFilename) ?? ""
    };
  }

  renderIcon = ({
    iconName,
    iconType,
    iconFilename
  }: {
    iconName: string;
    iconType: string;
    iconFilename: string;
  }) => {
    const iconContainer = this.calendarIcon.current?.querySelector(
      ".brz-eventCalendar__subscribe__icon"
    );

    if (!iconContainer) return;

    const newIcon =
      iconName && iconType ? (
        <ThemeIcon name={iconName} type={iconType} filename={iconFilename} />
      ) : (
        <></>
      );

    const root = createRoot(iconContainer);
    root.render(newIcon);
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { iconName, iconType, iconFilename } = this.getIconData();
    const className = classnames(
      "brz-eventCalendar__wrapper",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    const icon =
      IS_EDITOR || (!iconName && !iconType)
        ? ""
        : `<svg class='brz-icon-svg align-[initial]' data-name='${iconName}' data-type='${iconType}'></svg>`;

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarPagination, undefined, {
          allowExtend: false
        })}
        selector=".brz-eventCalendar-pagination"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarCell, undefined, {
            allowExtend: false
          })}
          selector=".brz-eventCalendar-month1 .brz-eventCalendar-day"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarMonth2, undefined, {
              allowExtend: false
            })}
            selector=".brz-eventCalendar-month2 .brz-eventCalendar-day"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarMonth3, undefined, {
                allowExtend: false
              })}
              selector=".brz-eventCalendar-month3 .brz-eventCalendar-day"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(toolbarMonth4, undefined, {
                  allowExtend: false
                })}
                selector=".brz-eventCalendar-month4 .brz-eventCalendar-day"
              >
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
                                <Toolbar
                                  {...this.makeToolbarPropsFromConfig2(
                                    toolbarWeekdays,
                                    undefined,
                                    {
                                      allowExtend: false
                                    }
                                  )}
                                  selector=".brz-eventCalendar-row-weekdays"
                                >
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarArrow,
                                      undefined,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-eventCalendar-pagination a"
                                  >
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarDay,
                                        sidebarDay
                                      )}
                                      selector=".brz-eventCalendar-day-number span"
                                    >
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarEmpty,
                                          undefined,
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-eventCalendar-day-np"
                                      >
                                        <Toolbar
                                          {...this.makeToolbarPropsFromConfig2(
                                            toolbarTitle,
                                            undefined,
                                            {
                                              allowExtend: false
                                            }
                                          )}
                                          selector=".brz-eventCalendar-links"
                                        >
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarEventStartTime,
                                              undefined,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-eventCalendar-links .brz-eventCalendar__event-start-time"
                                          >
                                            <Toolbar
                                              {...this.makeToolbarPropsFromConfig2(
                                                toolbarSubscribeToCalendar,
                                                sidebarSubscribeToCalendar,
                                                {
                                                  allowExtend: false
                                                }
                                              )}
                                              selector=".brz-eventCalendar__subscribe"
                                            >
                                              <Wrapper
                                                {...this.makeWrapperProps({
                                                  className,
                                                  ref: this.calendarIcon
                                                })}
                                              >
                                                <DynamicContentHelper
                                                  placeholder={getPlaceholder(
                                                    v,
                                                    icon
                                                  )}
                                                  props={{
                                                    className:
                                                      "brz-ministryBrands brz-eventCalendar"
                                                  }}
                                                  blocked={false}
                                                  tagName="div"
                                                  onSuccess={() =>
                                                    this.renderIcon({
                                                      iconName,
                                                      iconType,
                                                      iconFilename
                                                    })
                                                  }
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
    );
  }
}
