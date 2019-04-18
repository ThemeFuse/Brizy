import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
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

  renderForEdit(v) {
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
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className="brz-icon__container" style={style}>
            {content}
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Icon;
