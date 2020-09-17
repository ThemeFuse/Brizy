import React, {
  Component,
  CSSProperties,
  ReactElement,
  RefObject
} from "react";
import classnames from "classnames";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ResizeAware from "react-resize-aware";
import UIEvents from "visual/global/UIEvents";

import Image from "./types/Image";
import Map from "./types/Map";
import Video from "./types/Video";
import Shape from "./types/Shape";

type Props = {
  image?: string;
  parallax?: boolean;
  video?: {
    type: string;
    key: string;
  };
  videoStart?: string;
  videoLoop?: boolean;
  map?: string;
  mapZoom?: string;
  opacity?: number;
  boxShadow?: string;
  border?: string;
  shapeTop?: string;
  shapeBottom?: string;
  style?: CSSProperties;
};

type NeedMedia = {
  [k: string]: unknown;
};

const needRenderMedia = (data: NeedMedia): boolean =>
  [
    "image",
    "video",
    "map",
    "shapeTop",
    "shapeBottom",
    "border",
    "boxShadow",
    "opacity"
  ].some((k: string) => data[k]);

class Background extends Component<Props> {
  isUnMounted = false;

  componentDidMount(): void {
    UIEvents.on("deviceMode.change", this.handleChange);
  }

  componentWillUnmount(): void {
    this.isUnMounted = true;
    UIEvents.off("deviceMode.change", this.handleChange);
  }

  handleChange = (): void => {
    // NOTE: although this callback is removed at willUnmount
    // there was still a problem with MegaMenu.
    // UIEvents.off does not work during the emit phase
    if (!this.isUnMounted) {
      this.forceUpdate();
    }
  };

  render(): ReactElement {
    const {
      video,
      videoLoop,
      videoStart,
      map,
      mapZoom,
      image,
      parallax,
      opacity,
      shapeTop,
      shapeBottom,
      children
    } = this.props;
    const needsResizeDetection = IS_EDITOR && (video || parallax);

    return (
      <>
        {needRenderMedia(this.props) && (
          <div className="brz-bg">
            {image && (
              <Image showParallax={parallax}>
                {({ innerRef, attr }): ReactElement => (
                  <div ref={innerRef as RefObject<HTMLDivElement>} {...attr} />
                )}
              </Image>
            )}
            {video && (
              <Video
                video={video}
                videoLoop={videoLoop}
                videoStart={videoStart}
              >
                {({ innerRef, attr, children }): ReactElement => (
                  <div
                    ref={innerRef as RefObject<HTMLDivElement>}
                    {...attr}
                    className={classnames("brz-bg-video", attr.className)}
                  >
                    {children}
                  </div>
                )}
              </Video>
            )}
            {map && (
              <div className="brz-bg-map">
                {map && <Map map={map} mapZoom={mapZoom} />}
              </div>
            )}
            {opacity && <div className="brz-bg-color" />}
            {(shapeTop || shapeBottom) && (
              <Shape shapeTop={shapeTop} shapeBottom={shapeBottom} />
            )}
          </div>
        )}
        {needsResizeDetection && <ResizeAware onResize={this.handleChange} />}

        {children}
      </>
    );
  }
}

export default Background;
