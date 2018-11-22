import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";

class Icon extends EditorComponent {
  static get componentId() {
    return "Icon";
  }

  static defaultValue = defaultValue;

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.colorPalette && `${_v.colorPalette}__color`,
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.hoverBgColorPalette && `${_v.hoverBgColorPalette}__hoverBg`,
      _v.hoverColorPalette && `${_v.hoverColorPalette}__hoverColor`,
      _v.hoverBorderColorPalette &&
        `${_v.hoverBorderColorPalette}__hoverBorder`,
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`
    ]);
    const {
      type: iconType,
      name: iconName,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkExternalType,
      linkPopup
    } = v;
    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup
    };

    let content = (
      <span className={styleClassName(v)}>
        <ThemeIcon name={iconName} type={iconType} />
      </span>
    );

    if (hrefs[linkType] !== "") {
      content = (
        <Link
          type={linkType}
          href={hrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
        >
          {content}
        </Link>
      );
    }

    const style = { ...styleCSSVars(v) };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div className="brz-icon__container" style={style}>
          {content}
        </div>
      </Toolbar>
    );
  }
}

export default Icon;
