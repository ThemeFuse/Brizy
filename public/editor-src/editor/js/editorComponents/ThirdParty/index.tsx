import React, { ComponentType, ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import Editor from "visual/global/Editor";
import { WithClassName } from "visual/utils/options/attributes";
import { Wrapper } from "../tools/Wrapper";

export interface Value extends ElementModel {
  thirdPartyId: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

class ThirdParty extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "ThirdParty";
  }

  static experimentalDynamicContent = true;
  component: ComponentType | undefined;

  getComponent(ID: string): ComponentType | undefined {
    if (this.component) {
      return this.component;
    }

    const {
      component,
      config: { options }
    } = Editor.getThirdPartyElements()[ID];

    if (!component && typeof component !== "function") {
      return;
    }

    this.component = component;

    if (options) {
      this.componentConfig = {
        getConfig: options
      };
    }

    return this.component;
  }

  render(): ReactNode {
    const { thirdPartyId } = this.getValue();

    const component = this.getComponent(thirdPartyId);

    if (!component) {
      return `Missing Third Party Component: ${thirdPartyId}`;
    }

    const v = this.getValue();

    if (IS_EDITOR) {
      if (this.componentConfig) {
        return this.renderToolbars(this.renderForEdit(v, component));
      }
      return this.renderForEdit(v, component);
    }

    if (IS_PREVIEW) {
      return this.renderForEdit(v, component);
    }
  }

  // @ts-expect-error: Props
  renderForEdit(
    v: Record<string, unknown>,
    Component: ComponentType
  ): ReactNode {
    const { customCSS } = v;
    const className = "brz-third-party";

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          <Component {...v} />
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default ThirdParty;
