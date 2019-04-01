import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import Toolbar from "visual/component/Toolbar";
import ThemeIcon from "visual/component/ThemeIcon";
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

  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToolbarClose = () => {
    if (!this.mounted) {
      return;
    }

    this.patchValue({
      tabsState: "tabNormal",
      tabsCurrentElement: "tabCurrentElement",
      tabsColor: "tabOverlay"
    });
  };

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
      _v.borderColorPalette && `${_v.borderColorPalette}__border`,
      _v.hoverBgColorPalette && `${_v.hoverBgColorPalette}__hoverBg`,
      _v.hoverBorderColorPalette &&
        `${_v.hoverBorderColorPalette}__hoverBorder`,
      _v.boxShadowColorPalette && `${_v.boxShadowColorPalette}__boxShadow`,

      _v.tabletBorderColorPalette &&
        `${_v.tabletBorderColorPalette}__tabletBorder`,

      _v.mobileBorderColorPalette &&
        `${_v.mobileBorderColorPalette}__mobileBorder`
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
      <iframe allowFullScreen={true} className="brz-iframe" src={videoSrc} />
    );

    if (!videoSrc && !coverImageSrc) {
      content = <Placeholder icon="play" />;
    }

    const style = { ...styleCSSVars(v, this.props), ...wrapperStyleCSSVars(v) };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig)}
        onClose={this.handleToolbarClose}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={styleClassName(v, this.props)} style={style}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              <div className="brz-video-content">
                <div className={wrapperStyleClassName(v)}>{content}</div>
              </div>
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Video;
