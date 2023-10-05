import classNames from "classnames";
import { EmbedCode as EmbedCodeComponent } from "@brizy/component";
import React, { ReactElement } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import Config from "visual/global/Config";
import { isWp } from "visual/global/Config/types/configs/WP";
import { css } from "visual/utils/cssStyle";
import { xss } from "visual/utils/xss";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import type { Meta, Value } from "./types";

const resizerPoints = ["centerLeft", "centerRight"];

export default class EmbedCode extends EditorComponent<Value, ComponentsMeta> {
  static get componentId(): "EmbedCode" {
    return "EmbedCode";
  }

  static defaultValue = defaultValue;

  handleValueChange(newValue: Value, meta: Meta) {
    const config = Config.getAll();

    if (meta.patch.code && isWp(config) && !config.user.allowScripts) {
      const xssCode = xss(newValue.code, "discard");
      super.handleValueChange({ ...newValue, code: xssCode }, meta);
    } else {
      super.handleValueChange(newValue, meta);
    }
  }

  handleResizerChange = (patch: { [key: string]: number }) =>
    this.patchValue(patch);

  renderForEdit(v: Value, vs: Value, vd: Value): ReactElement {
    const { code } = v;

    const className = classNames(
      "brz-embed-code",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
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
              {code ? (
                <EmbedCodeComponent code={code} className="brz-blocked" />
              ) : (
                <Placeholder icon="iframe" />
              )}
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    const { code } = v;

    const className = classNames(
      "brz-embed-code",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {code ? (
            <EmbedCodeComponent code={code} ssr={true} />
          ) : (
            <Placeholder icon="iframe" />
          )}
        </Wrapper>
      </CustomCSS>
    );
  }
}
