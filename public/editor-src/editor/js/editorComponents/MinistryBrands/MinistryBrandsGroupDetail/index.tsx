import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { updateEkklesiaFields } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import {
  sidebarMinistryBrandsMetaCategory,
  sidebarMinistryBrandsMetaChildcare,
  sidebarMinistryBrandsMetaDay,
  sidebarMinistryBrandsMetaGroup,
  sidebarMinistryBrandsMetaResourceLink,
  sidebarMinistryBrandsMetaStatus,
  sidebarMinistryBrandsMetaTimes,
  sidebarMinistryBrandsMetaTitle
} from "../sidebars/sidebars";
import * as toolbarDate from "../toolbarDate";
import * as toolbarH4 from "../toolbarH4";
import * as toolbarImage from "../toolbarImage";
import * as toolbarList from "../toolbarList";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarParagraph from "../toolbarParagraph";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsGroupDetail extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): "MinistryBrandsGroupDetail" {
    return "MinistryBrandsGroupDetail";
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
    const { groupsRecent } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [{ value: { groupsRecent }, module: { key: "smallgroups" } }]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["group_detail"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-groupDetail__wrapper",
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
        {...this.makeToolbarPropsFromConfig2(
          toolbarTitle,
          sidebarMinistryBrandsMetaTitle,
          {
            allowExtend: false
          }
        )}
        selector=".brz-ministryBrands__item--meta-title"
      >
        {({ ref: titleRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarDate,
              sidebarMinistryBrandsMetaDay,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-day"
          >
            {({ ref: dayRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarDate,
                  sidebarMinistryBrandsMetaTimes,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-ministryBrands__item--meta-times"
              >
                {({ ref: timesRef }) => (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      toolbarMetaTypography,
                      sidebarMinistryBrandsMetaCategory,
                      {
                        allowExtend: false
                      }
                    )}
                    selector=".brz-ministryBrands__item--meta-category"
                  >
                    {({ ref: categoryRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMetaTypography,
                          sidebarMinistryBrandsMetaGroup,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-group"
                      >
                        {({ ref: groupRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMetaTypography,
                              sidebarMinistryBrandsMetaStatus,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-status"
                          >
                            {({ ref: statusRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarMetaTypography,
                                  sidebarMinistryBrandsMetaChildcare,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item--meta-childcare"
                              >
                                {({ ref: childcareRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarMetaTypography,
                                      sidebarMinistryBrandsMetaResourceLink,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--meta-resourceLink > span"
                                  >
                                    {({ ref: resourceLinkRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarMetaLinks,
                                          undefined,
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-ministryBrands__item--meta--links"
                                      >
                                        {({ ref: linksRef }) => (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarMetaItemLinkColor,
                                              sidebarMinistryBrandsMetaResourceLink,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-ministryBrands__item--meta-resourceLink > a"
                                          >
                                            {({ ref: resourceLinkARef }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarParagraph,
                                                  undefined,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-groupDetail__item--meta--preview p"
                                              >
                                                {({ ref: previewRef }) => (
                                                  <Toolbar
                                                    {...this.makeToolbarPropsFromConfig2(
                                                      toolbarH4,
                                                      undefined,
                                                      {
                                                        allowExtend: false
                                                      }
                                                    )}
                                                    selector=".brz-groupDetail__item--meta--preview h4"
                                                  >
                                                    {({ ref: h4Ref }) => (
                                                      <Toolbar
                                                        {...this.makeToolbarPropsFromConfig2(
                                                          toolbarList,
                                                          undefined,
                                                          {
                                                            allowExtend: false
                                                          }
                                                        )}
                                                        selector=".brz-groupDetail__item--meta--preview ul"
                                                      >
                                                        {({ ref: ulRef }) => (
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
                                                              ref: mediaRef
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
                                                                  ref: iconsMetaRef
                                                                }) => (
                                                                  <Wrapper
                                                                    {...this.makeWrapperProps(
                                                                      {
                                                                        className,
                                                                        ref: (
                                                                          el
                                                                        ) => {
                                                                          attachRefs(
                                                                            el,
                                                                            [
                                                                              titleRef,
                                                                              dayRef,
                                                                              timesRef,
                                                                              categoryRef,
                                                                              groupRef,
                                                                              statusRef,
                                                                              childcareRef,
                                                                              resourceLinkRef,
                                                                              linksRef,
                                                                              resourceLinkARef,
                                                                              previewRef,
                                                                              h4Ref,
                                                                              ulRef,
                                                                              mediaRef,
                                                                              iconsMetaRef
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
                                                                          "brz-groupDetail"
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
    );
  }
}
