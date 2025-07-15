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
import * as sidebarExtendButtons from "../sidebarExtendButtons";
import {
  sidebarMinistryBrandsMetaAddress,
  sidebarMinistryBrandsMetaCategory,
  sidebarMinistryBrandsMetaDate,
  sidebarMinistryBrandsMetaGroup,
  sidebarMinistryBrandsMetaLocation,
  sidebarMinistryBrandsMetaTitle
} from "../sidebars/sidebars";
import * as toolbarDate from "../toolbarDate";
import * as toolbarExtendButtons from "../toolbarExtendButtons";
import * as toolbarImage from "../toolbarImage";
import * as toolbarLinksColor from "../toolbarLinksColor";
import * as toolbarMetaIcons from "../toolbarMetaIcons";
import * as toolbarMetaTypography from "../toolbarMetaTypography";
import * as toolbarPagination from "../toolbarPagination";
import * as toolbarPreview from "../toolbarPreview";
import * as toolbarRegisterButton from "../toolbarRegisterButton";
import * as toolbarTitle from "../toolbarTitle";
import * as toolbarMetaItemLinkColor from "../toolbars/toolbarMetaItemLinkColor";
import { getEkklesiaMessages } from "../utils/helpers";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Props, Value } from "./types";
import { getPlaceholder } from "./utils/dynamicContent";

export class MinistryBrandsEventList extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): "MinistryBrandsEventList" {
    return "MinistryBrandsEventList";
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

    const { category, group } = this.getValue();
    const config = this.getGlobalConfig();

    const changedKeys = await updateEkklesiaFields(config, {
      fields: [
        { value: { category }, module: { key: "event" } },
        { value: { group }, module: { key: "groups" } }
      ]
    });

    if (changedKeys) {
      const messages = getEkklesiaMessages();
      ToastNotification.warn(messages["event_list"]);
      this.patchValue(changedKeys);
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-eventList__wrapper",
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
              sidebarMinistryBrandsMetaDate,
              {
                allowExtend: false
              }
            )}
            selector=".brz-ministryBrands__item--meta-date"
          >
            {({ ref: dateRef }) => (
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
                          sidebarMinistryBrandsMetaLocation,
                          {
                            allowExtend: false
                          }
                        )}
                        selector=".brz-ministryBrands__item--meta-location"
                      >
                        {({ ref: locationRef }) => (
                          <Toolbar
                            {...this.makeToolbarPropsFromConfig2(
                              toolbarMetaTypography,
                              sidebarMinistryBrandsMetaAddress,
                              {
                                allowExtend: false
                              }
                            )}
                            selector=".brz-ministryBrands__item--meta-address > .brz-eventList__item--meta"
                          >
                            {({ ref: addressRef }) => (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  toolbarExtendButtons,
                                  sidebarExtendButtons,
                                  {
                                    allowExtend: false
                                  }
                                )}
                                selector=".brz-ministryBrands__item--meta--button"
                              >
                                {({ ref: buttonRef }) => (
                                  <Toolbar
                                    {...this.makeToolbarPropsFromConfig2(
                                      toolbarRegisterButton,
                                      sidebarExtendButtons,
                                      {
                                        allowExtend: false
                                      }
                                    )}
                                    selector=".brz-ministryBrands__item--meta--register-button"
                                  >
                                    {({ ref: registerButtonRef }) => (
                                      <Toolbar
                                        {...this.makeToolbarPropsFromConfig2(
                                          toolbarPreview,
                                          undefined,
                                          {
                                            allowExtend: false
                                          }
                                        )}
                                        selector=".brz-eventList__item--meta--preview"
                                      >
                                        {({ ref: previewRef }) => (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarLinksColor,
                                              undefined,
                                              {
                                                allowExtend: false
                                              }
                                            )}
                                            selector=".brz-eventList__item--meta--link a"
                                          >
                                            {({ ref: linksRef }) => (
                                              <Toolbar
                                                {...this.makeToolbarPropsFromConfig2(
                                                  toolbarMetaItemLinkColor,
                                                  sidebarMinistryBrandsMetaAddress,
                                                  {
                                                    allowExtend: false
                                                  }
                                                )}
                                                selector=".brz-ministryBrands__item--meta-address > a"
                                              >
                                                {({ ref: addressLinkRef }) => (
                                                  <Toolbar
                                                    {...this.makeToolbarPropsFromConfig2(
                                                      toolbarPagination,
                                                      undefined,
                                                      {
                                                        allowExtend: false
                                                      }
                                                    )}
                                                    selector=".brz-ministryBrands__pagination a"
                                                  >
                                                    {({
                                                      ref: paginationRef
                                                    }) => (
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
                                                              ref: iconsRef
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
                                                                          dateRef,
                                                                          categoryRef,
                                                                          groupRef,
                                                                          locationRef,
                                                                          addressRef,
                                                                          buttonRef,
                                                                          registerButtonRef,
                                                                          previewRef,
                                                                          linksRef,
                                                                          addressLinkRef,
                                                                          paginationRef,
                                                                          mediaRef,
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
                                                                    className:
                                                                      "brz-eventList"
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
