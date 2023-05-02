import classNames from "classnames";
import React, {
  ComponentProps,
  ComponentType,
  PropsWithChildren,
  PropsWithRef,
  ReactElement,
  Ref,
  RefObject,
  createElement,
  forwardRef
} from "react";
import UIEvents from "visual/global/UIEvents";
import { WithClassName } from "visual/utils/options/attributes";
import { mApply } from "visual/utils/value";
import * as Observer from "./Observer";
import { AnimationEvents } from "./utils";

type CProps = PropsWithRef<unknown> & WithClassName;
type Component<P> = ComponentType<P> | keyof JSX.IntrinsicElements;

type Props<P extends CProps> = PropsWithChildren<
  WithClassName & {
    forwardedRef?: Ref<Element>;
    animationClass?: string;
    iterationCount?: number;
    component: Component<P>;
    componentProps: P;
    animationId?: string;
  }
>;

type State = {
  isVisible: boolean;
  animationClass?: string;
};

class _Animation<
  T extends ComponentType<WithClassName> | keyof JSX.IntrinsicElements
> extends React.Component<Props<ComponentProps<T>>, State> {
  constructor(props: Props<ComponentProps<T>>) {
    super(props);

    this.state = {
      isVisible: false,
      animationClass: props.animationClass
    };
  }

  private updateId?: number;
  private animationStartedId?: number;
  private mounted = false;

  handleAnimationStarted() {
    UIEvents.emit(AnimationEvents.entranceOn, {
      animationIsRunning: true,
      animationId: this.props.animationId
    });
  }

  handleAnimationFinished() {
    UIEvents.emit(AnimationEvents.entranceOff, {
      animationIsRunning: false,
      animationId: this.props.animationId
    });
  }

  componentDidMount(): void {
    this.mounted = true;
    this.updateRef();

    if (this.props.animationClass) {
      this.animationStartedId = requestAnimationFrame(() => {
        this.handleAnimationStarted();
      });

      mApply(
        (n) => Observer.connect(n, this.handleIntersection),
        this.ref.current
      );
      this.ref.current?.addEventListener("animationend", () => {
        if (this.mounted) {
          this.handleAnimationFinished();
          this.setState({
            animationClass: "none"
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps: Props<ComponentProps<T>>): void {
    this.updateRef();

    if (prevProps.animationClass !== this.props.animationClass) {
      if (this.props.animationClass) {
        this.handleAnimationStarted();
        mApply(
          (n) => Observer.connect(n, this.handleIntersection),
          this.ref.current
        );

        mApply(cancelAnimationFrame, this.updateId);
        this.updateId = requestAnimationFrame(() => {
          this.setState({ animationClass: this.props.animationClass });

          this.ref.current?.addEventListener("animationend", () => {
            if (this.mounted) {
              this.setState({
                animationClass: "none"
              });
              this.handleAnimationFinished();
            }
          });
        });
      } else {
        mApply(Observer.disconnect, this.ref.current);
      }
    }
  }

  componentWillUnmount(): void {
    mApply(Observer.disconnect, this.ref.current);
    mApply(cancelAnimationFrame, this.updateId);
    mApply(cancelAnimationFrame, this.animationStartedId);
    UIEvents.off(AnimationEvents.entranceOn, this.handleAnimationStarted);
    UIEvents.off(AnimationEvents.entranceOff, this.handleAnimationFinished);
    this.mounted = false;
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
      [this.getAnimationClass() ?? ""]: isActive,
      "brz-animate": isActive,
      "brz-animate-opacity": isActive
    });

    const props = {
      ...otherProps,
      className,
      "data-animationid": this.props?.animationId,
      ref: this.ref
    };

    // @ts-expect-error: find why this does not type check
    return createElement<T>(component, props, children);
  }

  renderForView(): ReactElement {
    const {
      component,
      iterationCount = 1,
      children,
      className: _className,
      componentProps: { className, ...otherProps }
    } = this.props;
    const hasAnimation = this.hasAnimation();
    const props = {
      ...otherProps,
      ...(hasAnimation ? { "data-iteration-count": iterationCount } : {}),
      className: classNames(_className, className, {
        "brz-animated": hasAnimation,
        [this.getAnimationClass() ?? ""]: hasAnimation
      }),
      ref: this.ref,
      "data-animationid": this.props?.animationId
    };

    // @ts-expect-error: find why this does not type check
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

  hasAnimation = (): boolean => !!this.state.animationClass;

  getAnimationClass = (): string | undefined => {
    return this.props.animationClass !== this.state.animationClass
      ? undefined
      : this.state.animationClass;
  };
}

function _withRef<
  T extends ComponentType<WithClassName> | keyof JSX.IntrinsicElements
>(
  props: Props<ComponentProps<T>> & { ref?: Ref<Element> },
  ref: Ref<Element>
): ReactElement {
  // @ts-expect-error: have problems with generic jsx and tsc
  return <_Animation {...props} forwardedRef={ref} />;
}

// eslint-disable-next-line react/display-name,@typescript-eslint/no-explicit-any
export const Animation = forwardRef<Element, Props<any>>(
  _withRef
) as typeof _withRef;

export default Animation;
