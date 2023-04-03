import classnames from "classnames";
import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { blocksDataSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Block } from "visual/types";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

export class Vendor extends EditorComponent<Value> {
  static get componentId(): "Vendor" {
    return "Vendor";
  }
  static defaultValue = defaultValue;

  renderPopups(): ReactNode {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        const { blockId, type, value } = itemData;
        let {
          value: { popupId }
        } = itemData;

        if (type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const blockData = globalBlocks[value._id];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : type === "GlobalBlock"
            ? `global_${popupId}`
            : popupId
        };
      }
    });
    /**
     * Since the EditorArrayComponent is still in JS
     * TS cannot read properly it's return type
     * @ts-expect-error */
    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const {
      customCSS,
      linkAnchor,
      linkExternal,
      linkExternalBlank,
      linkExternalRel,
      linkPage,
      linkPopup,
      linkType,
      sourceID,
      sourceType,
      tagName
    } = v;

    const className = classnames(
      "brz-shopify-vendor w-full",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const hrefs = {
      anchor: linkAnchor,
      popup: linkPopup,
      external: linkExternal,
      page: linkPage,
      lightBox: "",
      upload: "",
      action: "",
      story: ""
    };

    const placeholderWithTypes = sourceType
      ? `{{brizy_dc_collection_item_field slug="vendor" type="${sourceType}" id="${sourceID}"}}`
      : '{{brizy_dc_collection_item_field slug="vendor"}}';

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper {...this.makeWrapperProps({ className })}>
              <Link
                href={hrefs[linkType]}
                type={linkType}
                target={linkExternalBlank}
                rel={linkExternalRel}
              >
                <DynamicContentHelper
                  placeholder={placeholderWithTypes}
                  tagName={tagName}
                  props={{ className: "brz-shopify-vendor__title" }}
                />
              </Link>
            </Wrapper>
          </CustomCSS>
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </>
    );
  }
}
