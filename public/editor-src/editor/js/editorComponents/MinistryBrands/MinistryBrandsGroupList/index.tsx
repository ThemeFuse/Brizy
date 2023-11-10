import classnames from "classnames";
import React, { ReactNode } from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { css } from "visual/utils/cssStyle";
import * as sidebarConfig from "../sidebar";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsGroupList extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsGroupList" {
    return "MinistryBrandsGroupList";
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
      "brz-groupList__wrapper",
      "brz-ministryBrands",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
          allowExtend: false
        })}
        selector=".brz-groupList__item--meta--title"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarLinksColor, undefined, {
            allowExtend: false
          })}
          selector=".brz-groupList__item :not(.brz-groupList__item--meta--title) a"
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
                toolbarMetaTypography,
                undefined,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-groupList__item--meta"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarPreview,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-groupList__item--meta--preview *:not(a)"
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
                      props={{ className: "brz-groupList" }}
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
