import classNames from "classnames";
import React, {
  ComponentType,
  createRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import Animation from "visual/component/Animation";
import ContainerBorder from "visual/component/ContainerBorder";
import ContextMenu, { ContextMenuExtend } from "visual/component/ContextMenu";
import { ElementModel } from "visual/component/Elements/Types";
import { ProBlocked } from "visual/component/ProBlocked";
import { currentUserRole, Roles } from "visual/component/Roles";
import { ScrollMotion } from "visual/component/ScrollMotions";
import { makeOptionValueToMotion } from "visual/component/ScrollMotions/utils";
import {
  SortableElement,
  SortableElementDataAttributes
} from "visual/component/Sortable/SortableElement";
import SortableHandle from "visual/component/Sortable/SortableHandle";
import Toolbar, {
  ToolbarExtend as _ToolbarExtend
} from "visual/component/Toolbar";
import { PortalToolbar } from "visual/component/Toolbar/PortalToolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent, {
  Props as EDProps,
  ToolbarExtend
} from "visual/editorComponents/EditorComponent";
import { getProTitle } from "visual/editorComponents/EditorComponent/utils";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { Draggable } from "visual/editorComponents/tools/Draggable";
import { Value as DraggableV } from "visual/editorComponents/tools/Draggable/entities/Value";
import { getContainerSizes } from "visual/editorComponents/tools/Draggable/utils";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { getWrapperContainerW } from "visual/utils/meta";
import {
  defaultValueKey,
  defaultValueValue,
  validateKeyByProperty
} from "visual/utils/onChange";
import { WithClassName } from "visual/utils/options/attributes";
import * as Position from "visual/utils/position/element";
import { attachRef } from "visual/utils/react";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import * as State from "visual/utils/stateMode";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import * as Attr from "visual/utils/string/parseCustomAttributes";
import * as Str from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import contextMenuConfig from "./contextMenu";
import contextMenuConfigPro from "./contextMenuPro";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarExtendConfig from "./sidebarExtend";
import { styleAnimation, styleWrapper } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtendConfig from "./toolbarExtend";
import { OnChangeMeta } from "visual/editorComponents/EditorComponent/types";

export type Value = ElementModel & {
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
  extraAttr?: SortableElementDataAttributes;
  ref?: Ref<unknown>;
};

export default class Wrapper extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "Wrapper";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  childToolbarExtend?: ToolbarExtend = undefined;

  toolbarRef = createRef<PortalToolbar>();

  shouldComponentUpdate(nextProps: EDProps<Value, Props>): boolean {
    return this.optionalSCU(nextProps);
  }

  getInnerElement(): MValue<{ type: string; value: ElementModel }> {
    const v = this.getDBValue();
    return v.items[0] as MValue<{ type: string; value: ElementModel }>;
  }

  getTitleIfPro(): string | undefined {
    const model = this.getInnerElement();

    if (model !== undefined) {
      return NoEmptyString.is(model.type)
        ? getProTitle(model.type, model.value)
        : undefined;
    }

    return undefined;
  }

  handleValueChange(value: Value, meta: OnChangeMeta<Value>): void {
    if (value.items.length === 0) {
      this.selfDestruct();
    } else {
      super.handleValueChange(value, meta);
    }
  }

  handleRemove = (): void => {
    this.selfDestruct();
  };

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

  renderContent(v: Value): ReactElement {
    const toolbarExtendFilter =
      v.showToolbar === "on" || currentUserRole() !== "admin"
        ? (toolbarExtendItems: ToolbarItemType[]): ToolbarItemType[] =>
            toolbarExtendItems.filter(
              (item) => item.id !== "duplicate" && item.id !== "remove"
            )
        : null;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.getMeta(v),
        toolbarExtend: this.makeToolbarPropsFromConfig2(
          // @ts-expect-error: Need to convert all toolbars, sidebar to TS
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
      /**
       * Since the EditorArrayComponent is still in JS,
       * TS cannot read properly it's return type
       * @ts-expect-error */
      <EditorArrayComponent {...itemsProps} />
    );
  }

  renderStatic({ v, vs, vd, extraAttr, className, ref }: Static): ReactElement {
    const { customAttributes } = v;
    const customID = Str.mRead(v.customID) || undefined;
    const cssIDPopulation = Str.mRead(v.cssIDPopulation) || undefined;
    const proTitleElement = this.getTitleIfPro();

    if (proTitleElement) {
      const content = (
        <ProBlocked
          text={proTitleElement}
          absolute={false}
          onRemove={this.handleRemove}
        />
      );

      return (
        <ContainerBorder type="wrapper" color="grey" borderStyle="dotted">
          {({
            ref: containerBorderRef,
            attr: containerBorderAttr,
            border: ContainerBorderBorder
          }: {
            ref: Ref<HTMLDivElement>;
            border: ReactElement;
            attr: HTMLAttributes<Element>;
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
              <ContextMenuExtend
                // @ts-expect-error: Need to convert contextMenuConfig to TS
                {...this.makeContextMenuProps(contextMenuConfigPro)}
              >
                <ContextMenu
                  // @ts-expect-error: Need to convert contextMenuConfig to TS
                  {...this.makeContextMenuProps(contextMenuConfig)}
                  componentId={v?.items[0]?.type}
                >
                  <Roles
                    allow={["admin"]}
                    fallbackRender={(): ReactNode => content}
                  >
                    {v.showToolbar === "on" ? (
                      <_ToolbarExtend onEscape={this.handleToolbarEscape}>
                        {content}
                      </_ToolbarExtend>
                    ) : (
                      content
                    )}
                    {ContainerBorderBorder}
                  </Roles>
                </ContextMenu>
              </ContextMenuExtend>
            </Animation>
          )}
        </ContainerBorder>
      );
    }

    const content = (
      <ScrollMotion options={makeOptionValueToMotion(v)}>
        {this.renderContent(v)}
      </ScrollMotion>
    );

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
          attr: HTMLAttributes<Element>;
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
              // @ts-expect-error: Need to convert contextMenuConfig to TS
              {...this.makeContextMenuProps(contextMenuConfig)}
              componentId={v?.items[0]?.type}
            >
              <Roles
                allow={["admin"]}
                fallbackRender={(): ReactNode => content}
              >
                {v.showToolbar === "on" ? (
                  <>
                    <_ToolbarExtend onEscape={this.handleToolbarEscape}>
                      {content}
                    </_ToolbarExtend>
                    {ContainerBorderButton}
                  </>
                ) : (
                  content
                )}
                {ContainerBorderBorder}
              </Roles>
            </ContextMenu>
          </Animation>
        )}
      </ContainerBorder>
    );
  }

  containerSize = (): { width: number; height: number } => {
    const v = this.getValue();
    const device = deviceModeSelector(getStore().getState());
    const meta = this.getMeta(v);
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    return getContainerSizes(v, device, meta, innerWidth, innerHeight);
  };

  dvv = (key: string): MValue<Literal> => {
    const v = this.getValue();
    const device = deviceModeSelector(getStore().getState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const isRelative = Position.getPosition(this.dvv) === "relative";

    return (
      <SortableElement type="shortcode">
        {(extraAttr): ReactElement => {
          return (
            <Draggable
              active={!isRelative}
              onChange={this.handleDraggable}
              hAlign={Position.getHAlign(this.dvv) ?? "left"}
              vAlign={Position.getVAlign(this.dvv) ?? "top"}
              xSuffix={Position.getHUnit(this.dvv) ?? "px"}
              ySuffix={Position.getVUnit(this.dvv) ?? "px"}
              getValue={(): {
                x: number;
                y: number;
              } => ({
                x: Position.getHOffset(this.dvv) ?? 0,
                y: Position.getVOffset(this.dvv) ?? 0
              })}
              getContainerSizes={this.containerSize}
            >
              {(ref, className): ReactNode =>
                isRelative
                  ? this.renderStatic({ v, vs, vd, extraAttr })
                  : this.renderStatic({
                      v,
                      vs,
                      vd,
                      className,
                      ref
                    })
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
        className={classNames(this.getWrapperClassName(v, vs, vd))}
        animationClass={this.getAnimationClassName(v, vs, vd)}
        componentProps={{
          ...Attr.mRead(customAttributes),
          id: cssIDPopulation ?? customID
        }}
      >
        <ScrollMotion options={makeOptionValueToMotion(v)}>
          {this.renderContent(v)}
        </ScrollMotion>
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

  getAnimationClassName = (
    v: Value,
    vs: Value,
    vd: Value
  ): string | undefined => {
    if (!validateKeyByProperty(v, "animationName", "none")) {
      return undefined;
    }

    const animationName = this.dvv("animationName");
    const animationDuration = this.dvv("animationDuration");
    const animationDelay = this.dvv("animationDelay");
    const animationInfiniteAnimation = this.dvv("animationInfiniteAnimation");

    const slug = `${animationName}-${animationDuration}-${animationDelay}-${animationInfiniteAnimation}`;

    return classNames(
      css(
        `${this.getComponentId()}-animation-${slug}`,
        `${this.getId()}-animation-${slug}`,
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

  renderToolbar = (Button: Component<Record<string, unknown>>): ReactNode => {
    const isPro = this.getTitleIfPro();

    return toolbar && isPro === undefined ? (
      <Toolbar
        // @ts-expect-error: Need convert toolbar, sidebar to TS
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
