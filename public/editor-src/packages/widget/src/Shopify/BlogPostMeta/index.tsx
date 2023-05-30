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

export class BlogPostMeta extends EditorComponent<Value> {
  static get componentId(): ElementTypes.BlogPostMeta {
    return ElementTypes.BlogPostMeta;
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
      metaId,
      customCSS,
      linkPage,
      sourceType
    } = v;

    const { postElements } = v;

    const className = classnames(
      "brz-blogpostmeta w-full",
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

    const attributes = () => {
      let attribute = "";
      JSON.parse(postElements).map((el: string) => {
        attribute = attribute.concat(`${el}='1' `);
      });
      return attribute;
    };

    const placeholder =
      sourceType && metaId
        ? `{{ post_info ${attributes()} type="${sourceType}" id="${metaId}"}}`
        : `{{ post_info ${attributes()}  }}`;

    const content = (
      <DynamicContentHelper
        placeholder={placeholder}
        tagName={tagName}
        placeholderIcon="wp-post-info"
        props={{ className: "brz-shopify-blogPostMeta__title" }}
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
