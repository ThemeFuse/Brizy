import { Gap } from "@brizy/component/src/Flex/Gap";
import classnames from "classnames";
import React from "react";
import { BaseSpacer } from "visual/editorComponents/Spacer/Base";
import { style } from "./styles";
import type { Value } from "./types";

class Spacer extends BaseSpacer {
  renderForView(v: Value, vs: Value, vd: Value) {
    const className = classnames(
      "brz-spacer",
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

    return <Gap className={className} />;
  }
}

export default Spacer;
