import classnames from "classnames";
import React, { type ReactElement, RefObject } from "react";
import BoxResizer from "visual/component/BoxResizer";
import type { Patch } from "visual/component/BoxResizer/types";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import type { ElementModel } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isView } from "visual/providers/RenderProvider";
import type { WithClassName } from "visual/types/attributes";
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
  customCSS: string;
};

export interface Props extends WithClassName {
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
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.Alert {
    return ElementTypes.Alert;
  }

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

  renderAlert(
    v: Value,
    data?: {
      titleRef?: RefObject<HTMLDivElement> | null;
      descriptionRef?: RefObject<HTMLDivElement> | null;
      iconRef?: RefObject<HTMLDivElement> | null;
    }
  ): ReactElement {
    const { showCloseButtonAfter } = v;

    const iconClassnames = classnames("brz-alert-close", {
      "brz-hidden": isView(this.props.renderContext) && showCloseButtonAfter > 0
    });

    return (
      <>
        <span ref={data?.titleRef}>
          <Text
            className="brz-alert-title"
            id="title"
            v={v}
            onChange={this.handleTextChange}
          />
        </span>

        <span ref={data?.descriptionRef}>
          <Text
            className="brz-alert-description"
            id="description"
            v={v}
            onChange={this.handleTextChange}
          />
        </span>

        <span className={iconClassnames} ref={data?.iconRef}>
          <ThemeIcon
            name="close-popup"
            className="brz-alert-close-icon"
            type="editor"
          />
        </span>
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
          contexts: this.getContexts()
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarExtendTitle,
          sidebarDisabled
        )}
      >
        {({ ref: titleRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarExtendDescription,
              sidebarDisabled
            )}
          >
            {({ ref: descriptionRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarExtendCloseButton,
                  sidebarDisabled
                )}
              >
                {({ ref: iconRef }) => (
                  <CustomCSS selectorName={this.getId()} css={v.customCSS}>
                    {({ ref: cssRef }) => (
                      <Wrapper
                        {...this.makeWrapperProps({ className, ref: cssRef })}
                      >
                        <BoxResizer
                          points={resizerPoints}
                          restrictions={resizerRestrictions}
                          meta={this.props.meta}
                          value={this.getValue2().v}
                          context={this}
                          onChange={this.handleResizerChange}
                        >
                          {this.renderAlert(v, {
                            titleRef,
                            descriptionRef,
                            iconRef
                          })}
                        </BoxResizer>
                      </Wrapper>
                    )}
                  </CustomCSS>
                )}
              </Toolbar>
            )}
          </Toolbar>
        )}
      </Toolbar>
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
          contexts: this.getContexts()
        })
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({ className })}
          attributes={makeDataAttr({
            name: "delay",
            value: showCloseButtonAfter
          })}
        >
          {this.renderAlert(v)}
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Alert;
