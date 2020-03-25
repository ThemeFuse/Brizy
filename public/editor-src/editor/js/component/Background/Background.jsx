import React, { Component } from "react";
import classnames from "classnames";
import ResizeAware from "react-resize-aware";
import UIEvents from "visual/global/UIEvents";

import Video from "./types/Video";
import Image from "./types/Image";
import Map from "./types/Map";
import Color from "./types/Color";
import Shape from "./types/Shape";

const needRenderMedia = data =>
  [
    "image",
    "video",
    "map",
    "shapeTop",
    "shapeBottom",
    "border",
    "boxShadow",
    "opacity"
  ].some(k => data[k]);

class Background extends Component {
  static defaultProps = {
    className: "",
    image: false,
    opacity: false,
    border: false,
    boxShadow: false,
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

  componentDidMount() {
    UIEvents.on("deviceMode.change", this.handleChange);
  }

  componentWillUnmount() {
    UIEvents.off("deviceMode.change", this.handleChange);
  }

  handleChange = () => this.forceUpdate();

  render() {
    const {
      video,
      bgVideoLoop,
      bgVideoStart,
      image,
      parallax,
      map,
      mapZoom,
      opacity,
      shapeTop,
      shapeBottom,
      style,
      className: _className,
      children
    } = this.props;
    const className = classnames("brz-bg", _className);
    const needsResizeDetection = IS_EDITOR && (video || parallax);

    return (
      <div className={className} style={style}>
        {needRenderMedia(this.props) && (
          <div className="brz-bg-media">
            {image && <Image showParallax={parallax} />}
            {video && (
              <Video
                video={video}
                bgVideoLoop={bgVideoLoop}
                bgVideoStart={bgVideoStart}
              />
            )}
            {map && <Map map={map} mapZoom={mapZoom} />}
            {opacity && <Color />}
            {(shapeTop || shapeBottom) && (
              <Shape shapeTop={shapeTop} shapeBottom={shapeBottom} />
            )}
          </div>
        )}
        <div className="brz-bg-content">{children}</div>
        {needsResizeDetection && <ResizeAware onResize={this.handleChange} />}
      </div>
    );
  }
}

export default Background;
