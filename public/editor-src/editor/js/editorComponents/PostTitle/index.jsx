import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { getTagNameFromFontStyle } from "visual/editorComponents/tools/HtmlTag";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { withMigrations } from "visual/editorComponents/tools/withMigrations";
import { blocksDataSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getPopulatedEntityValues } from "visual/utils/dynamicContent/common";
import { getLinkData } from "visual/utils/models/link";
import { handleLinkChange } from "visual/utils/patch/Link";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import { migrations } from "./migrations";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { omit } from "timm";

class PostTitle extends EditorComponent {
  static get componentId() {
    // NOTE: initially this element was for WordPress only.
    // After we needed to make it work for cloud as well, it was renamed,
    // but since we don't have a good migration system yet, the old componentId still remains
    return "WPPostsTitle";
  }

  static defaultValue = defaultValue;

  patchValue(patch, meta) {
    const { fontStyle } = patch;
    const link = handleLinkChange(patch);

    super.patchValue(
      {
        ...patch,
        ...link,
        ...(fontStyle ? getTagNameFromFontStyle(fontStyle) : {})
      },
      meta
    );
  }

  renderPopups() {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData) => {
        let {
          blockId,
          value: { popupId }
        } = itemData;

        let newMeta = omit(meta, ["globalBlockId"]);

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const globalBlockId = itemData.value._id;
          const blockData = globalBlocks[globalBlockId];

          popupId = blockData.value.popupId;
          newMeta = {
            ...newMeta,
            globalBlockId
          };
        }

        return {
          blockId,
          meta: newMeta,
          ...(IS_EDITOR && {
            instanceKey: `${this.getId()}_${popupId}`
          })
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v, vs, vd) {
    const {
      className: className_,
      tagName,
      textPopulation,
      textPopulationEntityId,
      textPopulationEntityType
    } = v;

    const attr = getPopulatedEntityValues(
      textPopulationEntityId,
      textPopulationEntityType
    );

    const placeholder = makePlaceholder({ content: textPopulation, attr });
    const linkData = getLinkData(v);

    const className = classnames(
      "brz-wp-title",
      className_,
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    const text = (
      <DynamicContentHelper
        placeholder={placeholder}
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
      </>
    );
  }
}

export default withMigrations(PostTitle, migrations);
