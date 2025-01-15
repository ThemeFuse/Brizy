import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getEkklesiaMessages } from "visual/editorComponents/MinistryBrands/utils/helpers";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api/common";
import * as sidebarConfig from "../sidebar";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarParagraph from "../toolbarParagraph";
import * as toolbarTitle from "../toolbarTitle";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import type { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsArticleDetail extends EditorComponent<Value, Props> {
  static get componentId(): ElementTypes.MinistryBrandsArticleDetail {
    return ElementTypes.MinistryBrandsArticleDetail;
  }

  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  async componentDidMount() {
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

    const { recentArticles } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [{ value: { recentArticles }, module: { key: "articleRecent" } }]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["article_detail"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-articleDetail__wrapper",
      "brz-ministryBrands",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
          allowExtend: false
        })}
        selector=".brz-articleDetail__item--meta--title"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarMetaTypography,
            undefined,
            {
              allowExtend: false
            }
          )}
          selector=".brz-articleDetail__item--meta"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarMetaIcons, undefined, {
              allowExtend: false
            })}
            selector=".brz-ministryBrands__meta--icons"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarExtendButtons,
                undefined,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-articleDetail__item--media a"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarParagraph,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-articleDetail__item--content *"
              >
                <Toolbar
                  {...this.makeToolbarPropsFromConfig2(
                    toolbarMetaLinks,
                    undefined,
                    {
                      allowExtend: false
                    }
                  )}
                  selector=".brz-ministryBrands__item--meta--links--previous"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarImage,
                      undefined,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--media"
                  >
                    <Wrapper
                      {...this.makeWrapperProps({
                        className
                      })}
                    >
                      <DynamicContentHelper
                        placeholder={getPlaceholder(v)}
                        props={{ className: "brz-articleDetail" }}
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
