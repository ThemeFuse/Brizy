import classnames from "classnames";
import React from "react";
import {
  CustomVideoEdit,
  ExternalVideoEdit,
  PlaylistPreview,
  Sidebar
} from "visual/component/Controls/VideoPlaylist";
import { isCustomVideo } from "visual/component/Controls/VideoPlaylist/utils";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getImageUrl } from "visual/utils/image";
import { getUrlQueryParam } from "visual/utils/url";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import defaultValue from "./defaultValue.json";
import { styleContent } from "./styles";
import * as toolbarConfig from "./toolbar";
import { getVideoAttributes } from "./utils";

class VideoPlaylistItem extends EditorComponent {
  static get componentId() {
    return "VideoPlaylistItem";
  }

  static defaultValue = defaultValue;

  handleTitleChange = (title) => {
    this.patchValue({ title });
  };

  handleSubtitleChange = (subTitle) => {
    this.patchValue({ subTitle });
  };

  getVideoSrc(v) {
    const { video, controls, start, end, branding, intro, loop, type } = v;

    if (isCustomVideo(type)) {
      return video;
    }

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

  handleCoverIconClick(e) {
    e.preventDefault();
  }

  renderSidebar(v, vs, vd) {
    const {
      video,
      title,
      subTitle,
      coverImageSrc,
      coverImageFileName,
      coverSizeType,
      controls,
      customCSS,
      start,
      end,
      loop,
      type
    } = v;

    const { onClick, active } = this.props;
    const config = this.getGlobalConfig();
    const videoSrc = this.getVideoSrc(v);
    const coverUrl = getImageUrl(
      {
        uid: coverImageSrc,
        fileName: coverImageFileName,
        sizeType: coverSizeType
      },
      config
    );

    const classNameContent = classnames(
      "brz-video-playlist-video-item",
      { "brz-video-playlist-video-item__cover": v.coverImageSrc },
      { "brz-video-playlist-video-item--active": active },
      this.css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        styleContent({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    const imgHref = this.getImageHref(v);
    const attributes = getVideoAttributes({
      videoSrc,
      start,
      end,
      loop,
      controls
    });

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Sidebar
            videoSrc={video}
            imgHref={imgHref}
            className={classNameContent}
            coverUrl={coverUrl}
            onClick={onClick}
            coverImageSrc={coverImageSrc}
            title={title}
            subTitle={subTitle}
            handleTitleChange={this.handleTitleChange}
            handleSubtitleChange={this.handleSubtitleChange}
            attributes={attributes}
            type={type}
          />
        </CustomCSS>
      </Toolbar>
    );
  }

  renderVideoEdit(v) {
    const { type, coverImageSrc, start, end, controls, loop } = v;
    const videoSrc = this.getVideoSrc(v);
    const attributes = getVideoAttributes({
      videoSrc,
      start,
      end,
      loop,
      controls
    });

    if (isCustomVideo(type)) {
      return (
        <CustomVideoEdit
          coverImageSrc={coverImageSrc}
          start={start}
          end={end}
          controls={controls}
          loop={loop}
          videoSrc={videoSrc}
          type={type}
          attributes={attributes}
          hasPauseIcon={false}
          hasUnmuteIcon={false}
          handleCoverIconClick={this.handleCoverIconClick}
        />
      );
    }

    return (
      <ExternalVideoEdit
        coverImageSrc={coverImageSrc}
        videoSrc={videoSrc}
        attributes={attributes}
        handleCoverIconClick={this.handleCoverIconClick}
      />
    );
  }

  renderVideoPreview(v) {
    const { type, coverImageSrc, start, end, controls, loop } = v;
    const videoSrc = this.getVideoSrc(v);
    const attributes = getVideoAttributes({
      videoSrc,
      start,
      end,
      loop,
      controls
    });

    return (
      <PlaylistPreview
        coverImageSrc={coverImageSrc}
        start={start}
        end={end}
        controls={controls}
        loop={loop}
        videoSrc={videoSrc}
        type={type}
        attributes={attributes}
        hasPauseIcon
        hasUnmuteIcon
        handleCoverIconClick={this.handleCoverIconClick}
      />
    );
  }

  renderForEdit(v, vs, vd) {
    const { renderType } = this.props;

    return renderType === "video"
      ? this.renderVideoEdit(v)
      : this.renderSidebar(v, vs, vd);
  }

  renderForView(v, vs, vd) {
    const { renderType } = this.props;

    return renderType === "video"
      ? this.renderVideoPreview(v)
      : this.renderSidebar(v, vs, vd);
  }
}

export default VideoPlaylistItem;
