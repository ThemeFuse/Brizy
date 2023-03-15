import classnames from "classnames";
import React, {
  Component,
  CSSProperties,
  ReactElement,
  RefObject
} from "react";
import ResizeAware from "react-resize-aware";
import UIEvents from "visual/global/UIEvents";
import Image from "./types/Image";
import Map from "./types/Map";
import Shape from "./types/Shape";
import Video from "./types/Video";

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
          <div className="brz-bg overflow-hidden absolute top-0 left-0 w-full h-full">
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
                    className={classnames(
                      "brz-bg-video absolute top-0 left-0 w-full h-full",
                      attr.className
                    )}
                  >
                    {children}
                  </div>
                )}
              </Video>
            )}
            {map && (
              <div className="brz-bg-map absolute top-0 left-0 w-full h-full">
                {map && <Map map={map} mapZoom={mapZoom} />}
              </div>
            )}
            {opacity && (
              <div className="brz-bg-color absolute top-0 left-0 w-full h-full" />
            )}
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
