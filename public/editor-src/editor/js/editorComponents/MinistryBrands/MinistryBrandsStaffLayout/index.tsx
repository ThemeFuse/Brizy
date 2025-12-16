import classNames from "classnames";
import React from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import * as toolbarPagination from "visual/editorComponents/MinistryBrands/toolbarPagination";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendFilters from "../sidebarExtendFilters";
import { sidebarMinistryBrandsMeta } from "../sidebars/sidebars";
import * as toolbarExtendFilters from "../toolbarExtendFilters";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarSocial from "../toolbarSocial";
import * as toolbarSocialDescription from "../toolbarSocialDescription";
import * as toolbarImage from "../toolbars/toolbarMinistryStaffImage";
import { toolbarMinistryBrandsMeta } from "../toolbars/toolbars";
import { MBMetaPrefixKey } from "../utils/types";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import type { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsStaffLayout extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.MinistryBrandsStaffLayout {
    return ElementTypes.MinistryBrandsStaffLayout;
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

  renderForEdit(v: Value, vs: Value, vd: Value): JSX.Element {
    const className = classNames(
      "brz-staffLayout__wrapper",
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
        selector=".brz-staffLayout__filters"
      >
        {({ ref: filtersRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarMinistryBrandsMeta(MBMetaPrefixKey.metaTitle),
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
                  toolbarMinistryBrandsMeta(MBMetaPrefixKey.metaPosition),
                  sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaPosition),
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-position"
              >
                {({ ref: positionRef }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMinistryBrandsMeta(MBMetaPrefixKey.metaText),
                      sidebarMinistryBrandsMeta(MBMetaPrefixKey.metaGroup),
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-groups"
                  >
                    {({ ref: groupsRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMinistryBrandsMeta(MBMetaPrefixKey.metaText),
                          sidebarMinistryBrandsMeta(
                            MBMetaPrefixKey.metaWorkphone
                          ),
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-workphone"
                      >
                        {({ ref: workphoneRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMinistryBrandsMeta(
                                MBMetaPrefixKey.metaText
                              ),
                              sidebarMinistryBrandsMeta(
                                MBMetaPrefixKey.metaCellphone
                              ),
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-cellphone"
                          >
                            {({ ref: cellphoneRef }) => (
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
                                {({ ref: mediaRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarSocialDescription,
                                      undefined,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-staffLayout_rollover_inner--description"
                                  >
                                    {({ ref: emailRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarMinistryBrandsMeta(
                                            MBMetaPrefixKey.metaEmail
                                          ),
                                          sidebarMinistryBrandsMeta(
                                            MBMetaPrefixKey.metaEmail
                                          ),
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-ministryBrands__item--meta-full-email"
                                      >
                                        {({ ref: descriptionRef }) => (
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
                                                  toolbarSocial,
                                                  undefined,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-staffLayout_social > li"
                                              >
                                                {({ ref: paginationRef }) => (
                                                  <Toolbar
                                                    {...this.makeToolbarPropsFromConfig2(
                                                      toolbarPagination,
                                                      undefined,
                                                      {
                                                        allowExtend: false
                                                      }
                                                    )}
                                                    selector=".brz-staffLayout__pagination"
                                                  >
                                                    {({ ref: itemRef }) => (
                                                      <Wrapper
                                                        {...this.makeWrapperProps(
                                                          {
                                                            className,
                                                            ref: (el) => {
                                                              attachRefs(el, [
                                                                filtersRef,
                                                                titleRef,
                                                                positionRef,
                                                                groupsRef,
                                                                workphoneRef,
                                                                cellphoneRef,
                                                                mediaRef,
                                                                descriptionRef,
                                                                iconsRef,
                                                                itemRef,
                                                                emailRef,
                                                                paginationRef
                                                              ]);
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
                                                              "brz-ministryBrands brz-staffLayout"
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
    );
  }
}
