import { Calendly as CalendlyComponent } from "@brizy/component/src/Flex/Calendly";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import { Wrapper } from "../tools/Wrapper";
import { BaseCalendly } from "./Base";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

const resizerPoints = [
  "centerLeft",
  "centerRight",
  "topCenter",
  "bottomCenter"
];
const resizerRestrictions = {
  width: {
    px: { min: 320, max: 1000 },
    "%": { min: 5, max: 100 }
  },
  tabletWidth: {
    px: { min: 5, max: 1000 },
    "%": { min: 5, max: 100 }
  },
  mobileWidth: {
    px: { min: 5, max: 1000 },
    "%": { min: 5, max: 100 }
  }
};

class Calendly extends BaseCalendly {
  handleResizerChange = (patch: Patch): void => this.patchValue(patch);

  renderForEdit(v: Value): ReactNode {
    const { link } = v;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: ["brz-calendly"]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref }) => (
          <Wrapper {...this.makeWrapperProps({ className, ref })}>
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {!link ? (
                <Placeholder icon="calendly" />
              ) : (
                <CalendlyComponent link={link} />
              )}
            </BoxResizer>
          </Wrapper>
        )}
      </Toolbar>
    );
  }
}

export default Calendly;
