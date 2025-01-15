import { EmbedCode as EmbedCodeComponent } from "@brizy/component";
import classNames from "classnames";
import React, { ReactElement } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import type { Meta, Value } from "./types";

const resizerPoints = ["centerLeft", "centerRight"];

export default class EmbedCode extends EditorComponent<Value, ComponentsMeta> {
  static defaultValue = defaultValue;

  static get componentId(): "EmbedCode" {
    return "EmbedCode";
  }

  handleValueChange(newValue: Value, meta: Meta) {
    if (meta.patch.code) {
      super.handleValueChange({ ...newValue, code: newValue.code }, meta);
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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext,
          editorMode: this.props.editorMode
        })
      )
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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext,
          editorMode: this.props.editorMode
        })
      )
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
