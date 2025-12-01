import classnames from "classnames";
import React from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import * as sidebarExtendFilters from "../sidebarExtendFilters";
import { sidebarMinistryBrandsMeta } from "../sidebars/sidebars";
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarImage from "../toolbarImage";
import * as toolbarMedia from "../toolbarMedia";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import { getEkklesiaMessages } from "../utils/helpers";
import { MBMetaPrefixKey } from "../utils/types";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { getPlaceholder } from "./utils/dynamicContent";
import type { Props, Value } from "./utils/types";

export class MinistryBrandsArticleLayout extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsArticleLayout {
    return ElementTypes.MinistryBrandsArticleLayout;
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

    const {
      parentCategory,
      categoryFilterParent,
      addCategoryFilterParent,
      addCategoryFilterParent2,
      addCategoryFilterParent3
    } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        {
          value: { parentCategory },
          module: { key: "articlesLvl", subKey: "parents" }
        },
        {
          value: { categoryFilterParent },
          module: { key: "articlesLvl", subKey: "childs" }
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
      ToastNotification.warn(getEkklesiaMessages()["article_layout"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): JSX.Element {
    const className = classnames(
      "brz-articleLayout__wrapper",
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
        {...this.makeToolbarPropsFromConfig2(
          toolbarExtendFilters,
          sidebarExtendFilters,
          {
            allowExtend: false
          }
        )}
        selector=".brz-articleLayout__filters"
      >
        {({ ref: filtersRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarImage, undefined, {
              allowExtend: false
            })}
            selector=".brz-ministryBrands__item--media"
          >
            {({ ref: mediaRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarTitle,
                  sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaTitle),
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-articleLayout__heading"
              >
                {({ ref: headingRef }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMedia,
                      undefined,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-articleLayout__media a"
                  >
                    {({ ref: anchorRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarDate,
                          sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaDate),
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item.brz-ministryBrands__item--meta-date"
                      >
                        {({ ref: dateRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarDate,
                              sidebarMinistryBrandsMeta(
                                MBMetaPrefixKey.metaCategory
                              ),
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item.brz-ministryBrands__item--meta-category"
                          >
                            {({ ref: categoryRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarDate,
                                  sidebarMinistryBrandsMeta(
                                    MBMetaPrefixKey.metaGroup
                                  ),
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item.brz-ministryBrands__item--meta-group"
                              >
                                {({ ref: groupRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarDate,
                                      sidebarMinistryBrandsMeta(
                                        MBMetaPrefixKey.metaSeries
                                      ),
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item.brz-ministryBrands__item--meta-series"
                                  >
                                    {({ ref: seriesRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarDate,
                                          sidebarMinistryBrandsMeta(
                                            MBMetaPrefixKey.metaAuthor
                                          ),
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-ministryBrands__item.brz-ministryBrands__item--meta-author"
                                      >
                                        {({ ref: authorRef }) => (
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
                                                  sidebarExtendButtons,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-articleLayout__detail_button"
                                              >
                                                {({ ref: buttonRef }) => (
                                                  <Toolbar
                                                    {...this.makeToolbarPropsFromConfig2(
                                                      toolbarPreview,
                                                      undefined,
                                                      {
                                                        allowExtend: false
                                                      }
                                                    )}
                                                    selector=".brz-articleLayout__preview"
                                                  >
                                                    {({ ref: previewRef }) => (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarPagination,
                                                          undefined,
                                                          {
                                                            allowExtend: false
                                                          }
                                                        )}
                                                        selector=".brz-articleLayout__pagination"
                                                      >
                                                        {({
                                                          ref: paginationRef
                                                        }) => (
                                                          <Wrapper
                                                            {...this.makeWrapperProps(
                                                              {
                                                                className,
                                                                ref: (el) => {
                                                                  attachRefs(
                                                                    el,
                                                                    [
                                                                      filtersRef,
                                                                      mediaRef,
                                                                      headingRef,
                                                                      anchorRef,
                                                                      dateRef,
                                                                      categoryRef,
                                                                      groupRef,
                                                                      seriesRef,
                                                                      authorRef,
                                                                      iconsRef,
                                                                      buttonRef,
                                                                      previewRef,
                                                                      paginationRef
                                                                    ]
                                                                  );
                                                                }
                                                              }
                                                            )}
                                                          >
                                                            <DynamicContentHelper
                                                              placeholder={getPlaceholder(
                                                                v
                                                              )}
                                                              props={{
                                                                className:
                                                                  "brz-ministryBrands brz-articleLayout"
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
