import classnames from "classnames";
import React, { ReactNode } from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { css } from "visual/utils/cssStyle";
import * as sidebarConfig from "../sidebar";
import * as toolbarDate from "../toolbarDate";
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils";

export class MinistryBrandsGroupDetail extends EditorComponent<Value, Props> {
  static get componentId(): "MinistryBrandsGroupDetail" {
    return "MinistryBrandsGroupDetail";
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
      "brz-groupDetail__wrapper",
      "brz-ministryBrands",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
          allowExtend: false
        })}
        selector=".brz-groupDetail__item--meta--title"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarDate, undefined, {
            allowExtend: false
          })}
          selector=".brz-groupDetail__item--meta--date"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarMetaLinks, undefined, {
              allowExtend: false
            })}
            selector=":is(.brz-groupDetail__item a, .brz-ministryBrands__item--meta--links)"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarMetaTypography,
                undefined,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-groupDetail__item--meta"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarPreview,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-groupDetail__item--meta--preview *"
              >
                <Wrapper
                  {...this.makeWrapperProps({
                    className
                  })}
                >
                  <DynamicContentHelper
                    placeholder={getPlaceholder(v)}
                    props={{ className: "brz-groupDetail" }}
                    blocked={false}
                    tagName="div"
                  />
                </Wrapper>
              </Toolbar>
            </Toolbar>
          </Toolbar>
        </Toolbar>
      </Toolbar>
    );
  }
}
