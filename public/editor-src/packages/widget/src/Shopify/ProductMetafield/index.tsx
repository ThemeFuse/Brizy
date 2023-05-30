import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ConfigCommon";
import { blocksDataSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Block } from "visual/types";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

export class ProductMetafield extends EditorComponent<Value> {
  static get componentId(): ElementTypes.ProductMetafield {
    return ElementTypes.ProductMetafield;
  }

  static defaultValue = defaultValue;

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;
        if (itemData.type === "GlobalBlock") {
          const globalBlocks = blocksDataSelector(getStore().getState());
          const blockData = globalBlocks[itemData.value._id];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : itemData.type === "GlobalBlock"
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
      linkType,
      linkExternalBlank,
      linkExternalRel,
      linkAnchor,
      linkExternal,
      linkPopup,
      linkUpload,
      tagName,
      metafieldKey,
      productID,
      customCSS,
      linkPage
    } = v;

    const className = classnames(
      "brz-shopify-metafield w-full",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const hrefs = {
      anchor: linkAnchor,
      external: linkExternal,
      popup: linkPopup,
      upload: linkUpload,
      page: linkPage,
      story: "",
      lightBox: "",
      action: ""
    };

    const content = (
      <DynamicContentHelper
        placeholder={`{{ metafield type='shopify-product' id='${productID}' key= '${metafieldKey}' }}`}
        tagName={tagName}
        props={{ className: "brz-shopify-metafield__title" }}
      />
    );

    return (
      <>
        <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper {...this.makeWrapperProps({ className })}>
              {hrefs[linkType] ? (
                <Link
                  href={hrefs[linkType]}
                  type={linkType}
                  target={linkExternalBlank}
                  rel={linkExternalRel}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </Wrapper>
          </CustomCSS>
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </>
    );
  }
}
