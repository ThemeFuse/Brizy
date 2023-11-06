import classnames from "classnames";
import React from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { getImageUrl } from "visual/utils/image";
import { getUrlQueryParam } from "visual/utils/url";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import defaultValue from "./defaultValue.json";
import { styleContent } from "./styles";
import * as toolbarConfig from "./toolbar";

class VideoPlaylistItem extends EditorComponent {
  static get componentId() {
    return "VideoPlaylistItem";
  }

  static defaultValue = defaultValue;

  handleTextChange = (title) => {
    this.patchValue({ title });
  };

  handleText2Change = (subTitle) => {
    this.patchValue({ subTitle });
  };

  getVideoSrc(v) {
    const { video, controls, start, end, branding, intro, loop } = v;
    const videoSrc = getVideoData(video);

    return videoSrc
      ? getVideoUrl(videoSrc, {
          controls: controls === "on" ? 1 : 0,
          branding: branding === "off" ? 1 : 0,
          intro: intro === "off" ? 0 : 1,
          loop: loop === "off" ? 0 : 1,
          suggestedVideo: false,
          start,
          end
        })
      : "";
  }

  getImageHref(v) {
    const { video } = v;
    const linkType = video && video.includes("youtube.com") ? "long" : "short";

    switch (linkType) {
      case "long":
        return getUrlQueryParam(video, "v");
      case "short":
        return video.split("/")[3];
      default:
        return "";
    }
  }

  renderForEdit(v, vs, vd) {
    const {
      video,
      title,
      subTitle,
      coverImageSrc,
      coverImageFileName,
      coverSizeType,
      customCSS
    } = v;
    const { onActiveItem, active } = this.props;
    const videoSrc = this.getVideoSrc(v);
    const coverUrl = getImageUrl({
      uid: coverImageSrc,
      fileName: coverImageFileName,
      sizeType: coverSizeType
    });

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

    const imgHref = this.getImageHref(v);
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
            {...makeDataAttr({ name: "link", value: videoSrc })}
            onClick={onActiveItem}
          >
            <div className="brz-video-playlist-video-elem">{content}</div>
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
