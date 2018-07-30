import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import BoxResizer from "visual/component-new/BoxResizer";
import Placeholder from "visual/component-new/Placeholder";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import Toolbar from "visual/component-new/Toolbar";
import ThemeIcon from "visual/component-new/ThemeIcon";
import * as toolbarConfig from "./toolbar";
import {
  styleClassName,
  styleCSSVars,
  wrapperStyleClassName,
  wrapperStyleCSSVars
} from "./styles";
import defaultValue from "./defaultValue.json";

const resizerPoints = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

class Video extends EditorComponent {
  static get componentId() {
    return "Video";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);
  handleCoverIconClick(e) {
    e.preventDefault();
  }

  renderCover(videoSrc) {
    return (
      <div className="brz-video__cover">
        <div className="brz-video__cover-icon">
          <a href={videoSrc} onClick={this.handleCoverIconClick}>
            <ThemeIcon name="play" type="editor" />
          </a>
        </div>
      </div>
    );
  }

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.bgColorPalette && `${_v.bgColorPalette}__bg`,
      _v.hoverBgColorPalette && `${_v.hoverBgColorPalette}__hoverBg`,
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`
    ]);

    const { video, controls, coverImageSrc } = v;
    const videoData = getVideoData(video);

    const videoSrc = videoData
      ? getVideoUrl(videoData, {
          autoplay: Boolean(coverImageSrc),
          controls: controls === "on",
          suggestedVideo: false
        })
      : "";

    let content = coverImageSrc ? (
      this.renderCover(videoSrc)
    ) : (
      <iframe className="brz-iframe" src={videoSrc} />
    );

    if (!videoSrc && !coverImageSrc) {
      content = (
        <Placeholder icon="nc-play" containerWidth={this.props.meta.desktopW} />
      );
    }

    const style = { ...styleCSSVars(v, this.props), ...wrapperStyleCSSVars(v) };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div className={styleClassName(v, this.props)} style={style}>
          <BoxResizer
            points={resizerPoints}
            meta={this.props.meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            <div className={wrapperStyleClassName(v)}>{content}</div>
          </BoxResizer>
        </div>
      </Toolbar>
    );
  }
}

export default Video;
