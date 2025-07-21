import { EmbedCode as EmbedCodeComponent } from "@brizy/component/src/Flex/EmbedCode";
import classNames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import { Wrapper } from "../tools/Wrapper";
import { BaseEmbedCode } from "./Base";
import { style } from "./styles";
import type { Value } from "./types";

export default class EmbedCode extends BaseEmbedCode {
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
          contexts: this.getContexts()
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
