import classnames from "classnames";
import React, { Fragment } from "react";
import CustomCSS from "visual/component/CustomCSS";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { getTagNameFromFontStyle } from "visual/editorComponents/tools/HtmlTag";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { blocksDataSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { getPopulatedEntityValues } from "visual/utils/dynamicContent/common";
import { getLinkData } from "visual/utils/models/link";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { getPlaceholder, getPlaceholderIcon } from "./utils";

export default class PostExcerpt extends EditorComponent {
  static get componentId() {
    // NOTE: initially this element was for WordPress only.
    // After we needed to make it work for cloud as well, it was renamed,
    // but since we don't have a good migration system yet, the old componentId still remains
    return "WPPostExcerpt";
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
      itemProps: (itemData) => {
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
      type,
      tagName,
      customCSS,
      className: className_,
      sourceType,
      textPopulation,
      textPopulationEntityId,
      textPopulationEntityType
    } = v;
    const className = classnames(
      "brz-wp-post-excerpt",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd)),
      className_
    );
    const linkData = getLinkData(v);

    const attr = getPopulatedEntityValues(
      textPopulationEntityId,
      textPopulationEntityType
    );

    const text = (
      <DynamicContentHelper
        placeholder={getPlaceholder(type, sourceType, textPopulation, attr)}
        placeholderIcon={getPlaceholderIcon(type)}
        placeholderHeight={0}
        tagName={tagName}
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
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper {...this.makeWrapperProps({ className })}>
              {linkData.href ? (
                <Link
                  href={linkData.href}
                  type={linkData.type}
                  target={linkData.target}
                  rel={linkData.rel}
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
      </Fragment>
    );
  }
}
