import React, { ReactNode } from "react";
import Placeholder from "visual/component/Placeholder";
import { Wrapper } from "../tools/Wrapper";
import { BaseCalendly } from "./Base";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

class Calendly extends BaseCalendly {
  renderForView(v: Value): ReactNode {
    const { link } = v;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: ["brz-calendly"]
    });

    return (
      <Wrapper
        {...this.makeWrapperProps({ className })}
        attributes={{ "data-url": link }}
      >
        {!link && <Placeholder icon="calendly" />}
      </Wrapper>
    );
  }
}

export default Calendly;
