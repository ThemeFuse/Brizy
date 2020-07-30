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
import { globalBlocksSelector } from "visual/redux/selectors";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";

export default class WPPostExcerpt extends EditorComponent {
  static get componentId() {
    return "WPPostExcerpt";
  }

  static defaultValue = defaultValue;

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          itemData = globalBlocksSelector(getStore().getState())[
            itemData.value._id
          ].data;
          isGlobal = true;
        }

        const {
          blockId,
          value: { popupId }
        } = itemData;

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : isGlobal
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
      linkAnchor,
      linkExternalType,
      linkExternalBlank,
      linkExternalRel,
      linkPopup,
      linkUpload,
      popups
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
        placeholder="{{brizy_dc_post_excerpt}}"
        tagName="span"
      />
    );

    return (
      <Fragment>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <div className={className}>
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
            </div>
          </CustomCSS>
        </Toolbar>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </Fragment>
    );
  }
}
