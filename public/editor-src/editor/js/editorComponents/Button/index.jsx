import React, { Fragment } from "react";
import TextEditor from "visual/editorComponents/Text/Editor";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { globalBlocksSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import { style, styleIcon } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

class Button extends EditorComponent {
  static get componentId() {
    return "Button";
  }

  static defaultValue = defaultValue;

  handleTextChange = text => {
    this.patchValue({ text });
  };

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

    return IS_EDITOR ? (
      <a className={className}>{content}</a>
    ) : (
      <button className={className}>{content}</button>
    );
  }

  renderLink(v, vs, vd, content) {
    const className = classnames(
      "brz-btn",
      css(
        `${this.constructor.componentId}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd)
      )
    );

    const {
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalType,
      linkExternalRel,
      linkPopup
    } = v;
    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup
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

    return <Link {...props}>{content}</Link>;
  }

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          itemData = globalBlocksSelector(getStore().getState())[
            itemData.value.globalBlockId
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

    const { text, type, iconName, iconType, linkType, linkPopup, popups } = v;
    const renderIcon = iconName && iconType;
    const content = (
      <Fragment>
        {renderIcon && this.renderIcon(v, vs, vd)}
        <TextEditor value={text} onChange={this.handleTextChange} />
      </Fragment>
    );

    return (
      <Fragment>
        <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
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
      </Fragment>
    );
  }
}

export default Button;
