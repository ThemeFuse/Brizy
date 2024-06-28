import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api/common";
import { css } from "visual/utils/cssStyle";
import * as sidebarConfig from "../sidebar";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMedia from "../toolbarMedia";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import { EkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsArticleFeatured extends EditorComponent<
  Value,
  Props
> {
  static get componentId(): ElementTypes.MinistryBrandsArticleFeatured {
    return ElementTypes.MinistryBrandsArticleFeatured;
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

    const { category, group, recentArticles } = this.getValue();
    const config = Config.getAll();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "articleCategories" } },
        { value: { group }, module: { key: "groups" } },
        { value: { recentArticles }, module: { key: "articleRecent" } }
      ]
    });

    if (changedKeys) {
      ToastNotification.warn(EkklesiaMessages["article_featured"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-articleFeatured__wrapper",
      "brz-ministryBrands",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
          allowExtend: false
        })}
        selector=".brz-articleFeatured__item--meta--title"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarMedia, undefined, {
            allowExtend: false
          })}
          selector=".brz-articleFeatured__item--media--links a"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarLinksColor, undefined, {
              allowExtend: false
            })}
            selector=":is(.brz-articleFeatured__item--meta--link, .brz-articleFeatured__item--meta--preview) a"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarMetaTypography,
                undefined,
                { allowExtend: false }
              )}
              selector=".brz-articleFeatured__item--meta"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarMetaIcons,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
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
                  selector=".brz-ministryBrands__item--meta--button"
                >
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarPreview,
                      undefined,
                      { allowExtend: false }
                    )}
                    selector=".brz-articleFeatured__item--meta--preview *:not(:is(:has(a),a))"
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
                          props={{ className: "brz-articleFeatured" }}
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
