import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import { preloadImage } from "visual/utils/image";

let observerInstances = new Map();
let observer = null;

export default class LazyLoadImage extends Component {
  static defaultProps = {
    width: 100,
    height: 100,
    src: "",
    observerRootSelector: null,
    observerRootMargin: "0px",
    observerThreshold: [0],
    spinnerDelay: 250,
    style: {},
    onImageLoaded: _.noop
  };

  state = {
    imageFetched: false,
    showSpinner: false
  };

  componentDidMount() {
    this.mounted = true;

    this.node = ReactDOM.findDOMNode(this);

    if (observer === null) {
      const {
        observerRootSelector,
        observerRootMargin,
        observerThreshold
      } = this.props;
      const observerRoot = this.node.ownerDocument.querySelector(
        observerRootSelector
      );
      const options = {
        root: observerRoot,
        rootMargin: observerRootMargin,
        threshold: observerThreshold
      };
      observer = new this.node.ownerDocument.defaultView.IntersectionObserver(
        this.handleIntersection,
        options
      );

      // Needed for safari and old browsers polyfill
      observer.POLL_INTERVAL = 200;
    }

    observer.observe(this.node);
    observerInstances.set(this.node, this);

    setTimeout(() => {
      if (this.mounted && !this.state.imageFetched) {
        this.setState({ showSpinner: true });
      }
    }, this.props.spinnerDelay);
  }

  componentWillUnmount() {
    this.mounted = false;

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
        if (!instance) return;

        const imgUrl = instance.props.src;
        preloadImage(imgUrl).then(() => {
          if (observer) {
            observer.unobserve(target);
          }

          if (instance.mounted) {
            instance.setState(
              { imageFetched: true, showSpinner: false },
              instance.props.onImageLoaded()
            );
          }
        });
      }
    });
  };

  render() {
    const { width, height, src, style } = this.props;
    const { imageFetched, showSpinner } = this.state;
    const ratio = Math.round((height / width) * 100 * 10) / 10;

    return (
      <div className="brz-observer__image" style={{ paddingTop: `${ratio}%` }}>
        {showSpinner && (
          <div className="brz-ed-option__block-thumbnail-loading">
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          </div>
        )}
        {imageFetched && (
          <img
            className="brz-img"
            style={style}
            src={src}
            alt="lazyLoad Image"
          />
        )}
      </div>
    );
  }
}
