import classNames from "classnames";
import React, { ComponentType, ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import EditorComponent from "visual/editorComponents/EditorComponent";
import {
  ComponentsMeta,
  NewToolbarConfig
} from "visual/editorComponents/EditorComponent/types";
import Editor from "visual/global/Editor";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { WithClassName } from "visual/types/attributes";
import { Wrapper } from "../tools/Wrapper";

export interface Value extends ElementModel {
  thirdPartyId: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

interface ThirdpartyComponent {
  editor: ComponentType;
  view: ComponentType;
}

interface Options<
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
> {
  toolbars: NewToolbarConfig<M, P, S>[];
  sidebars: NewToolbarConfig<M, P, S>[];
}

class ThirdParty extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "ThirdParty";
  }

  getComponentId(): string {
    const parentId = super.getComponentId();
    const { thirdPartyId } = this.getValue();
    return `${parentId}-${thirdPartyId}`;
  }

  static experimentalDynamicContent = true;
  component?: ThirdpartyComponent;

  getComponent(ID: string): ThirdpartyComponent | undefined {
    if (this.component) {
      return this.component;
    }

    const {
      component,
      config: { options }
    } = Editor.getThirdPartyElements()[ID];

    if (
      typeof component.editor !== "function" ||
      typeof component.view !== "function"
    ) {
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

  getOptions(): Options<Value, Props> {
    const config = this.componentConfig?.getConfig({
      getValue: this.getValueByOptionId,
      getDCOption: this.getDCOptionByType
    });

    return (
      config?.reduce<Options<Value, Props>>(
        (acc, curr) => {
          if (curr.toolbar) {
            acc.toolbars = [
              ...acc.toolbars,
              { getItems: () => [...(curr.toolbar ?? [])] }
            ];
          }

          if (curr.sidebar) {
            acc.sidebars = [
              ...acc.sidebars,
              { getItems: () => [...(curr.sidebar ?? [])] }
            ];
          }

          return acc;
        },
        {
          toolbars: [],
          sidebars: []
        }
      ) ?? { toolbars: [], sidebars: [] }
    );
  }

  render(): ReactNode {
    const { thirdPartyId } = this.getValue();
    const { view, editor } = this.getComponent(thirdPartyId) ?? {};

    if (!(view && editor)) {
      return `Missing Third Party Component: ${thirdPartyId}`;
    }

    const v = this.getValue();

    if (isEditor(this.renderContext)) {
      if (this.componentConfig) {
        return this.renderToolbars(this.renderForEdit(v, editor));
      }
      return this.renderForEdit(v, editor);
    }
    if (isView(this.renderContext)) {
      return this.renderForEdit(v, view);
    }
  }

  // @ts-expect-error: Props
  renderForEdit(
    v: Record<string, unknown>,
    Component: ComponentType
  ): ReactNode {
    const { customCSS } = v;
    const thirdPartyClassName = "brz-third-party";

    const { toolbars, sidebars } = this.getOptions();

    const wrapperClassName = this.getCSSClassnames({
      toolbars,
      sidebars
    });

    const className = classNames(thirdPartyClassName, wrapperClassName);

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
