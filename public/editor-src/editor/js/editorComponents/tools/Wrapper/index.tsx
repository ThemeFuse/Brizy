import React, {
  ComponentType,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import { identity } from "underscore";
import classNames from "classnames";
import Animation from "visual/component/Animation";
import { WithClassName } from "visual/utils/options/attributes";
import { ElementModel } from "visual/component/Elements/Types";
import { Draggable } from "visual/editorComponents/tools/Draggable";
import { hideToolbar } from "visual/component/Toolbar";
import { MValue } from "visual/utils/value";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import * as Position from "visual/utils/position/element";
import * as State from "visual/utils/stateMode";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Literal } from "visual/utils/types/Literal";
import { Value as DraggableV } from "visual/editorComponents/tools/Draggable/entities/Value";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { uuid } from "visual/utils/uuid";
import { attachRef } from "visual/utils/react";
import { DW, DH } from "visual/editorComponents/Story/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<P extends {} = any> = [
  ComponentType<P> | keyof JSX.IntrinsicElements,
  P
];

export type Props<T extends {}> = WithClassName & {
  component?: ComponentType<T> | keyof JSX.IntrinsicElements;
  attributes?: T;
  animationClass?: string;
  ref?: Ref<Element>;
  meta: { sectionPopup?: boolean; sectionPopup2?: boolean };
  plugins?: Plugin[];
  renderContent?: (children: React.ReactNode) => React.ReactNode;
  v: ElementModel;
  vs: ElementModel;
  vd: ElementModel;
  componentId: string;
  id: string;
  onChange: (patch: Partial<ElementModel>) => void;
};

const wrapperId = uuid(7);

export function WrapperComponent<T extends WithClassName & {}>(
  {
    children,
    className: _className,
    component,
    attributes = {} as T,
    animationClass,
    renderContent = identity,
    v,
    vs,
    vd,
    componentId,
    id,
    onChange,
    meta: { sectionPopup, sectionPopup2 }
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
        onStart={hideToolbar}
        onChange={handleDraggable}
      >
        {(dRef: Ref<HTMLElement>, dClassName?: string): ReactNode => {
          return (
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            <Animation<ComponentType<T>>
              component={component ?? "div"}
              componentProps={{
                ...attributes,
                className: classNames(className, dClassName)
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Animation<ComponentType<T>>
      iterationCount={
        IS_PREVIEW ?? (sectionPopup || sectionPopup2 ? Infinity : 1)
      }
      component={component ?? "div"}
      componentProps={{ ...attributes, className }}
      animationClass={animationClass}
      ref={ref}
    >
      {renderContent(children)}
    </Animation>
  );
}

export const Wrapper = forwardRef(WrapperComponent) as typeof WrapperComponent;
