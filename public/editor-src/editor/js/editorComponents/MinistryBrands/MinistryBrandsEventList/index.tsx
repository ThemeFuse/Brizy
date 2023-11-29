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
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarRegisterButton from "../toolbarRegisterButton";
import * as toolbarTitle from "../toolbarTitle";
import { EkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventList extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsEventList" {
    return "MinistryBrandsEventList";
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

    const { category, group } = this.getValue();
    const config = Config.getAll();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "event" } },
        { value: { group }, module: { key: "groups" } }
      ]
    });

    if (changedKeys) {
      ToastNotification.warn(EkklesiaMessages["event_list"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-eventList__wrapper",
      "brz-ministryBrands",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
          allowExtend: false
        })}
        selector=".brz-eventList__item--meta--title"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarDate, undefined, {
            allowExtend: false
          })}
          selector=".brz-eventList__item--meta--date"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarExtendButtons,
              undefined,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta--button"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarRegisterButton,
                undefined,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-ministryBrands__item--meta--register-button"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarPreview,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-eventList__item--meta--preview"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarLinksColor,
                    undefined,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-eventList__item--meta--link a"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMetaTypography,
                      undefined,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-eventList__item--meta"
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
                      <Wrapper
                        {...this.makeWrapperProps({
                          className
                        })}
                      >
                        <DynamicContentHelper
                          placeholder={getPlaceholder(v)}
                          props={{ className: "brz-eventList" }}
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
    );
  }
}
