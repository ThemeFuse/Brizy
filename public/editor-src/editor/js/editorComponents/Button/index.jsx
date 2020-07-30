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
import { blocksDataSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style, styleIcon } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";

export default class Button extends EditorComponent {
  static get componentId() {
    return "Button";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

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
    const className = classnames(
      "brz-btn",
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd)
      )
    );

    const componentType = IS_EDITOR ? "a" : "button";

    return (
      <Wrapper
        {...this.makeWrapperProps({ className })}
        component={componentType}
        attributes={this.props.attributes}
      >
        {content}
      </Wrapper>
    );
  }

  renderLink(v, vs, vd, content) {
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
        style(v, vs, vd)
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
        {content}
      </Wrapper>
    );
  }

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          itemData = blocksDataSelector(getStore().getState())[
            itemData.value._id
          ];
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

    const { type, iconName, iconType, linkType, linkPopup, popups } = v;
    const renderIcon = iconName && iconType;
    const content = (
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
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </>
    );
  }
}
