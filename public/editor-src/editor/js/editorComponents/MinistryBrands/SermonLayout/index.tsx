import classnames from "classnames";
import React, { ReactNode } from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { css } from "visual/utils/cssStyle";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendFilters from "../sidebarExtendFilters";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarConfig from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendButtons from "./toolbarExtendButtons";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils";

export class SermonLayout extends EditorComponent<Value, Props> {
  static get componentId(): "SermonLayout" {
    return "SermonLayout";
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
      "brz-ministryBrands",
      "brz-sermonLayout",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
          allowExtend: false
        })}
        selector=".brz-sermonLayout__item--meta--title"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarMetaLinks, undefined, {
            allowExtend: false
          })}
          selector=".brz-sermonLayout__item a:not(.brz-sermonLayout__item--meta--title a):not(.brz-sermonLayout__item--detail-button a)"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarConfig, undefined, {
              allowExtend: false
            })}
            selector=".brz-sermonLayout__item--meta"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarPreview, undefined, {
                allowExtend: false
              })}
              selector=".brz-sermonLayout__item--preview"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarPagination,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__pagination"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarExtendFilters,
                    sidebarExtendFilters,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-sermonLayout__filter"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarExtendButtons,
                      undefined,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-sermonLayout__item--detail-button"
                  >
                    <Wrapper
                      {...this.makeWrapperProps({
                        className: "brz-sermonLayout__wrapper"
                      })}
                    >
                      <DynamicContentHelper
                        placeholder={getPlaceholder(v)}
                        props={{ className }}
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
    );
  }
}
