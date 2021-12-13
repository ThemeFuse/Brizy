import React, { Fragment } from "react";
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
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../tools/Wrapper";
import { getPlaceholder, getPlaceholderIcon } from "./utils";

export default class PostExcerpt extends EditorComponent {
  static get componentId() {
    // NOTE: initially this element was for WordPress only.
    // After we needed to make it work for cloud as well, it was renamed,
    // but since we don't have a good migration system yet, the old componentId still remains
    return "WPPostExcerpt";
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
        let {
          blockId,
          value: { popupId }
        } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const blockData = blocksDataSelector(getStore().getState())[
            itemData.value._id
          ];

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
      type,
      className: className_,
      linkType,
      linkAnchor,
      linkExternalType,
      linkExternalBlank,
      linkExternalRel,
      linkPopup,
      linkUpload
    } = v;
    const className = classnames(
      "brz-wp-post-excerpt",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      ),
      className_
    );
    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };
    const text = (
      <DynamicContentHelper
        placeholder={getPlaceholder(type)}
        placeholderIcon={getPlaceholderIcon(type)}
        tagName={v.tagName}
        props={{
          className: "brz-wp-post-excerpt-content"
        }}
      />
    );

    return (
      <Fragment>
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
        {this.renderPopups(v)}
      </Fragment>
    );
  }
}
