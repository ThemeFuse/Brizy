import classnames from "classnames";
import { Calendly as CalendlyComponent } from "@brizy/component";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import { css } from "visual/utils/cssStyle";
import { WithClassName } from "visual/utils/options/attributes";
import EditorComponent, { ComponentsMeta } from "../EditorComponent";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

export interface Value extends ElementModel {
  link: string;
}

interface Props extends WithClassName {
  meta: ComponentsMeta;
}

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

class Calendly extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "Calendly";
  }

  static defaultValue = defaultValue;

  handleResizerChange = (patch: Patch): void => this.patchValue(patch);

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { link } = v;

    const className = classnames(
      "brz-calendly",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper {...this.makeWrapperProps({ className })}>
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
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const { link } = v;
    const className = classnames(
      "brz-calendly",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

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
