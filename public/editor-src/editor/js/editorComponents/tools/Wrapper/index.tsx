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
import { useStore } from "react-redux";
import { identity } from "underscore";
import {
  RenderType,
  isEditor,
  isView
} from "visual/providers/RenderProvider";
import Animation from "visual/component/Animation";
import { ElementModel } from "visual/component/Elements/Types";
import { StoryAnchorAttribute } from "visual/component/Link/types/Slide";
import { hideToolbar } from "visual/component/Toolbar";
import { DH, DW } from "visual/editorComponents/Story/utils";
import { Draggable } from "visual/editorComponents/tools/Draggable";
import { Value as DraggableV } from "visual/editorComponents/tools/Draggable/entities/Value";
import { EditorMode } from "visual/global/EditorModeContext";
import { useCSS } from "visual/providers/StyleProvider/useCSS";
import { deviceModeSelector } from "visual/redux/selectors";
import { WithClassName } from "visual/types/attributes";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import * as Position from "visual/utils/position/element";
import { attachRef } from "visual/utils/react";
import * as Str from "visual/utils/reader/string";
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
  attributes: Record<string, unknown | number> | undefined;
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
  renderContext: RenderType;
  editorMode: EditorMode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDragStart?: (e: Event) => void;
  slide?: StoryAnchorAttribute;
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
    onClick,
    onDragStart,
    slide,
    renderContext
  }: PropsWithChildren<Props<T>>,
  ref: Ref<Element>
): ReactElement {
  const store = useStore();
  const isAbsoluteOrFixed =
    v.elementPosition === "absolute" || v.elementPosition === "fixed";
  const modelClassName = useCSS({
    componentId: `${componentId}-${id}-${wrapperId}`,
    id: `${id}-${wrapperId}`,
    css: isAbsoluteOrFixed ? style({ v, vs, vd, store, renderContext }) : []
  });

  const className = classNames(
    _className,
    Str.read(attributes?.className),
    modelClassName
  );

  if (isAbsoluteOrFixed && isEditor(renderContext)) {
    const state = State.mRead(v.tabsState);
    const device = deviceModeSelector(store.getState());

    const dvv = (key: string): MValue<Literal> => {
      return defaultValueValue({ v, key, device, state });
    };

    const handleDraggable = ({ x, y }: DraggableV): void => {
      const state = State.mRead(v.tabsState);
      const device = deviceModeSelector(store.getState());

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
        isView(renderContext) ?? (sectionPopup || sectionPopup2 ? Infinity : 1)
      }
      component={component ?? "div"}
      componentProps={{ ...attributes, className, onClick, onDragStart, slide }}
      animationClass={animationClass}
      ref={ref}
    >
      {renderContent(children)}
    </Animation>
  );
}

export const Wrapper = forwardRef(WrapperComponent) as typeof WrapperComponent;
