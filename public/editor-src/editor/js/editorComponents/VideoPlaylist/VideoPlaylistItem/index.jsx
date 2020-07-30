import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import { TextEditor } from "visual/component/Controls/TextEditor";
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
    const { video, controls, start, end, branding, intro } = v;
    const videoSrc = getVideoData(video);

    return videoSrc
      ? getVideoUrl(videoSrc, {
          controls: controls === "on" ? 1 : 0,
          branding: branding === "off" ? 1 : 0,
          intro: intro === "off" ? 0 : 1,
          suggestedVideo: false,
          start,
          end
        })
      : "";
  }

  renderForEdit(v, vs, vd) {
    const { video, title, subTitle, coverImageSrc, customCSS } = v;
    const { onActiveItem, active } = this.props;
    const videoSrc = this.getVideoSrc(v);
    const coverUrl = imageUrl(coverImageSrc);
    const classNameContent = classnames(
      "brz-video-playlist-video-item",
      { "brz-video-playlist-video-item__cover": v.coverImageSrc },
      { "brz-video-playlist-video-item--active": active },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );
    // eslint-disable-next-line no-unused-vars
    const [_, imgHref = ""] = video.split("=");
    const content = v.coverImageSrc ? (
      <img className="brz-img" src={coverUrl} alt="cover" />
    ) : video ? (
      <img
        className="brz-img"
        src={`https://img.youtube.com/vi/${imgHref}/hqdefault.jpg`}
        alt="cover"
      />
    ) : (
      <Placeholder icon="play" />
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <div
            className={classNameContent}
            data-link={videoSrc}
            onClick={onActiveItem}
          >
            <div className="brz-video-playlist-video-element">{content}</div>
            <div className="brz-video-playlist-title-video">
              <TextEditor value={title} onChange={this.handleTextChange} />
              <TextEditor value={subTitle} onChange={this.handleText2Change} />
            </div>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default VideoPlaylistItem;
