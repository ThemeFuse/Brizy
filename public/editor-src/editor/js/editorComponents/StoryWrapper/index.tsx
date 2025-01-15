import classNames from "classnames";
import React, {
  Attributes,
  ComponentType,
  ReactElement,
  ReactNode,
  Ref,
  createRef
} from "react";
import ContainerBorder from "visual/component/ContainerBorder";
import ContextMenu from "visual/component/ContextMenu";
import { ElementModel } from "visual/component/Elements/Types";
import { currentUserRole } from "visual/component/Roles";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import Toolbar, {
  ToolbarExtend as _ToolbarExtend
} from "visual/component/Toolbar";
import { PortalToolbar } from "visual/component/Toolbar/PortalToolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import {
  ComponentsMeta,
  ToolbarExtend
} from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { CssId } from "visual/utils/models/cssId";
import {
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import * as Position from "visual/utils/position/element";
import * as State from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleWrapper } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./toolbarExtend";

type Component<P> = ComponentType<P> | keyof JSX.IntrinsicElements;
type Item = {
  type: string;
  value: ElementModel;
};

interface Value extends ElementModel, CssId {
  items: Item[];
}

type Props = {
  meta: ComponentsMeta;
};

export class StoryWrapper extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "StoryWrapper";
  }

  static defaultValue = defaultValue;

  toolbarRef = createRef<PortalToolbar>();

  handleExtendParentToolbar = (childToolbarExtend: ToolbarExtend): void => {
    this.childToolbarExtend = childToolbarExtend;
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const toolbarExtendFilter =
      v.showToolbar === "on" || currentUserRole() !== "admin"
        ? (toolbarExtendItems: ToolbarItemType[]): ToolbarItemType[] =>
            toolbarExtendItems.filter(
              (item) => item.id !== "duplicate" && item.id !== "remove"
            )
        : null;
    const state = State.mRead(v.tabsState);
    const device = this.getDeviceMode();
    const dvv = (key: string): MValue<Literal> =>
      defaultValueValue({ v, key, device, state });
    const isRelative = Position.getPosition(dvv) === "relative";

    return (
      <ContainerBorder
        type="wrapper"
        color="grey"
        borderStyle="dotted"
        buttonPosition="topRight"
        renderButtonWrapper={this.renderToolbar}
      >
        {({
          ref,
          attr,
          border,
          button
        }: {
          ref: Ref<HTMLDivElement>;
          attr: Attributes;
          border: ReactElement;
          button: ReactNode;
        }): ReactNode => {
          const itemsProps = this.makeSubcomponentProps({
            bindWithKey: "items",
            itemProps: {
              toolbarExtend: this.makeToolbarPropsFromConfig2(
                toolbarExtendConfig,
                // @ts-expect-error: Need convert to ts
                sidebarExtendConfig,
                {
                  allowExtendFromChild: false,
                  parentItemsFilter: toolbarExtendFilter
                }
              ),
              extendParentToolbar: this.handleExtendParentToolbar,
              meta: { ...this.props.meta, wrapperId: this.getId() },
              wrapperExtend: {
                ref,
                attributes: attr,
                className: this.getWrapperClassName(v, vs, vd),
                animationClass: this.getAnimationClassName(v, vs, vd),
                // eslint-disable-next-line react/display-name
                renderContent: (children: ReactElement): React.ReactNode => {
                  const content = isRelative ? (
                    <SortableElement type="shortcode">
                      {children}
                    </SortableElement>
                  ) : (
                    children
                  );

                  return (
                    <>
                      {v.showToolbar === "on" ? (
                        <_ToolbarExtend onEscape={this.handleToolbarEscape}>
                          {content}
                          {button}
                        </_ToolbarExtend>
                      ) : (
                        content
                      )}
                      {border}
                    </>
                  );
                }
              }
            }
          });

          return (
            <ContextMenu
              {...{
                // @ts-expect-error: Need to transform to TS
                ...this.makeContextMenuProps(contextMenuConfig),
                componentId: v?.items[0]?.type ?? ""
              }}
            >
              {
                /**
                 * Since the EditorArrayComponent is still in JS
                 * TS cannot read properly it's return type
                 * @ts-expect-error */
                <EditorArrayComponent {...itemsProps} />
              }
            </ContextMenu>
          );
        }}
      </ContainerBorder>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): React.ReactNode {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.props.meta,
        wrapperExtend: {
          className: this.getWrapperClassName(v, vs, vd),
          animationClass: this.getAnimationClassName(v, vs, vd)
        }
      }
    });

    /**
     * Since the EditorArrayComponent is still in JS
     * TS cannot read properly it's return type
     * @ts-expect-error */
    return <EditorArrayComponent {...itemsProps} />;
  }

  getWrapperClassName = (v: Value, vs: Value, vd: Value): string => {
    const { customClassName, cssClass } = v;
    const _className = Str.mRead(cssClass || customClassName);

    return classNames(
      this.css(
        this.getComponentId(),
        this.getId(),
        styleWrapper({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      ),
      "brz-wrapper",
      _className
    );
  };

  getAnimationClassName = (v: Value, vs: Value, vd: Value): string => {
    return classNames(
      validateKeyByProperty(v, "animationName", "none") &&
        this.css(
          `${this.getComponentId()}-animation,`,
          `${this.getId()}-animation`,
          styleAnimation({
            v,
            vs,
            vd,
            store: this.getReduxStore(),
            renderContext: this.renderContext
          })
        )
    );
  };

  handleToolbarEscape = (): void => this.toolbarRef.current?.show();

  renderToolbar = (Button: Component<unknown>): ReactNode => {
    return (
      <Toolbar
        // @ts-expect-error: Need to transform to TS
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.toolbarRef}
      >
        <SortableHandle renderContext={this.renderContext}>
          <Button />
        </SortableHandle>
      </Toolbar>
    );
  };
}
