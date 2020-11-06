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
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import * as toolbarExtendConfig from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import contextMenuConfig from "./contextMenu";
import { percentageToPixels } from "visual/utils/meta";
import defaultValue from "./defaultValue.json";
import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { NumberSpec } from "visual/utils/math/number";
import { MRead } from "visual/utils/types/Type";
import { mRead as mStr } from "visual/utils/string/specs";
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

type Value = ElementModel & {
  items: ElementModel[];
};
type Component<P> = ComponentType<P> | keyof JSX.IntrinsicElements;
type Props = {
  meta: {
    desktopW: number;
    tabletW: number;
    mobileW: number;
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

const mNumber: MRead<number> = v => NumberSpec.read(v) ?? 0;

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
    const { meta } = this.props;
    const {
      // Margin
      marginType,
      margin,
      marginSuffix,
      marginLeft,
      marginLeftSuffix,
      marginRight,
      marginRightSuffix,

      // Padding
      paddingType,
      padding,
      paddingSuffix,
      paddingLeft,
      paddingLeftSuffix,
      paddingRight,
      paddingRightSuffix,

      // Align
      horizontalAlign,

      // Tablet Padding
      tabletPadding,
      tabletPaddingType,
      tabletPaddingSuffix,
      tabletPaddingLeft,
      tabletPaddingLeftSuffix,
      tabletPaddingRight,
      tabletPaddingRightSuffix,

      // Tablet margin
      tabletMargin,
      tabletMarginType,
      tabletMarginSuffix,
      tabletMarginLeft,
      tabletMarginLeftSuffix,
      tabletMarginRight,
      tabletMarginRightSuffix,

      // Tablet align
      tabletHorizontalAlign,

      // Mobile Padding
      mobilePadding,
      mobilePaddingType,
      mobilePaddingSuffix,
      mobilePaddingLeft,
      mobilePaddingLeftSuffix,
      mobilePaddingRight,
      mobilePaddingRightSuffix,

      // Mobile margin
      mobileMargin,
      mobileMarginType,
      mobileMarginSuffix,
      mobileMarginLeft,
      mobileMarginLeftSuffix,
      mobileMarginRight,
      mobileMarginRightSuffix,

      // Mobile align
      mobileHorizontalAlign
    } = v;

    const marginW =
      marginType === "grouped"
        ? percentageToPixels(
            mNumber(margin) * 2,
            mStr(marginSuffix),
            meta?.desktopW
          )
        : percentageToPixels(
            mNumber(marginLeft),
            mStr(marginLeftSuffix),
            meta?.desktopW
          ) +
          percentageToPixels(
            mNumber(marginRight),
            mStr(marginRightSuffix),
            meta?.desktopW
          );
    const paddingW =
      paddingType === "grouped"
        ? percentageToPixels(
            mNumber(padding) * 2,
            mStr(paddingSuffix),
            meta?.desktopW
          )
        : percentageToPixels(
            mNumber(paddingLeft),
            mStr(paddingLeftSuffix),
            meta?.desktopW
          ) +
          percentageToPixels(
            mNumber(paddingRight),
            mStr(paddingRightSuffix),
            meta?.desktopW
          );

    // Tablet
    const tabletPaddingW =
      tabletPaddingType === "grouped"
        ? percentageToPixels(
            mNumber(tabletPadding) * 2,
            mStr(tabletPaddingSuffix),
            meta?.tabletW
          )
        : percentageToPixels(
            mNumber(tabletPaddingLeft),
            mStr(tabletPaddingLeftSuffix),
            meta?.tabletW
          ) +
          percentageToPixels(
            mNumber(tabletPaddingRight),
            mStr(tabletPaddingRightSuffix),
            meta?.tabletW
          );
    const tabletMarginW =
      tabletMarginType === "grouped"
        ? percentageToPixels(
            mNumber(tabletMargin) * 2,
            mStr(tabletMarginSuffix),
            meta?.tabletW
          )
        : percentageToPixels(
            mNumber(tabletMarginLeft),
            mStr(tabletMarginLeftSuffix),
            meta?.tabletW
          ) +
          percentageToPixels(
            mNumber(tabletMarginRight),
            mStr(tabletMarginRightSuffix),
            meta?.tabletW
          );

    // Mobile
    const mobilePaddingW =
      mobilePaddingType === "grouped"
        ? percentageToPixels(
            mNumber(mobilePadding) * 2,
            mStr(mobilePaddingSuffix),
            meta?.mobileW
          )
        : percentageToPixels(
            mNumber(mobilePaddingLeft),
            mStr(mobilePaddingLeftSuffix),
            meta?.mobileW
          ) +
          percentageToPixels(
            mNumber(mobilePaddingRight),
            mStr(mobilePaddingRightSuffix),
            meta?.mobileW
          );
    const mobileMarginW =
      mobileMarginType === "grouped"
        ? percentageToPixels(
            mNumber(mobileMargin) * 2,
            mStr(mobileMarginSuffix),
            meta?.mobileW
          )
        : percentageToPixels(
            mNumber(mobileMarginLeft),
            mStr(mobileMarginLeftSuffix),
            meta?.mobileW
          ) +
          percentageToPixels(
            mNumber(mobileMarginRight),
            mStr(mobileMarginRightSuffix),
            meta?.mobileW
          );

    const externalSpacing = marginW + paddingW;
    const externalTabletSpacing = tabletMarginW + tabletPaddingW;
    const externalMobileSpacing = mobileMarginW + mobilePaddingW;

    const mobileW =
      Math.round((meta?.mobileW - externalMobileSpacing) * 10) / 10;
    const tabletW =
      Math.round((meta?.tabletW - externalTabletSpacing) * 10) / 10;
    const desktopW = Math.round((meta?.desktopW - externalSpacing) * 10) / 10;

    return {
      ...meta,
      mobileW,
      tabletW,
      desktopW,
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
