import classnames from "classnames";
import React, { ReactNode } from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { attachRefs } from "visual/utils/react";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import * as sidebarExtendFilters from "../sidebarExtendFilters";
import { sidebarMinistryBrandsMeta } from "../sidebars/sidebars";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarImage from "../toolbarImage";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMedia from "../toolbarMedia";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarConfig from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { MBMetaPrefixKey } from "../utils/types";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsSermonLayout extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsSermonLayout {
    return ElementTypes.MinistryBrandsSermonLayout;
  }

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
          toolbarTitle,
          sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaTitle),
          {
            allowExtend: false
          }
        )}
        selector=".brz-ministryBrands__item--meta-title"
      >
        {({ ref: titleRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarConfig,
              sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaDate),
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-date"
          >
            {({ ref: dateRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarConfig,
                  sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaCategory),
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-category"
              >
                {({ ref: categoryRef }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarConfig,
                      sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaGroup),
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-group"
                  >
                    {({ ref: groupRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarConfig,
                          sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaSeries),
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-series"
                      >
                        {({ ref: seriesRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarConfig,
                              sidebarMinistryBrandsMeta(
                                MBMetaPrefixKey.metaPreacher
                              ),
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-preacher"
                          >
                            {({ ref: preacherRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarConfig,
                                  sidebarMinistryBrandsMeta(
                                    MBMetaPrefixKey.metaPassage
                                  ),
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item--meta-passage > .brz-sermonLayout__item--meta"
                              >
                                {({ ref: passageRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarLinksColor,
                                      undefined,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-sermonLayout__item :not(.brz-sermonLayout__item--meta--title, .brz-sermonLayout__item--detail-button, .brz-sermonLayout__item--media) a"
                                  >
                                    {({ ref: linkRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarMetaItemLinkColor,
                                          sidebarMinistryBrandsMeta(
                                            MBMetaPrefixKey.metaPassage
                                          ),
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-sermonLayout__item .brz-ministryBrands__item--meta-passage-content a"
                                      >
                                        {({ ref: linkPassageRef }) => (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarMedia,
                                              undefined,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-sermonLayout__item--media a"
                                          >
                                            {({ ref: mediaRef }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarPreview,
                                                  undefined,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-sermonLayout__item--preview"
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
                                                    selector=".brz-ministryBrands__pagination"
                                                  >
                                                    {({
                                                      ref: paginationRef
                                                    }) => (
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
                                                        {({
                                                          ref: filterRef
                                                        }) => (
                                                          <Toolbar
                                                            {...this.makeToolbarPropsFromConfig2(
                                                              toolbarExtendButtons,
                                                              sidebarExtendButtons,
                                                              {
                                                                allowExtend:
                                                                  false
                                                              }
                                                            )}
                                                            selector=".brz-sermonLayout__item--detail-button"
                                                          >
                                                            {({
                                                              ref: detailButtonRef
                                                            }) => (
                                                              <Toolbar
                                                                {...this.makeToolbarPropsFromConfig2(
                                                                  toolbarImage,
                                                                  undefined,
                                                                  {
                                                                    allowExtend:
                                                                      false
                                                                  }
                                                                )}
                                                                selector=".brz-ministryBrands__item--media"
                                                              >
                                                                {({
                                                                  ref: mediaItemRef
                                                                }) => (
                                                                  <Toolbar
                                                                    {...this.makeToolbarPropsFromConfig2(
                                                                      toolbarMetaIcons,
                                                                      undefined,
                                                                      {
                                                                        allowExtend:
                                                                          false
                                                                      }
                                                                    )}
                                                                    selector=".brz-ministryBrands__meta--icons"
                                                                  >
                                                                    {({
                                                                      ref: iconsRef
                                                                    }) => (
                                                                      <Wrapper
                                                                        {...this.makeWrapperProps(
                                                                          {
                                                                            className:
                                                                              "brz-sermonLayout__wrapper",
                                                                            ref: (
                                                                              el
                                                                            ) => {
                                                                              attachRefs(
                                                                                el,
                                                                                [
                                                                                  titleRef,
                                                                                  dateRef,
                                                                                  categoryRef,
                                                                                  groupRef,
                                                                                  seriesRef,
                                                                                  preacherRef,
                                                                                  passageRef,
                                                                                  linkRef,
                                                                                  linkPassageRef,
                                                                                  mediaRef,
                                                                                  previewRef,
                                                                                  paginationRef,
                                                                                  filterRef,
                                                                                  detailButtonRef,
                                                                                  mediaItemRef,
                                                                                  iconsRef
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
                                                                            className
                                                                          }}
                                                                          blocked={
                                                                            false
                                                                          }
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
                )}
              </Toolbar>
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}
