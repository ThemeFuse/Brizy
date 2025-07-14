import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMedia from "../toolbarMedia";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsArticleFeatured extends EditorComponent<
  Value,
  Props
> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsArticleFeatured {
    return ElementTypes.MinistryBrandsArticleFeatured;
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

    const { category, group, recentArticles } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "articleCategories" } },
        { value: { group }, module: { key: "groups" } },
        { value: { recentArticles }, module: { key: "articleRecent" } }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["article_featured"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-articleFeatured__wrapper",
      "brz-ministryBrands",
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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarTitle, undefined, {
          allowExtend: false
        })}
        selector=".brz-articleFeatured__item--meta--title"
      >
        {({ ref: titleRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarMedia, undefined, {
              allowExtend: false
            })}
            selector=".brz-articleFeatured__item--media--links a"
          >
            {({ ref: linksRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarLinksColor,
                  undefined,
                  {
                    allowExtend: false
                  }
                )}
                selector=":is(.brz-articleFeatured__item--meta--link, .brz-articleFeatured__item--meta--preview) a"
              >
                {({ ref: previewRef }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMetaTypography,
                      undefined,
                      { allowExtend: false }
                    )}
                    selector=".brz-articleFeatured__item--meta"
                  >
                    {({ ref: itemMetaRef }) => (
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
                        {({ ref: iconsRef }) => (
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
                            {({ ref: buttonRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarPreview,
                                  undefined,
                                  { allowExtend: false }
                                )}
                                selector=".brz-articleFeatured__item--meta--preview *:not(:is(:has(a),a))"
                              >
                                {({ ref: metaPreviewRef }) => (
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
                                    {({ ref: itemMediaRef }) => (
                                      <Wrapper
                                        {...this.makeWrapperProps({
                                          className,
                                          ref: (el) => {
                                            attachRefs(el, [
                                              titleRef,
                                              linksRef,
                                              previewRef,
                                              itemMetaRef,
                                              iconsRef,
                                              buttonRef,
                                              metaPreviewRef,
                                              itemMediaRef
                                            ]);
                                          }
                                        })}
                                      >
                                        <DynamicContentHelper
                                          placeholder={getPlaceholder(v)}
                                          props={{
                                            className: "brz-articleFeatured"
                                          }}
                                          blocked={false}
                                          tagName="div"
                                        />
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
    );
  }
}
