import classnames from "classnames";
import React, { ReactNode } from "react";
import { ToastNotification } from "visual/component/Notifications";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { updateEkklesiaFields } from "visual/utils/api/common";
import { attachRefs } from "visual/utils/react";
import * as sidebarConfig from "../sidebar";
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import {
  sidebarMinistryBrandsMetaCategory,
  sidebarMinistryBrandsMetaDate,
  sidebarMinistryBrandsMetaGroup,
  sidebarMinistryBrandsMetaPassage,
  sidebarMinistryBrandsMetaPreacher,
  sidebarMinistryBrandsMetaSeries,
  sidebarMinistryBrandsMetaTitle
} from "../sidebars/sidebars";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaLinks from "../toolbarMetaLinks";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsSermonDetail extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): "MinistryBrandsSermonDetail" {
    return "MinistryBrandsSermonDetail";
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
    const { recentSermons } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [{ value: { recentSermons }, module: { key: "recentSermons" } }]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["sermon_detail"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-sermonDetail__wrapper",
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
              toolbarMetaTypography,
              sidebarMinistryBrandsMetaDate,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-date"
          >
            {({ ref: metaRef }) => (
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
                {({ ref: metaCategoryRef }) => (
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
                    {({ ref: metaGroupRef }) => (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarMetaTypography,
                          sidebarMinistryBrandsMetaSeries,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-series"
                      >
                        {({ ref: metaSeriesRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMetaTypography,
                              sidebarMinistryBrandsMetaPreacher,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-preacher"
                          >
                            {({ ref: metaPreacherRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarMetaTypography,
                                  sidebarMinistryBrandsMetaPassage,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item--meta-passage > .brz-sermonDetail__item--meta"
                              >
                                {({ ref: metaPassageRef }) => (
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
                                    {({ ref: linksRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarLinksColor,
                                          undefined,
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-sermonDetail__item--meta--links a"
                                      >
                                        {({ ref: linksColorRef }) => (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarMetaItemLinkColor,
                                              sidebarMinistryBrandsMetaPassage,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-ministryBrands__item--meta-passage a"
                                          >
                                            {({
                                              ref: metaItemLinkColorRef
                                            }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarExtendButtons,
                                                  sidebarExtendButtons,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-sermonDetail__item--media a"
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
                                                    selector=".brz-sermonDetail__item--meta--preview"
                                                  >
                                                    {({ ref: previewRef }) => (
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
                                                        {({
                                                          ref: imageRef
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
                                                              ref: metaIconsRef
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
                                                                          metaRef,
                                                                          metaIconsRef,
                                                                          metaGroupRef,
                                                                          metaSeriesRef,
                                                                          metaPreacherRef,
                                                                          metaPassageRef,
                                                                          linksRef,
                                                                          linksColorRef,
                                                                          metaItemLinkColorRef,
                                                                          mediaRef,
                                                                          previewRef,
                                                                          imageRef,
                                                                          metaCategoryRef
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
                                                                      "brz-sermonDetail"
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
    );
  }
}
