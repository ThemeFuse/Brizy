import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Config from "visual/global/Config";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { xss } from "visual/utils/xss";

const resizerPoints = ["centerLeft", "centerRight"];

export default class EmbedCode extends EditorComponent {
  static get componentId() {
    return "EmbedCode";
  }

  static defaultValue = defaultValue;

  isApproved = () => {
    const config = Config.getAll();

    if (isCloud(config)) {
      return config.user.isApproved;
    }

    return true;
  };

  handleValueChange(newValue, meta) {
    const config = Config.getAll();

    if (meta.patch.code && isWp(config) && !config.user.isWpAdmin) {
      const xssCode = xss(newValue.code, "discard");
      super.handleValueChange({ ...newValue, code: xssCode });
    } else {
      super.handleValueChange(newValue, meta);
    }
  }

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const { code } = v;

    const className = classnames(
      "brz-embed-code",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    const content =
      code && this.isApproved() ? (
        <div
          className={classnames({ "brz-blocked": IS_EDITOR })}
          dangerouslySetInnerHTML={{ __html: code }}
        />
      ) : (
        <Placeholder icon="iframe" />
      );

    const resizerRestrictions = {
      width: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      tabletWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      mobileWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      }
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              <div className="brz-embed-content">{content}</div>
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    if (TARGET === "WP") {
      return this.renderForEdit(v, vs, vd);
    } else {
      const { isApproved } = Config.get("user");

      return isApproved ? this.renderForEdit(v, vs, vd) : null;
    }
  }
}
