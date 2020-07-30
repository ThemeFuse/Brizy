import React, {
  ComponentType,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Ref
} from "react";
import Animation from "visual/component/Animation";
import { WithClassName } from "visual/utils/options/attributes";
import classNames from "classnames";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Plugin<P extends {} = any> = [
  ComponentType<P> | keyof JSX.IntrinsicElements,
  P
];

const applyPlugins = (plugins: Plugin[], children: ReactNode): ReactNode => {
  return plugins
    .reverse()
    .reduce(
      (content, [Plugin, props]) => <Plugin {...props}>{content}</Plugin>,
      children
    );
};

export type Props<T extends {}> = WithClassName & {
  component?: ComponentType<T> | keyof JSX.IntrinsicElements;
  attributes?: T;
  animationClass?: string;
  ref?: Ref<Element>;
  plugins?: Plugin[];
};

export function WrapperComponent<T extends WithClassName & {}>(
  {
    children,
    className: _className,
    component,
    attributes = {} as T,
    animationClass,
    plugins = []
  }: PropsWithChildren<Props<T>>,
  ref: Ref<Element>
): ReactElement {
  const className = classNames(_className, attributes?.className);
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Animation<ComponentType<T>>
      component={component ?? "div"}
      componentProps={{ ...attributes, className }}
      animationClass={animationClass}
      ref={ref}
    >
      {applyPlugins(plugins, children)}
    </Animation>
  );
}

export const Wrapper = forwardRef(WrapperComponent) as typeof WrapperComponent;
