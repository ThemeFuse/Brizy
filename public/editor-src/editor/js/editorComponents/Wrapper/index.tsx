import React, {
  ComponentType,
  createRef,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import classNames from "classnames";
import EditorComponent, {
  ToolbarExtend
} from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { Roles, currentUserRole } from "visual/component/Roles";
import { getWrapperContainerW } from "visual/utils/meta";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import contextMenuConfig from "./contextMenu";
import defaultValue from "./defaultValue.json";
import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Draggable } from "visual/editorComponents/tools/Draggable";
import { Value as DraggableV } from "visual/editorComponents/tools/Draggable/entities/Value";
import * as Position from "visual/utils/position/element";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import {
  defaultValueKey,
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import * as State from "visual/utils/stateMode";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import ContextMenu from "visual/component/ContextMenu";
import ContainerBorder from "visual/component/ContainerBorder";
import Toolbar, {
  ToolbarExtend as _ToolbarExtend
} from "visual/component/Toolbar";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import PortalToolbar from "visual/component/Toolbar";
import { css } from "visual/utils/cssStyle";
import * as Str from "visual/utils/string/specs";
import { styleWrapper, styleAnimation } from "./styles";
import * as Attr from "visual/utils/string/parseCustomAttributes";
import Animation from "visual/component/Animation";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import { WithClassName } from "visual/utils/options/attributes";
import { attachRef } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";

type Value = ElementModel & {
  items: ElementModel[];
};
type Component<P> = ComponentType<P> | keyof JSX.IntrinsicElements;
type Props = {
  meta: {
    desktopW: number;
    desktopWNoSpacing: number;
    tabletW: number;
    tabletWNoSpacing: number;
    mobileW: number;
    mobileWNoSpacing: number;
    sectionPopup?: boolean;
    sectionPopup2?: boolean;
  };
};

type Static = WithClassName & {
  v: Value;
  vs: Value;
  vd: Value;
  extraAttr?: {};
  ref?: Ref<unknown>;
};

export default class Wrapper extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "Wrapper";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  childToolbarExtend?: ToolbarExtend;

  toolbarRef = createRef<PortalToolbar>();

  handleExtendParentToolbar = (childToolbarExtend: ToolbarExtend): void => {
    this.childToolbarExtend = childToolbarExtend;
  };

  getMeta(v: ElementModel): ElementModel {
    const { horizontalAlign, tabletHorizontalAlign, mobileHorizontalAlign } = v;
    const { meta } = this.props;
    const { w: desktopW, wNoSpacing: desktopWNoSpacing } = getWrapperContainerW(
      {
        v,
        w: meta.desktopW,
        wNoSpacing: meta.desktopWNoSpacing,
        device: DESKTOP
      }
    );
    const { w: tabletW, wNoSpacing: tabletWNoSpacing } = getWrapperContainerW({
      v,
      w: meta.tabletW,
      wNoSpacing: meta.tabletWNoSpacing,
      device: TABLET
    });
    const { w: mobileW, wNoSpacing: mobileWNoSpacing } = getWrapperContainerW({
      v,
      w: meta.mobileW,
      wNoSpacing: meta.mobileWNoSpacing,
      device: MOBILE
    });

    return {
      ...meta,
      desktopW,
      desktopWNoSpacing,
      tabletW,
      tabletWNoSpacing,
      mobileW,
      mobileWNoSpacing,
      horizontalAlign,
      tabletHorizontalAlign,
      mobileHorizontalAlign
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderContent(v: Value, vs: Value, vd: Value): ReactNode {
    const toolbarExtendFilter =
      v.showToolbar === "on" || currentUserRole() !== "admin"
        ? (toolbarExtendItems: ToolbarItemType[]): ToolbarItemType[] =>
            toolbarExtendItems.filter(
              item => item.id !== "duplicate" && item.id !== "remove"
            )
        : null;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.getMeta(v),
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          toolbarExtendConfig,
          sidebarExtendConfig,
          {
            allowExtendFromChild: false,
            parentItemsFilter: toolbarExtendFilter
          }
        ),
        extendParentToolbar: this.handleExtendParentToolbar
      }
    });

    return (
      // Since the EditorArrayComponent is still in JS,
      // TS cannot read properly it's return type
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      <EditorArrayComponent {...itemsProps} />
    );
  }

  renderStatic({ v, vs, vd, extraAttr, className, ref }: Static): ReactElement {
    const { customAttributes } = v;
    const customID = Str.mRead(v.customID) || undefined;
    const cssIDPopulation = Str.mRead(v.cssIDPopulation) || undefined;

    return (
      <ContainerBorder
        type="wrapper"
        color="grey"
        borderStyle="dotted"
        buttonPosition="topRight"
        renderButtonWrapper={this.renderToolbar}
      >
        {({
          ref: containerBorderRef,
          attr: containerBorderAttr,
          button: ContainerBorderButton,
          border: ContainerBorderBorder
        }: {
          ref: Ref<HTMLDivElement>;
          button: ReactElement;
          border: ReactElement;
          attr: {};
        }): ReactElement => (
          <Animation<"div">
            ref={(v: HTMLDivElement | null): void => {
              attachRef(v, containerBorderRef);
              attachRef(v, ref || null);
            }}
            component="div"
            className={classNames(
              this.getWrapperClassName(v, vs, vd),
              className
            )}
            animationClass={this.getAnimationClassName(v, vs, vd)}
            componentProps={{
              ...Attr.mRead(customAttributes),
              ...containerBorderAttr,
              ...extraAttr,
              id: cssIDPopulation ?? customID
            }}
          >
            <ContextMenu
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              {...this.makeContextMenuProps(contextMenuConfig)}
              componentId={v?.items[0]?.type}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={(): ReactNode => this.renderContent(v, vs, vd)}
              >
                {v.showToolbar === "on" ? (
                  <>
                    <_ToolbarExtend onEscape={this.handleToolbarEscape}>
                      {this.renderContent(v, vs, vd)}
                    </_ToolbarExtend>
                    {ContainerBorderButton}
                  </>
                ) : (
                  this.renderContent(v, vs, vd)
                )}
                {ContainerBorderBorder}
              </Roles>
            </ContextMenu>
          </Animation>
        )}
      </ContainerBorder>
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const dvv = (key: string): MValue<Literal> => {
      const state = State.mRead(v.tabsState);
      const device = deviceModeSelector(getStore().getState());

      return defaultValueValue({ v, key, device, state });
    };

    const isRelative = Position.getPosition(dvv) === "relative";

    return (
      <SortableElement type="shortcode">
        {(extraAttr): ReactElement => {
          return (
            <Draggable
              active={!isRelative}
              onChange={this.handleDraggable}
              hAlign={Position.getHAlign(dvv) ?? "left"}
              vAlign={Position.getVAlign(dvv) ?? "top"}
              xSuffix={Position.getHUnit(dvv) ?? "px"}
              ySuffix={Position.getVUnit(dvv) ?? "px"}
              getValue={(): {
                x: number;
                y: number;
              } => ({
                x: Position.getHOffset(dvv) ?? 0,
                y: Position.getVOffset(dvv) ?? 0
              })}
            >
              {(ref, className): ReactNode =>
                isRelative
                  ? this.renderStatic({ v, vs, vd, extraAttr })
                  : this.renderStatic({ v, vs, vd, className, ref })
              }
            </Draggable>
          );
        }}
      </SortableElement>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const { customAttributes } = v;
    const { sectionPopup, sectionPopup2 } = this.props.meta;
    const customID = Str.mRead(v.customID) || undefined;
    const cssIDPopulation = Str.mRead(v.cssIDPopulation) || undefined;

    return (
      <Animation<"div">
        iterationCount={sectionPopup || sectionPopup2 ? Infinity : 1}
        component={"div"}
        className={this.getWrapperClassName(v, vs, vd)}
        animationClass={this.getAnimationClassName(v, vs, vd)}
        componentProps={{
          ...Attr.mRead(customAttributes),
          id: cssIDPopulation ?? customID
        }}
      >
        {this.renderContent(v, vs, vd)}
      </Animation>
    );
  }

  getWrapperClassName = (v: Value, vs: Value, vd: Value): string => {
    const { customClassName, cssClassPopulation } = v;

    const _className =
      cssClassPopulation === ""
        ? Str.mRead(customClassName)
        : Str.mRead(cssClassPopulation);

    return classNames(
      css(this.getComponentId(), this.getId(), styleWrapper(v, vs, vd)),
      "brz-wrapper",
      _className
    );
  };

  getAnimationClassName = (v: Value, vs: Value, vd: Value): string => {
    return classNames(
      validateKeyByProperty(v, "animationName", "none") &&
        css(
          `${this.getComponentId()}-animation,`,
          `${this.getId()}-animation`,
          styleAnimation(v, vs, vd)
        )
    );
  };

  handleDraggable = ({ x, y }: DraggableV): void => {
    const v = this.getValue();
    const state = State.mRead(v.tabsState);
    const device = deviceModeSelector(getStore().getState());

    const dvk = (key: string, value: number): ElementModel => ({
      [defaultValueKey({ key, device, state })]: value
    });

    this.patchValue(
      Position.setHOffset(dvk, x, Position.setVOffset(dvk, y, {}))
    );
  };

  handleToolbarEscape = (): void => this.toolbarRef.current?.show();

  renderToolbar = (Button: Component<{}>): ReactNode => {
    return toolbar ? (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        ref={this.toolbarRef}
      >
        <SortableHandle>
          <Button />
        </SortableHandle>
      </Toolbar>
    ) : null;
  };
}
