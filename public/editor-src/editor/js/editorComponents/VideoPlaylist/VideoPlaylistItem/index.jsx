import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import TextEditor from "visual/editorComponents/Text/Editor";
import Placeholder from "visual/component/Placeholder";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import * as toolbarConfig from "./toolbar";
import { styleContent } from "./styles";
import { css } from "visual/utils/cssStyle";
import { imageUrl } from "visual/utils/image";
import defaultValue from "./defaultValue.json";

class VideoPlaylistItem extends EditorComponent {
  static get componentId() {
    return "VideoPlaylistItem";
  }

  static defaultValue = defaultValue;

  handleTextChange = title => {
    this.patchValue({ title });
  };

  handleText2Change = subTitle => {
    this.patchValue({ subTitle });
  };

  getVideoSrc(v) {
    const { videoPopulation, video, controls, start, end } = v;

    if (videoPopulation) {
      return videoPopulation;
    }

    const videoSrc = getVideoData(video);

    let branding = v.branding;
    if (v.branding === "off") {
      branding = 1;
    } else if (v.branding === "on") {
      branding = 0;
    }

    let intro = v.intro;
    if (v.intro === "off") {
      intro = 0;
    } else if (v.intro === "on") {
      intro = 1;
    }

    return videoSrc
      ? getVideoUrl(videoSrc, {
          autoplay: 1,
          controls: controls === "on" ? 1 : 0,
          branding,
          intro,
          suggestedVideo: false,
          start,
          end
        })
      : "";
  }

  renderForEdit(v, vs, vd) {
    const { video, title, subTitle, coverImageSrc } = v;

    const videoSrc = this.getVideoSrc(v);
    const coverUrl = imageUrl(coverImageSrc);

    const classNameContent = classnames(
      "video-item",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );

    var imgHref = video.split("=")[1];

    let content = v.coverImageSrc ? (
      <div className="ovarlay-video-container">
        <img src={coverUrl} />
      </div>
    ) : video ? (
      <div className="ovarlay-video-container">
        <img src={`https://img.youtube.com/vi/${imgHref}/hqdefault.jpg`} />
      </div>
    ) : (
      <div className="ovarlay-video-container">
        <Placeholder icon="play" />
      </div>
    );

    if (!video) {
      <div className="ovarlay-video-container">
        <Placeholder icon="play" />
      </div>;
    }

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={classNameContent} data-link={videoSrc}>
            <div className="v-cont">
              <div className="video-element">{content}</div>
              <div className="title-video">
                <TextEditor value={title} onChange={this.handleTextChange} />
                <TextEditor
                  value={subTitle}
                  onChange={this.handleText2Change}
                />
              </div>
            </div>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default VideoPlaylistItem;
