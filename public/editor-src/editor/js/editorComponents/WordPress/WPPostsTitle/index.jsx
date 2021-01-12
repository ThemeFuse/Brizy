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
import { getStore } from "visual/redux/store";
import { blocksDataSelector } from "visual/redux/selectors";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";

export default class WPPostsTitle extends EditorComponent {
  static get componentId() {
    return "WPPostsTitle";
  }

  static defaultValue = defaultValue;

  renderPopups(v) {
    const { popups, linkType, linkPopup } = v;

    if (popups.length > 0 && linkType !== "popup" && linkPopup !== "") {
      return null;
    }

    const normalizePopups = popups.reduce((acc, popup) => {
      let itemData = popup;

      if (itemData.type === "GlobalBlock") {
        // TODO: some kind of error handling
        itemData = blocksDataSelector(getStore().getState())[
          itemData.value._id
        ];
      }

      return itemData ? [...acc, itemData] : acc;
    }, []);

    if (normalizePopups.length === 0) {
      return null;
    }

    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        const {
          blockId,
          value: { popupId }
        } = itemData;

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
      linkUpload
    } = v;
    const className = classnames(
      "brz-wp-shortcode",
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
    const text = (
      <DynamicContentHelper
        placeholder="{{brizy_dc_post_title}}"
        placeholderIcon="wp-title"
        tagName="span"
      />
    );

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Wrapper {...this.makeWrapperProps({ className })}>
              {hrefs[linkType] || IS_EDITOR ? (
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
        {this.renderPopups(v)}
      </>
    );
  }
}
