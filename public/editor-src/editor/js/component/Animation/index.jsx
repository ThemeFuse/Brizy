import React, { Component } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

let observerInstances = new Map();
let observer = null;

export default class Animation extends Component {
  static defaultProps = {
    className: "",
    style: {},

    observerRootSelector: null,
    observerRootMargin: "0px",
    observerThreshold: [0],

    name: null,
    delay: 1000,
    duration: 1000
  };

  state = {
    isVisible: false
  };

  initObserver = () => {
    const {
      observerRootSelector,
      observerRootMargin,
      observerThreshold
    } = this.props;

    const options = {
      root: document.querySelector(observerRootSelector),
      rootMargin: observerRootMargin,
      threshold: observerThreshold
    };
    observer = new IntersectionObserver(this.handleIntersection, options);
  };

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);

    if (!this.props.name) {
      return;
    }

    if (observer === null) {
      this.initObserver();
    }

    observer.observe(this.node);
    observerInstances.set(this.node, this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      if (observer === null) {
        this.initObserver();
      }

      if (!observerInstances.has(this.node)) {
        observer.observe(this.node);
        observerInstances.set(this.node, this);
      }
    }
  }

  componentWillUnmount() {
    if (!this.props.name) {
      return;
    }

    observer.unobserve(this.node);
    observerInstances.delete(this.node);

    if (observerInstances.size === 0) {
      observer.disconnect();
      observer = null;
    }
  }

  handleIntersection = entries => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        const instance = observerInstances.get(target);
        observer.unobserve(target);
        instance.setState({ isVisible: true });
      }
    });
  };

  renderForEdit() {
    const {
      className: _className,
      style: _style,
      name,
      delay,
      duration,
      observerRootSelector,
      observerRootMargin,
      observerThreshold,
      children,
      ...otherProps
    } = this.props;
    const { isVisible } = this.state;
    const hasName = Boolean(name);
    const isActive = isVisible && hasName;
    const className = classnames("brz-observer__animation", _className, {
      "brz-animated": hasName,
      [`brz-animated__${name}`]: isActive,
      "brz-animate": isActive
    });
    const style = {
      ..._style,
      ...(hasName
        ? {
            animationDelay: `${delay}ms`,
            animationDuration: `${duration}ms`
          }
        : {})
    };

    return (
      <div className={className} style={style} {...otherProps}>
        {this.props.children}
      </div>
    );
  }

  renderForView() {
    const { className, name, delay, duration, children } = this.props;
    const hasName = Boolean(name);
    const props = {
      className: classnames(className, {
        "brz-animated": hasName
      }),
      ...(hasName
        ? {
            "data-animate-name": `brz-animated__${name}`,
            "data-animate-delay": delay,
            "data-animate-duration": duration
          }
        : {})
    };

    return <div {...props}>{children}</div>;
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
