import React, { Component } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";

let observerInstances = new Map();
let observer = null;

export default class Animation extends Component {
  static defaultProps = {
    className: "",
    customID: "",

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
      customID,
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
      [`${name}`]: isActive,
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
    const props = {
      ...(customID ? { id: customID } : {}),
      className,
      style,
      ...otherProps
    };

    return <div {...props}>{children}</div>;
  }

  renderForView() {
    const { className, customID, name, delay, duration, children } = this.props;
    const hasName = Boolean(name);
    const props = {
      ...(customID ? { id: customID } : {}),
      className: classnames(className, {
        "brz-animated": hasName
      }),
      ...(hasName
        ? {
            "data-animate-name": name,
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
