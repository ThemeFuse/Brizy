import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { blocksDataSelector } from "visual/redux/selectors";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { getStore } from "visual/redux/store";
import { Wrapper } from "../tools/Wrapper";
import { getTagNameFromFontStyle } from "visual/editorComponents/tools/HtmlTag";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";

export default class PostTitle extends EditorComponent {
  static get componentId() {
    // NOTE: initially this element was for WordPress only.
    // After we needed to make it work for cloud as well, it was renamed,
    // but since we don't have a good migration system yet, the old componentId still remains
    return "WPPostsTitle";
  }

  static defaultValue = defaultValue;

  patchValue(patch, meta) {
    const { fontStyle } = patch;

    super.patchValue(
      {
        ...patch,
        ...(fontStyle ? getTagNameFromFontStyle(fontStyle) : {})
      },
      meta
    );
  }

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
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

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const {
      className: className_,
      linkType,
      linkExternalBlank,
      linkExternalRel,
      linkAnchor,
      linkExternalType,
      linkPopup,
      linkUpload,
      tagName,
      sourceType,
      sourceID
    } = v;
    const className = classnames(
      "brz-wp-title",
      className_,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    const placeholderWithTypes = sourceType
      ? `{{brizy_dc_post_title type="${sourceType}" id="${sourceID}"}}`
      : "{{brizy_dc_post_title}}";

    const text = (
      <DynamicContentHelper
        placeholder={placeholderWithTypes}
        placeholderIcon="wp-title"
        tagName={tagName}
        props={{
          className: "brz-wp-title-content"
        }}
      />
    );

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Wrapper {...this.makeWrapperProps({ className })}>
              {hrefs[linkType] ? (
                <Link
                  href={hrefs[linkType]}
                  type={linkType}
                  target={linkExternalBlank}
                  rel={linkExternalRel}
                >
                  {text}
                </Link>
              ) : (
                text
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
