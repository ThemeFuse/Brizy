import React, { Fragment } from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { styleWrapperClassName, styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";
import BoxResizer from "visual/component/BoxResizer";
import { defaultValueKey } from "visual/utils/onChange";
import { IS_STORY } from "visual/utils/models";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

const resizerTransformValue = v => {
  const {
    customSize,
    tabletCustomSize,
    mobileCustomSize,
    customSizeSuffix,
    tabletCustomSizeSuffix,
    mobileCustomSizeSuffix,
    ...rest
  } = v;

  return {
    ...rest,
    size: customSize,
    tabletSize: tabletCustomSize,
    mobileSize: mobileCustomSize,
    sizeSuffix: customSizeSuffix,
    tabletSizeSuffix: tabletCustomSizeSuffix,
    mobileSizeSuffix: mobileCustomSizeSuffix
  };
};

const resizerTransformPatch = patch => {
  if (patch.size) {
    patch.customSize = patch.size;
    delete patch.size;
  }

  if (patch.tabletSize) {
    patch.tabletCustomSize = patch.tabletSize;
    delete patch.tabletSize;
  }

  if (patch.mobileSize) {
    patch.mobileCustomSize = patch.mobileSize;
    delete patch.mobileSize;
  }

  return patch;
};

class Icon extends EditorComponent {
  static get componentId() {
    return "Icon";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => {
    const device = deviceModeSelector(getStore().getState());
    const sizeKey = defaultValueKey({ key: "size", device, state: "normal" });

    this.patchValue({
      ...resizerTransformPatch(patch),
      [sizeKey]: "custom"
    });
  };

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

  renderForEdit(v) {
    const {
      type: iconType,
      name: iconName,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkExternalType,
      linkPopup,
      linkUpload,
      actionClosePopup,
      customID,
      customClassName
    } = v;

    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    let content = (
      <span className={styleClassName(v)}>
        <ThemeIcon name={iconName} type={iconType} />
      </span>
    );

    if (hrefs[linkType] !== "") {
      const className = classnames({
        "brz-popup2__action-close":
          linkType === "action" && actionClosePopup === "on"
      });

      content = (
        <Link
          type={linkType}
          href={hrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
          className={className}
        >
          {content}
        </Link>
      );
    }

    const style = { ...styleCSSVars(v) };

    return (
      <Fragment>
        <Toolbar
          {...this.makeToolbarPropsFromConfig(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Wrapper
              {...this.makeWrapperProps({
                className: IS_STORY
                  ? styleWrapperClassName(v)
                  : "brz-icon__container",
                attributes: { style, id: customID, className: customClassName }
              })}
            >
              <BoxResizer
                keepAspectRatio
                points={resizerPoints}
                meta={this.props.meta}
                value={resizerTransformValue(v)}
                onChange={this.handleResizerChange}
              >
                {content}
              </BoxResizer>
            </Wrapper>
          </CustomCSS>
        </Toolbar>
        {this.renderPopups(v)}
      </Fragment>
    );
  }
}

export default Icon;
