import classNames from "classnames";
import React, {
  ComponentType,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Ref,
  forwardRef
} from "react";
import { identity } from "underscore";
import Animation from "visual/component/Animation";
import { ElementModel } from "visual/component/Elements/Types";
import { hideToolbar } from "visual/component/Toolbar";
import { DH, DW } from "visual/editorComponents/Story/utils";
import { Draggable } from "visual/editorComponents/tools/Draggable";
import { Value as DraggableV } from "visual/editorComponents/tools/Draggable/entities/Value";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { css } from "visual/utils/cssStyle";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { WithClassName } from "visual/utils/options/attributes";
import * as Position from "visual/utils/position/element";
import { attachRef } from "visual/utils/react";
import * as State from "visual/utils/stateMode";
import { Literal } from "visual/utils/types/Literal";
import { uuid } from "visual/utils/uuid";
import { MValue } from "visual/utils/value";
import { style } from "./styles";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<P extends Record<string, unknown> = any> = [
  ComponentType<P> | keyof JSX.IntrinsicElements,
  P
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Props<T extends Record<any, any>> extends WithClassName {
  component?: ComponentType<T> | keyof JSX.IntrinsicElements;
  attributes: Record<string, string | number> | undefined;
  animationClass?: string;
  ref?: Ref<Element>;
  meta: { sectionPopup?: boolean; sectionPopup2?: boolean };
  renderContent?: (children: React.ReactNode) => React.ReactNode;
  v: ElementModel;
  vs: ElementModel;
  vd: ElementModel;
  componentId: string;
  id: string;
  onChange: (patch: Partial<ElementModel>) => void;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const wrapperId = uuid(7);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WrapperComponent<T extends WithClassName & Record<any, any>>(
  {
    children,
    className: _className,
    component,
    attributes = {},
    animationClass,
    renderContent = identity,
    v,
    vs,
    vd,
    componentId,
    id,
    onChange,
    meta: { sectionPopup, sectionPopup2 },
    onClick
  }: PropsWithChildren<Props<T>>,
  ref: Ref<Element>
): ReactElement {
  const isAbsoluteOrFixed =
    v.elementPosition === "absolute" || v.elementPosition === "fixed";

  const className = classNames(
    _className,
    attributes?.className,
    isAbsoluteOrFixed &&
      css(
        `${componentId}-${id}-${wrapperId}`,
        `${id}-${wrapperId}`,
        style(v, vs, vd)
      )
  );

  if (isAbsoluteOrFixed && IS_EDITOR) {
    const state = State.mRead(v.tabsState);
    const device = deviceModeSelector(getStore().getState());

    const dvv = (key: string): MValue<Literal> => {
      return defaultValueValue({ v, key, device, state });
    };

    const handleDraggable = ({ x, y }: DraggableV): void => {
      const state = State.mRead(v.tabsState);
      const device = deviceModeSelector(getStore().getState());

      const dvk = (key: string, value: number): ElementModel => ({
        [defaultValueKey({ key, device, state })]: value
      });

      onChange(Position.setHOffset(dvk, x, Position.setVOffset(dvk, y, {})));
    };

    const getContainerSizes = (): { width: number; height: number } => {
      // this code will execute only inside stories - this way we use DW & DH
      // if smth. will change - and container size will be another - don't
      // forget to change this code
      return {
        width: DW,
        height: DH
      };
    };

    const handleStart = (): void => {
      hideToolbar();
    };

    return (
      <Draggable
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
        getContainerSizes={getContainerSizes}
        onStart={handleStart}
        onChange={handleDraggable}
      >
        {(dRef: Ref<HTMLElement>, dClassName?: string): ReactNode => {
          return (
            /**
             * Type 'ComponentClass<T, any>' is not assignable to type
             * 'ComponentClass<WithClassName, any>'.
             * @ts-expect-error */
            <Animation<ComponentType<T>>
              component={component ?? "div"}
              componentProps={{
                ...attributes,
                className: classNames(className, dClassName),
                onClick
              }}
              animationClass={animationClass}
              ref={(r: HTMLElement | null): void => {
                attachRef(r, dRef);
                attachRef(r, ref);
              }}
            >
              {renderContent(children)}
            </Animation>
          );
        }}
      </Draggable>
    );
  }

  return (
    /**
     * Type 'ComponentClass<T, any>' is not assignable to type
     * 'ComponentClass<WithClassName, any>'.
     * @ts-expect-error */
    <Animation<ComponentType<T>>
      iterationCount={
        IS_PREVIEW ?? (sectionPopup || sectionPopup2 ? Infinity : 1)
      }
      component={component ?? "div"}
      componentProps={{ ...attributes, className, onClick }}
      animationClass={animationClass}
      ref={ref}
    >
      {renderContent(children)}
    </Animation>
  );
}

export const Wrapper = forwardRef(WrapperComponent) as typeof WrapperComponent;
