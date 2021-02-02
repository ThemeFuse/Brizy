import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import { Text } from "visual/component/ContentOptions/types";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style, styleIcon } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";
import BoxResizer from "visual/component/BoxResizer";
import { hasSizing } from "visual/editorComponents/Button/utils";
import * as State from "visual/utils/stateMode";

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

const restrictions = {
  width: {
    "%": { min: 10, max: 100 }
  },
  height: {
    "%": { min: 5, max: Infinity }
  }
};

export default class Button extends EditorComponent {
  static get componentId() {
    return "Button";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleResizerChange = patch => this.patchValue(patch);

  handleTextChange = patch => this.patchValue(patch);

  renderIcon(v, vs, vd) {
    const iconClassName = classnames(
      css(
        `${this.constructor.componentId}-icon`,
        `${this.getId()}-icon`,
        styleIcon(v, vs, vd)
      )
    );
    const { iconName, iconType } = v;

    return (
      <ThemeIcon className={iconClassName} name={iconName} type={iconType} />
    );
  }

  renderSubmit(v, vs, vd, content) {
    const state = State.mRead(v.tabsState);
    const device = deviceModeSelector(getStore().getState());
    const className = classnames(
      "brz-btn",
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, hasSizing(v, device, state))
      )
    );

    const componentType = IS_EDITOR ? "a" : "button";

    return (
      <Wrapper
        {...this.makeWrapperProps({ className })}
        component={componentType}
        attributes={this.props.attributes}
      >
        {hasSizing(v, device, state) && v.type !== "submit" ? (
          <BoxResizer
            points={resizerPoints}
            value={v}
            onChange={this.handleResizerChange}
            restrictions={restrictions}
          >
            {content}
          </BoxResizer>
        ) : (
          content
        )}
      </Wrapper>
    );
  }

  renderLink(v, vs, vd, content) {
    const state = State.mRead(v.tabsState);
    const device = deviceModeSelector(getStore().getState());

    const {
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalType,
      linkExternalRel,
      linkPopup,
      linkUpload,
      actionClosePopup
    } = v;

    const className = classnames(
      "brz-btn",
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, hasSizing(v, device, state))
      ),
      {
        "brz-popup2__action-close":
          linkType === "action" && actionClosePopup === "on"
      }
    );

    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    let props = {
      type: linkType,
      href: hrefs[linkType],
      target: linkExternalBlank,
      rel: linkExternalRel,
      className: className
    };

    if (IS_EDITOR) {
      props.onDragStart = e => {
        e.preventDefault();
        return false;
      };
      props.draggable = "false";
    }

    return (
      <Wrapper
        {...this.makeWrapperProps({ attributes: props })}
        component={Link}
      >
        {hasSizing(v, device, state) ? (
          <BoxResizer
            points={resizerPoints}
            value={v}
            onChange={this.handleResizerChange}
            restrictions={restrictions}
          >
            {content}
          </BoxResizer>
        ) : (
          content
        )}
      </Wrapper>
    );
  }

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

  renderForEdit(_v, _vs, _vd) {
    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);
    const vs = this.applyRulesToValue(_vs, [
      _vs.fontStyle && `${_vs.fontStyle}__fsDesktop`,
      _vs.tabletFontStyle && `${_vs.tabletFontStyle}__fsTablet`,
      _vs.mobileFontStyle && `${_vs.mobileFontStyle}__fsMobile`
    ]);
    const vd = this.applyRulesToValue(_vs, [
      _vd.fontStyle && `${_vd.fontStyle}__fsDesktop`,
      _vd.tabletFontStyle && `${_vd.tabletFontStyle}__fsTablet`,
      _vd.mobileFontStyle && `${_vd.mobileFontStyle}__fsMobile`
    ]);

    const state = State.mRead(v.tabsState);
    const device = deviceModeSelector(getStore().getState());

    const { type, iconName, iconType } = v;
    const renderIcon = iconName && iconType;
    const content =
      hasSizing(v, device, state) && IS_EDITOR && v.type !== "submit" ? (
        <div className="brz-btn--story-container">
          {renderIcon && this.renderIcon(v, vs, vd)}
          <Text id="text" v={v} onChange={this.handleTextChange} />
        </div>
      ) : (
        <>
          {renderIcon && this.renderIcon(v, vs, vd)}
          <Text id="text" v={v} onChange={this.handleTextChange} />
        </>
      );

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {type === "link"
              ? this.renderLink(v, vs, vd, content)
              : this.renderSubmit(v, vs, vd, content)}
          </CustomCSS>
        </Toolbar>
        {this.renderPopups(v)}
      </>
    );
  }
}
