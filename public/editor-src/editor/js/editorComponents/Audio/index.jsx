import { Audio as AudioComponent } from "@brizy/component";
import { SoundCloud } from "@brizy/component";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { customFileUrl } from "visual/utils/customFile";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import {
  styleContent,
  styleControls,
  styleIcon,
  styleWrapperAudio
} from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

class Audio extends EditorComponent {
  static get componentId() {
    return "Audio";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleResizerChange = (patch) => this.patchValue(patch);

  getResizerRestrictions(v) {
    return {
      height: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        }
      },
      width: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      tabletHeight: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        }
      },
      tabletWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      mobileHeight: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        }
      },
      mobileWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      }
    };
  }

  renderSoundCloud(v) {
    const {
      url,
      autoPlay,
      showArtwork,
      likeButton,
      buyButton,
      downloadButton,
      shareButton,
      comments,
      playCounts,
      username,
      artWork,
      controlsHex,
      controlsPalette
    } = v;

    const { hex: controlsColorHex } = getOptionColorHexByPalette(
      controlsHex,
      controlsPalette
    );
    const controlsColor = controlsColorHex.split("#")[1];

    return url ? (
      <SoundCloud
        src={url}
        isAutoPlay={autoPlay === "on"}
        isVisual={showArtwork === "on"}
        showLikeButton={likeButton === "on"}
        showBuyButton={buyButton === "on"}
        showDownloadButton={downloadButton === "on"}
        showShareButton={shareButton === "on"}
        showComments={comments === "on"}
        showPlayCounts={playCounts === "on"}
        showUsername={username === "on"}
        showArtwork={artWork === "on"}
        controlsColor={controlsColor}
        className={IS_EDITOR ? "brz-blocked" : ""}
      />
    ) : (
      <Placeholder icon="sound-cloud" />
    );
  }

  renderAudio(v, vs, vd) {
    const {
      loop,
      audio,
      showCurrentTime,
      showDurationTime,
      showProgressBarTrack,
      showProgressBarVolume
    } = v;

    const classNameAudio = classnames(
      "brz-custom-audio",
      css(
        `${this.constructor.componentId}-bg2`,
        `${this.getId()}-bg2`,
        styleWrapperAudio(v, vs, vd)
      )
    );
    const classNameControls = classnames(
      "brz-audio-controls",
      css(
        `${this.constructor.componentId}-controls`,
        `${this.getId()}-controls`,
        styleControls(v, vs, vd)
      )
    );
    const classNameIcon = css(
      `${this.constructor.componentId}-icon`,
      `${this.getId()}-icon`,
      styleIcon(v, vs, vd)
    );

    const audioSource = customFileUrl(audio) ?? "";

    return IS_PREVIEW ? (
      <AudioComponent
        src={audioSource}
        isLoop={loop === "on"}
        showCurrentTime={showCurrentTime === "on"}
        showDurationTime={showDurationTime === "on"}
        showProgressBarTrack={showProgressBarTrack === "on"}
        showProgressBarVolume={showProgressBarVolume === "on"}
        classNameAudio={classNameAudio}
        classNameControls={classNameControls}
        classNameIcon={classNameIcon}
      />
    ) : (
      <AudioComponent
        src={audioSource}
        showCurrentTime={showCurrentTime === "on"}
        showDurationTime={showDurationTime === "on"}
        showProgressBarTrack={showProgressBarTrack === "on"}
        showProgressBarVolume={showProgressBarVolume === "on"}
        classNameAudio={classNameAudio}
        classNameControls={classNameControls}
        classNameIcon={classNameIcon}
      />
    );
  }

  renderForView(v, vs, vd) {
    const { type } = v;

    const classNameContent = classnames(
      { "brz-audio": type === "custom" },
      { "brz-soundcloud": type === "soundcloud" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className: classNameContent
          })}
        >
          {type === "custom"
            ? this.renderAudio(v, vs, vd)
            : this.renderSoundCloud(v)}
        </Wrapper>
      </CustomCSS>
    );
  }

  renderForEdit(v, vs, vd) {
    const { type } = v;

    const classNameContent = classnames(
      { "brz-audio": type === "custom" },
      { "brz-soundcloud": type === "soundcloud" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContent(v, vs, vd)
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className: classNameContent
            })}
          >
            <BoxResizer
              points={resizerPoints}
              restrictions={this.getResizerRestrictions(v)}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {type === "custom"
                ? this.renderAudio(v, vs, vd)
                : this.renderSoundCloud(v)}
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Audio;
