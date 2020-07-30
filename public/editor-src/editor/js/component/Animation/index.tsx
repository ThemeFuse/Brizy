import React, {
  ComponentProps,
  ComponentType,
  createElement,
  forwardRef,
  PropsWithChildren,
  PropsWithRef,
  ReactElement,
  Ref,
  RefObject
} from "react";
import classNames from "classnames";
import * as Observer from "./Observer";
import { mApply } from "visual/utils/value";
import { WithClassName } from "visual/utils/options/attributes";

type CProps = PropsWithRef<{}> & WithClassName;
type Component<P> = ComponentType<P> | keyof JSX.IntrinsicElements;

type Props<P extends CProps> = PropsWithChildren<
  WithClassName & {
    forwardedRef?: Ref<Element>;
    animationClass?: string;
    component: Component<P>;
    componentProps: P;
  }
>;

type State = {
  isVisible: boolean;
};

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _Animation<
  T extends ComponentType<WithClassName> | keyof JSX.IntrinsicElements
> extends React.Component<Props<ComponentProps<T>>, State> {
  state = {
    isVisible: false
  };

  componentDidMount(): void {
    this.updateRef();

    if (this.props.animationClass) {
      mApply(
        n => Observer.connect(n, this.handleIntersection),
        this.ref.current
      );
    }
  }

  componentDidUpdate(prevProps: Props<ComponentProps<T>>): void {
    this.updateRef();

    if (prevProps.animationClass !== this.props.animationClass) {
      if (this.props.animationClass) {
        mApply(
          n => Observer.connect(n, this.handleIntersection),
          this.ref.current
        );
      } else {
        mApply(Observer.disconnect, this.ref.current);
      }
    }
  }

  componentWillUnmount(): void {
    mApply(Observer.disconnect, this.ref.current);
  }

  handleIntersection = ({
    isIntersecting,
    target
  }: IntersectionObserverEntry): void => {
    if (isIntersecting) {
      Observer.disconnect(target);
      this.setState({ isVisible: true });
    }
  };

  renderForEdit(): ReactElement {
    const {
      component,
      animationClass = "",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      forwardedRef,
      children,
      className: _className,
      componentProps: { className: __className, ...otherProps }
    } = this.props;
    /* eslint-enabled no-unused-vars */
    const { isVisible } = this.state;
    const hasAnimation = this.hasAnimation();
    const isActive = isVisible && hasAnimation;
    const className = classNames(_className, __className, {
      "brz-observer__animation": hasAnimation,
      "brz-animated": hasAnimation,
      [animationClass]: isActive,
      "brz-animate": isActive
    });

    const props = {
      ...otherProps,
      className,
      ref: this.ref
    };

    // todo: find why this does not type check
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return createElement<T>(component, props, children);
  }

  renderForView(): ReactElement {
    const {
      component,
      animationClass = "",
      children,
      className: _className,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      forwardedRef,
      componentProps: { className, ...otherProps }
    } = this.props;
    const hasAnimation = this.hasAnimation();
    const props = {
      ...otherProps,
      className: classNames(_className, className, {
        "brz-animated": hasAnimation,
        [animationClass]: hasAnimation
      }),
      ref: this.ref
    };

    // todo: find why this does not type check
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return createElement<T>(component, props, children);
  }

  render(): ReactElement {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }

  ref: RefObject<Element> = React.createRef<Element>();

  updateRef = (): void => {
    if (this.props.forwardedRef) {
      if (typeof this.props.forwardedRef === "function") {
        this.props.forwardedRef(this.ref.current);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.props.forwardedRef as any).current = this.ref.current;
      }
    }
  };

  hasAnimation = (): boolean => !!this.props.animationClass;
}

function _withRef<
  T extends ComponentType<WithClassName> | keyof JSX.IntrinsicElements
>(
  props: Props<ComponentProps<T>> & { ref?: Ref<Element> },
  ref: Ref<Element>
): ReactElement {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return <_Animation<P, T> {...props} forwardedRef={ref} />;
}

// eslint-disable-next-line react/display-name,@typescript-eslint/no-explicit-any
export const Animation = forwardRef<Element, Props<any>>(
  _withRef
) as typeof _withRef;

export default Animation;
