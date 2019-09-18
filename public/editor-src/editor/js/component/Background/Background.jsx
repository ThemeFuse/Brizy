import React, { Component, Fragment } from "react";
import jQuery from "jquery";
import classnames from "classnames";
import ResizeAware from "react-resize-aware";
import UIEvents from "visual/global/UIEvents";
import { videoUrl } from "visual/utils/video";
import { getStore } from "visual/redux/store";

// Libs
import "./lib/jquery.background-video.js";
import "./lib/jquery.parallax.js";

const needRenderMedia = data => Object.values(data).some(k => k);

class Background extends Component {
  static defaultProps = {
    className: "",
    image: false,
    opacity: false,
    border: false,
    parallax: false,

    // Video
    video: false,

    // Map
    map: false,
    mapZoom: 0,

    // Shape
    shapeTop: "",
    shapeBottom: "",

    style: {}
  };

  image = React.createRef();
  video = React.createRef();
  media = React.createRef();

  constructor(props) {
    super(props);

    const { image, video, parallax } = this.props;
    const currentDeviceMode = getStore().getState().ui.deviceMode;
    const hasVideo = Boolean(video);
    const isDesktop = currentDeviceMode === "desktop";

    this.state = {
      showParallax: image && !hasVideo && parallax && isDesktop,
      showVideo: hasVideo && isDesktop
    };
  }

  getData() {
    const {
      image,
      video,
      map,
      shapeTop,
      shapeBottom,
      border,
      opacity
    } = this.props;

    return { image, video, map, shapeTop, shapeBottom, border, opacity };
  }

  componentDidMount() {
    if (this.state.showParallax) {
      this.initParallax();
    }

    if (this.state.showVideo) {
      this.initVideoPlayer();
    }

    UIEvents.on("deviceMode.change", this.handleDeviceModeChange);
  }

  componentDidUpdate() {
    this.updateBackground();
  }

  componentWillUnmount() {
    if (this.state.showParallax) {
      this.destroyParallax();
    }

    if (this.state.showVideo) {
      this.destroyVideoPlayer();
    }

    UIEvents.off("deviceMode.change", this.handleDeviceModeChange);
  }

  handleDeviceModeChange = mode => {
    if (this.state.showParallax) {
      if (mode === "mobile" || mode === "tablet") {
        this.destroyParallax();
      }

      if (mode === "desktop") {
        this.initParallax();
      }
    }

    if (this.state.showVideo) {
      if (mode === "mobile" || mode === "tablet") {
        this.destroyVideoPlayer();
      }

      if (mode === "desktop") {
        this.initVideoPlayer();
      }
    }
  };

  updateBackground = () => {
    const { image, video, parallax } = this.props;
    const currentDeviceMode = getStore().getState().ui.deviceMode;

    if (image && !video && parallax && currentDeviceMode === "desktop") {
      if (this.state.showParallax) {
        this.updateParallax();
      } else {
        this.initParallax();
        this.setState({
          showParallax: true
        });
      }
    } else {
      if (this.state.showParallax) {
        this.destroyParallax();
        this.setState({
          showParallax: false
        });
      }
    }

    if (video && currentDeviceMode === "desktop") {
      if (this.state.showVideo) {
        this.updateVideoPlayer();
      } else {
        this.initVideoPlayer();
        this.setState({ showVideo: true });
      }
    } else {
      if (this.state.showVideo) {
        this.destroyVideoPlayer();
        this.setState({ showVideo: false });
      }
    }
  };

  initParallax() {
    jQuery(this.image.current).addClass("brz-bg-image-parallax");
    jQuery(this.media.current).parallax({
      bgClass: "brz-bg-image", // WARNING: intentionally not `brz-bg-image-parallax`
      wheelIgnoreClass: [
        "brz-ed-container-plus",
        "brz-ed-container-whiteout-show",
        "brz-content-show"
      ]
    });
  }

  updateParallax() {
    jQuery(this.media.current).parallax("refresh");
  }

  destroyParallax() {
    jQuery(this.image.current).removeClass("brz-bg-image-parallax");
    jQuery(this.media.current).parallax("destroy");
  }

  updateVideoPlayer() {
    const { video, bgVideoQuality } = this.props;
    jQuery(this.video.current).backgroundVideo("refresh", {
      type: video.type,
      quality: bgVideoQuality,
      mute: true
    });
  }

  initVideoPlayer() {
    const { video, bgVideoQuality } = this.props;

    jQuery(this.video.current).backgroundVideo({
      type: video.type,
      autoResize: false,
      autoplay: true,
      quality: bgVideoQuality,
      mute: true
    });
  }

  destroyVideoPlayer() {
    jQuery(this.video.current).backgroundVideo("destroy");
  }

  renderImage() {
    const className = classnames("brz-bg-image", {
      "brz-bg-image-parallax": this.state.showParallax
    });

    return <div ref={this.image} className={className} />;
  }

  renderVideo() {
    const { video, bgVideoLoop, bgVideoQuality } = this.props;
    const iframeStyle = {
      display: video ? "block" : "none"
    };
    const settings = {
      autoplay: true,
      background: true,
      controls: false,
      suggestedVideo: false,
      loop: bgVideoLoop,
      quality: bgVideoQuality
    };

    const src = video ? videoUrl(video, settings) : null;
    const dataType = video ? video.type : null;

    return (
      <div
        ref={this.video}
        className="brz-bg-video"
        data-type={dataType}
        data-mute="on"
        data-autoplay="on"
        data-quality={settings.quality}
      >
        <iframe
          src={IS_EDITOR ? src : ""}
          data-src={src}
          className="brz-iframe brz-bg-video__cover"
          style={iframeStyle}
        />
      </div>
    );
  }

  renderMap() {
    const { map, mapZoom } = this.props;
    const URL =
      "https://www.google.com/maps/embed/v1/place?key=AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw";
    const iframeStyle = {
      display: map ? "block" : "none"
    };
    const src = map ? `${URL}&q=${map}&zoom=${mapZoom}` : null;

    return (
      <div className="brz-bg-map">
        <iframe
          className="brz-iframe brz-bg-map__cover"
          src={src}
          style={iframeStyle}
        />
      </div>
    );
  }

  renderColor() {
    return <div className="brz-bg-color" />;
  }

  renderShape() {
    const { shapeTop, shapeBottom } = this.props;

    return (
      <Fragment>
        {shapeTop && <div className="brz-bg-shape brz-bg-shape__top" />}
        {shapeBottom && <div className="brz-bg-shape brz-bg-shape__bottom" />}
      </Fragment>
    );
  }

  render() {
    const { className: _className, style, parallax, children } = this.props;
    const className = classnames("brz-bg", _className);
    const data = this.getData();
    const needsResizeDetection = IS_EDITOR && (data.video || parallax);

    return (
      <div className={className} style={style}>
        {needRenderMedia(data) && (
          <div ref={this.media} className="brz-bg-media">
            {data.image && this.renderImage()}
            {data.video && this.renderVideo()}
            {data.map && this.renderMap()}
            {data.opacity && this.renderColor()}
            {(data.shapeTop || data.shapeBottom) && this.renderShape()}
          </div>
        )}
        <div className="brz-bg-content">{children}</div>
        {needsResizeDetection && (
          <ResizeAware onResize={this.updateBackground} />
        )}
      </div>
    );
  }
}

export default Background;
