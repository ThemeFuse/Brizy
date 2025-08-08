import { Gap } from "@brizy/component/src/Flex/Gap";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import Toolbar from "visual/component/Toolbar";
import { BaseSpacer } from "visual/editorComponents/Spacer/Base";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import type { Value } from "./types";

const resizerPoints = ["bottomCenter"];
const resizerRestrictions = {
  height: {
    px: { min: 10, max: Infinity },
    vh: { min: 1, max: Infinity },
    em: { min: 1, max: Infinity }
  },
  tabletHeight: {
    px: { min: 10, max: Infinity },
    vh: { min: 1, max: Infinity },
    em: { min: 1, max: Infinity }
  },
  mobileHeight: {
    px: { min: 10, max: Infinity },
    vh: { min: 1, max: Infinity },
    em: { min: 1, max: Infinity }
  }
};

class Spacer extends BaseSpacer {
  handleResizerChange = (patch: Patch): void => this.patchValue(patch);

  renderForEdit(v: Value, vs: Value, vd: Value) {
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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig, {
          allowSidebarExtend: false
        })}
      >
        {({ ref }) => (
          <BoxResizer
            points={resizerPoints}
            restrictions={resizerRestrictions}
            meta={this.props.meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            <Gap className={className} ref={ref} />
          </BoxResizer>
        )}
      </Toolbar>
    );
  }
}

export default Spacer;
