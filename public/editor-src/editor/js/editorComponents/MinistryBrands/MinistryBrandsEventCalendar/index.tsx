import classnames from "classnames";
import React, { ReactNode } from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarDay from "./sidebarDay";
import { style } from "./styles";
import * as toolbarCell from "./toolbarCell";
import * as toolbarDay from "./toolbarDay";
import * as toolbarEmpty from "./toolbarEmpty";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarPagination from "./toolbarPagination";
import * as toolbarTitle from "./toolbarTitle";
import * as toolbarWeekdays from "./toolbarWeekdays";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils";

export class MinistryBrandsEventCalendar extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsEventCalendar" {
    return "MinistryBrandsEventCalendar";
  }
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  componentDidMount(): void {
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
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-eventCalendar__wrapper",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

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
          selector=".brz-eventCalendar-day"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarWeekdays, undefined, {
              allowExtend: false
            })}
            selector=".brz-eventCalendar-row-weekdays"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarDay, sidebarDay)}
              selector=".brz-eventCalendar-day-number span"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(toolbarEmpty, undefined, {
                  allowExtend: false
                })}
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
                  <Wrapper
                    {...this.makeWrapperProps({
                      className
                    })}
                  >
                    <DynamicContentHelper
                      placeholder={getPlaceholder(v)}
                      props={{
                        className: "brz-ministryBrands brz-eventCalendar"
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
    );
  }
}
