import { Str } from "@brizy/readers";
import classNames from "classnames";
import React, { ComponentType, ReactNode, RefObject } from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import {
  ComponentsMeta,
  NewToolbarConfig,
  ToolbarConfig
} from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import Editor from "visual/global/Editor";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { WithClassName } from "visual/types/attributes";
import { I18n } from "visual/utils/i18n";
import { attachRefs } from "visual/utils/react";
import { ThirdPartyContextProvider } from "../tools/ThirdPartyContext";
import { Wrapper } from "../tools/Wrapper";
import { DynamicContent } from "./DynamicContent";
import { DynamicContentProps, ThirdPartyProps } from "./types";

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
    return ElementTypes.ThirdParty;
  }

  static experimentalDynamicContent = true;

  static defaultValue = {
    items: []
  };

  component?: ThirdpartyComponent;

  getComponentId(): string {
    const parentId = super.getComponentId();
    const { thirdPartyId } = this.getValue();
    return `${parentId}-${thirdPartyId}`;
  }

  getComponent(ID: string): ThirdpartyComponent | undefined {
    if (this.component) {
      return this.component;
    }

    const data = Editor.getThirdPartyElements()[ID] ?? {};
    const { component, config: { options } = {} } = data;

    if (component) {
      this.component = component;
    }

    if (options) {
      this.componentConfig = {
        getConfig: options
      };
    }

    return this.component;
  }

  translate = (key: string): string => {
    // Used I18n instead of t because when we use t we get the error on compile time
    // when try to extract the translation
    return I18n.t(key);
  };

  getOptions(): Options<Value, Props> {
    const config = this.componentConfig?.getConfig({
      getValue: this.getValueByOptionId,
      getDCOption: this.getDCOptionByType,
      t: this.translate,
      device: this.getDeviceMode()
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

  getDynamiContent(props: DynamicContentProps) {
    return <DynamicContent {...props} />;
  }

  renderToolbars(
    children: (refs?: RefObject<HTMLDivElement>[]) => ReactNode
  ): ReactNode {
    if (!this.componentConfig?.getConfig) {
      return children();
    }

    const toolbars = this.componentConfig.getConfig({
      getValue: this.getValueByOptionId,
      getDCOption: this.getDCOptionByType,
      t: this.translate,
      device: this.getDeviceMode()
    });

    const toolbarsRefs: RefObject<HTMLDivElement>[] = [];
    const generate = (
      toolbars: ToolbarConfig[],
      child: ReactNode
    ): ReactNode => {
      if (!toolbars.length) {
        return child;
      } else {
        const [toolbarData, ...rest] = toolbars;
        const { selector, toolbar, sidebar } = toolbarData;

        const toolbarProps = this.makeToolbarPropsFromConfig2(
          { getItems: () => toolbar ?? [] },
          { getItems: () => sidebar ?? [] }
        );

        const html = (
          <Toolbar selector={selector} {...toolbarProps}>
            {({ ref }) => {
              ref && toolbarsRefs.push(ref);
              return <>{child}</>;
            }}
          </Toolbar>
        );

        return generate(rest, html);
      }
    };

    return generate(toolbars, children(toolbarsRefs));
  }

  render(): ReactNode {
    const { thirdPartyId } = this.getValue();

    // IMPORTANT!!!
    // The getValue method should be called after the getComponent method because at the first we should
    // initialise the component and then get the value

    if (isEditor(this.props.renderContext)) {
      const { editor } = this.getComponent(thirdPartyId) ?? {};
      if (!editor) {
        return `Missing Third Party Component: ${thirdPartyId}`;
      }

      if (this.componentConfig) {
        const v = this.getValue();
        return this.renderToolbars((toolbarRefs) =>
          this.renderForEdit(v, editor, toolbarRefs)
        );
      }

      const v = this.getValue();
      return this.renderForEdit(v, editor);
    }

    if (isView(this.props.renderContext)) {
      const { view } = this.getComponent(thirdPartyId) ?? {};
      if (!view) {
        return `Missing Third Party Component: ${thirdPartyId}`;
      }

      return this.renderForEdit(this.getValue(), view);
    }
  }

  // @ts-expect-error: Props
  renderForEdit(
    v: Record<string, unknown>,
    Component: ComponentType<ThirdPartyProps>,
    toolbarsRef: RefObject<HTMLDivElement>[] = []
  ): ReactNode {
    const { customCSS } = v;
    const thirdPartyClassName = "brz-third-party";
    const { toolbars, sidebars } = this.getOptions();

    const wrapperClassName = this.getCSSClassnames({
      toolbars,
      sidebars
    });

    const device = this.getDeviceMode();

    const className = classNames(thirdPartyClassName, wrapperClassName);
    const _customCSS = Str.read(customCSS) ?? "";
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items"
    });

    return (
      <CustomCSS selectorName={this.getId()} css={_customCSS}>
        {({ ref: cssRef }) => (
          <Wrapper
            {...this.makeWrapperProps({
              className,
              ref: (el) => attachRefs(el, [cssRef, ...toolbarsRef])
            })}
          >
            {/* @ts-expect-error: Type 'unknown' is not assignable to type 'Props<ElementModel, Record<string, any>>'. */}
            <ThirdPartyContextProvider editorProps={itemsProps}>
              <Component
                {...v}
                device={device}
                DynamicContent={this.getDynamiContent}
              />
            </ThirdPartyContextProvider>
          </Wrapper>
        )}
      </CustomCSS>
    );
  }
}

export default ThirdParty;
