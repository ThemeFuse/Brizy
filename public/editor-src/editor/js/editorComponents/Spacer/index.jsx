import { Gap } from "@brizy/component";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

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

class Spacer extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "Spacer";
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
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

  renderForView(v, vs, vd) {
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
