import React, { Component } from "react";
import classnames from "classnames";
import CustomTag from "visual/component/CustomTag";

let observerInstances = new Map();
let observer = null;

export default class Animation extends Component {
  static defaultProps = {
    className: "",
    customID: "",
    tagName: "div",

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

  content = React.createRef();

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
    if (!this.props.name) {
      return;
    }

    if (observer === null) {
      this.initObserver();
    }

    const node = this.content.current;

    if (node) {
      observer.observe(node);
      observerInstances.set(node, this);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      if (observer === null) {
        this.initObserver();
      }

      const node = this.content.current;

      if (!observerInstances.has(node)) {
        observer.observe(node);
        observerInstances.set(node, this);
      }
    }
  }

  componentWillUnmount() {
    if (!this.props.name) {
      return;
    }

    const node = this.content.current;

    if (node) {
      observer.unobserve(node);
      observerInstances.delete(node);
    }

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
    /* eslint-disable no-unused-vars */
    const {
      className: _className,
      tagName,
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
    /* eslint-enabled no-unused-vars */
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
      ...otherProps,
      ref: this.content
    };

    return (
      <CustomTag tagName={tagName} {...props}>
        {children}
      </CustomTag>
    );
  }

  renderForView() {
    const {
      className,
      customID,
      tagName,
      name,
      delay,
      duration,
      children
    } = this.props;
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

    return (
      <CustomTag tagName={tagName} {...props}>
        {children}
      </CustomTag>
    );
  }

  render() {
    return IS_EDITOR ? this.renderForEdit() : this.renderForView();
  }
}
