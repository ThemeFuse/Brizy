import classNames from "classnames";
import React from "react";
import { ReactElement } from "react";
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
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarMeta from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import { EkklesiaMessages } from "../utils/helpers";
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
    const config = Config.getAll();

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
      ToastNotification.warn(EkklesiaMessages["group_layout"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactElement {
    const className = classNames(
      "brz-groupLayout__wrapper",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
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
          {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
            allowExtend: false
          })}
          selector=".brz-groupLayout--item__content-heading"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarMeta, undefined, {
              allowExtend: false
            })}
            selector=".brz-groupLayout--item__content-meta"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarPreview, undefined, {
                allowExtend: false
              })}
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
                    undefined,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-groupLayout--item__content-detailButton"
                >
                  <Wrapper
                    {...this.makeWrapperProps({
                      className
                    })}
                  >
                    <DynamicContentHelper
                      placeholder={getPlaceholder(v)}
                      props={{
                        className: "brz-ministryBrands brz-groupLayout"
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
