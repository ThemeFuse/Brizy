import classnames from "classnames";
import React, { ReactElement } from "react";
import { isView } from "visual/providers/RenderProvider";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarDisabled from "./sidebarDisabled";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtendCloseButton from "./toolbarExtendCloseButton";
import * as toolbarExtendDescription from "./toolbarExtendDescription";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarExtendTitle from "./toolbarExtendTitle";

export type Value = ElementModel & {
  showCloseButtonAfter: number;
};

interface Props extends WithClassName {
  meta: ComponentsMeta;
}

const resizerPoints = ["centerLeft", "centerRight"];
const resizerRestrictions = {
  width: {
    px: { min: 5, max: 1000 },
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

class Alert extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "Alert";
  }

  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  handleResizerChange = (patch: Patch): void => this.patchValue(patch);
  handleTextChange = (patch: { [k: string]: string }): void => {
    this.patchValue(patch);
  };

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderAlert(v: Value): ReactElement {
    const { showCloseButtonAfter } = v;

    const iconClassnames = classnames("brz-alert-close", {
      "brz-hidden": isView(this.props.renderContext) && showCloseButtonAfter > 0
    });

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtendTitle,
            sidebarDisabled
          )}
        >
          {/* when we use dymanic content <Text/> component does re-render and toolbar above loses his reference */}
          {/* in this case wraping in another span solve the problem */}
          <span>
            <Text
              className="brz-alert-title"
              id="title"
              v={v}
              onChange={this.handleTextChange}
            />
          </span>
        </Toolbar>

        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtendDescription,
            sidebarDisabled
          )}
        >
          {/* when we use dymanic content <Text/> component does re-render and toolbar above loses his reference */}
          {/* in this case wraping in another span solve the problem */}
          <span>
            <Text
              className="brz-alert-description"
              id="description"
              v={v}
              onChange={this.handleTextChange}
            />
          </span>
        </Toolbar>

        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtendCloseButton,
            sidebarDisabled
          )}
        >
          <span className={iconClassnames}>
            <ThemeIcon
              name="close-popup"
              className="brz-alert-close-icon"
              type="editor"
            />
          </span>
        </Toolbar>
      </>
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactElement {
    const className = classnames(
      "brz-alert",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          <BoxResizer
            points={resizerPoints}
            restrictions={resizerRestrictions}
            meta={this.props.meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            {this.renderAlert(v)}
          </BoxResizer>
        </Wrapper>
      </CustomCSS>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactElement {
    const { showCloseButtonAfter } = v;

    const className = classnames(
      "brz-alert",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    return (
      <Wrapper
        {...this.makeWrapperProps({ className })}
        attributes={makeDataAttr({
          name: "delay",
          value: showCloseButtonAfter
        })}
      >
        {this.renderAlert(v)}
      </Wrapper>
    );
  }
}

export default Alert;
