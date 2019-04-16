import React from "react";
import TextEditor from "visual/editorComponents/Text/Editor";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import {
  styleClassName,
  styleCSSVars,
  iconStyleClassName,
  iconStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

class Button extends EditorComponent {
  static get componentId() {
    return "Button";
  }

  static defaultValue = defaultValue;

  handleTextChange = text => {
    this.patchValue({ text });
  };

  renderIcon(v) {
    const { iconName, iconType } = v;

    return (
      <ThemeIcon
        key="icon"
        className={iconStyleClassName(v)}
        name={iconName}
        type={iconType}
      />
    );
  }

  renderSubmit(v, content) {
    const style = { ...styleCSSVars(v), ...iconStyleCSSVars(v) };

    return IS_EDITOR ? (
      <a className={styleClassName(v)} style={style}>
        {content}
      </a>
    ) : (
      <button className={styleClassName(v)} style={style}>
        {content}
      </button>
    );
  }

  renderLink(v, content) {
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
      style: { ...styleCSSVars(v), ...iconStyleCSSVars(v) },
      href: hrefs[linkType],
      target: linkExternalBlank,
      rel: linkExternalRel,
      className: styleClassName(v)
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

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.fontStyle && `${_v.fontStyle}__fsDesktop`,
      _v.tabletFontStyle && `${_v.tabletFontStyle}__fsTablet`,
      _v.mobileFontStyle && `${_v.mobileFontStyle}__fsMobile`
    ]);

    const { text, type, iconName, iconType } = v;
    const renderIcon = iconName && iconType;

    const content = [
      renderIcon && this.renderIcon(v),
      <TextEditor key="text" value={text} onChange={this.handleTextChange} />
    ];

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          {type === "link"
            ? this.renderLink(v, content)
            : this.renderSubmit(v, content)}
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Button;
