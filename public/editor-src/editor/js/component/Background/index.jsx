import React from "react";
import jQuery from "jquery";
import classnames from "classnames";
import ResizeAware from "react-resize-aware";
import UIEvents from "visual/global/UIEvents";
import { videoUrl } from "visual/utils/video";
import { getStore } from "visual/redux/store";

// Libs
import "./lib/jquery.background-video.js";
import "./lib/jquery.parallax.js";

class Background extends React.Component {
  static defaultProps = {
    className: "",
    imageSrc: "",
    colorOpacity: 0,
    parallax: false,

    // Video
    video: false,

    // Shape
    shapeTopType: "",
    shapeBottomType: "",

    // Tablet
    tabletImageSrc: "",
    tabletColorOpacity: 0,

    // Mobile
    mobileImageSrc: "",
    mobileColorOpacity: 0,

    style: {}
  };

  constructor(props) {
    super(props);

    this.parallaxPluginInited = false;
    this.videoPluginInited = false;
  }

  componentDidMount() {
    const { imageSrc, video, parallax } = this.props;
    const hasImage = Boolean(imageSrc);
    const hasVideo = Boolean(video);
    const currentDeviceMode = getStore().getState().ui.deviceMode;

    if (hasImage && !hasVideo && parallax && currentDeviceMode === "desktop") {
      this.initParallax();
      this.parallaxPluginInited = true;
    }

    if (hasVideo && currentDeviceMode === "desktop") {
      this.initVideoPlayer();
      this.videoPluginInited = true;
    }

    UIEvents.on("deviceMode.change", this.handleDeviceModeChange);
  }

  componentDidUpdate() {
    this.updateBackground();
  }

  componentWillUnmount() {
    if (this.parallaxPluginInited) {
      this.destroyParallax();
    }

    if (this.videoPluginInited) {
      this.destroyVideoPlayer();
    }

    UIEvents.off("deviceMode.change", this.handleDeviceModeChange);
  }

  handleDeviceModeChange = mode => {
    if (this.parallaxPluginInited) {
      if (mode === "mobile" || mode === "tablet") {
        this.destroyParallax();
      }

      if (mode === "desktop") {
        this.initParallax();
      }
    }

    if (this.videoPluginInited) {
      if (mode === "mobile" || mode === "tablet") {
        this.destroyVideoPlayer();
      }

      if (mode === "desktop") {
        this.initVideoPlayer();
      }
    }
  };

  handleVideoRef = el => {
    this.video = el;
  };

  handleMediaRef = el => {
    this.media = el;
  };

  updateBackground = () => {
    const { imageSrc, video, parallax } = this.props;
    const hasImage = Boolean(imageSrc);
    const hasVideo = Boolean(video);
    const currentDeviceMode = getStore().getState().ui.deviceMode;

    if (hasImage && !hasVideo && parallax && currentDeviceMode === "desktop") {
      if (this.parallaxPluginInited) {
        this.updateParallax();
      } else {
        this.initParallax();
        this.parallaxPluginInited = true;
      }
    } else {
      if (this.parallaxPluginInited) {
        this.destroyParallax();
        this.parallaxPluginInited = false;
      }
    }

    if (hasVideo && currentDeviceMode === "desktop") {
      if (this.videoPluginInited) {
        this.updateVideoPlayer();
      } else {
        this.initVideoPlayer();
        this.videoPluginInited = true;
      }
    } else {
      if (this.videoPluginInited) {
        this.destroyVideoPlayer();
        this.videoPluginInited = false;
      }
    }
  };

  initParallax = () => {
    jQuery(this.media).parallax({
      bgClass: "brz-bg-image", // WARNING: intentionally not `brz-bg-image-parallax`
      wheelIgnoreClass: [
        "brz-ed-container-plus",
        "brz-ed-container-whiteout-show",
        "brz-content-show"
      ]
    });
  };

  updateParallax = () => {
    jQuery(this.media).parallax("refresh");
  };

  destroyParallax = () => {
    jQuery(this.media).parallax("destroy");
  };

  updateVideoPlayer = () => {
    const { video, bgVideoQuality } = this.props;
    jQuery(this.video).backgroundVideo("refresh", {
      type: video.type,
      quality: bgVideoQuality,
      mute: true
    });
  };

  initVideoPlayer = () => {
    const { video, bgVideoQuality } = this.props;

    jQuery(this.video).backgroundVideo({
      type: video.type,
      autoResize: false,
      autoplay: true,
      quality: bgVideoQuality,
      mute: true
    });
  };

  destroyVideoPlayer = () => {
    jQuery(this.video).backgroundVideo("destroy");
  };

  renderImage = () => {
    const {
      imageSrc,
      colorOpacity,
      parallax,
      video,
      tabletColorOpacity,
      tabletImageSrc,
      mobileColorOpacity,
      mobileImageSrc
    } = this.props;

    const bailRender = !(
      IS_EDITOR ||
      (colorOpacity !== 1 && imageSrc) ||
      (tabletColorOpacity !== 1 && tabletImageSrc) ||
      (mobileColorOpacity !== 1 && mobileImageSrc)
    );

    if (bailRender) {
      return null;
    }

    const hasVideo = Boolean(video);
    const className = classnames("brz-bg-image", {
      "brz-bg-image-parallax": parallax && !hasVideo
    });

    return <div className={className} />;
  };

  renderVideo = () => {
    const { video, bgVideoLoop, bgVideoQuality, colorOpacity } = this.props;
    const hasVideo = Boolean(video);
    const bailRender = IS_PREVIEW && !hasVideo && colorOpacity !== 1;

    if (bailRender) {
      return null;
    }

    const iframeStyle = hasVideo
      ? {
          display: "block"
        }
      : {
          display: "none"
        };

    const settings = {
      autoplay: true,
      background: true,
      controls: false,
      suggestedVideo: false,
      loop: bgVideoLoop,
      quality: bgVideoQuality
    };

    const src = hasVideo ? videoUrl(video, settings) : null;
    const dataType = hasVideo ? video.type : null;

    return (
      <div
        ref={this.handleVideoRef}
        className="brz-bg-video"
        data-type={dataType}
        data-mute="on"
        data-autoplay="on"
        data-quality={settings.quality}
      >
        <iframe
          src={src}
          className="brz-iframe brz-bg-video__cover"
          style={iframeStyle}
        />
      </div>
    );
  };

  renderMap = () => {
    const URL = "https://www.google.com/maps/embed/v1/place";
    const KEY = "AIzaSyCcywKcxXeMZiMwLDcLgyEnNglcLOyB_qw";
    const { mapAddress, mapZoom, colorOpacity } = this.props;
    const hasMapAddress = Boolean(mapAddress);
    const bailRender = IS_PREVIEW && !hasMapAddress && colorOpacity !== 1;

    if (bailRender) {
      return null;
    }

    const iframeStyle = hasMapAddress
      ? {
          display: "block"
        }
      : {
          display: "none"
        };

    const src = hasMapAddress
      ? `${URL}?key=${KEY}&q=${mapAddress}&zoom=${mapZoom}`
      : null;

    return (
      <div className="brz-bg-map">
        <iframe
          className="brz-iframe brz-bg-map__cover"
          src={src}
          style={iframeStyle}
        />
      </div>
    );
  };

  renderShape() {
    const { shapeTopType, shapeBottomType } = this.props;

    return (
      <React.Fragment>
        {shapeTopType && <div className="brz-bg-shape brz-bg-shape__top" />}
        {shapeBottomType && (
          <div className="brz-bg-shape brz-bg-shape__bottom" />
        )}
      </React.Fragment>
    );
  }

  render() {
    const {
      className: _className,
      video,
      style,
      children,
      parallax
    } = this.props;
    const className = classnames("brz-bg", _className);
    const hasVideo = Boolean(video);
    const hasParallax = Boolean(parallax);
    const needsResizeDetection = IS_EDITOR && (hasVideo || hasParallax);

    return (
      <div className={className} style={style}>
        <div ref={this.handleMediaRef} className="brz-bg-media">
          {this.renderImage()}
          {this.renderVideo()}
          {this.renderMap()}
          <div className="brz-bg-color" />
          {this.renderShape()}
        </div>
        <div className="brz-bg-content">{children}</div>
        {needsResizeDetection && (
          <ResizeAware onResize={this.updateBackground} />
        )}
      </div>
    );
  }
}

export default Background;
