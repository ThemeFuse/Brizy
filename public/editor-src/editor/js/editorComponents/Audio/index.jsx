import { Audio as AudioComponent, SoundCloud } from "@brizy/component";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { isEditor, isView } from "visual/providers/RenderProvider";
import { currentStyleSelector } from "visual/redux/selectors-new";
import { customFileUrl } from "visual/utils/customFile";
import { attachRefs } from "visual/utils/react";
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
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId() {
    return "Audio";
  }

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

  getColor(v) {
    const { controlsHex, controlsPalette } = v;
    let color = controlsHex;

    if (controlsPalette) {
      const state = this.getReduxState();
      const palette = currentStyleSelector(state).colorPalette;
      const selectedPalette = palette.find(
        (color) => color.id === controlsPalette
      );
      if (selectedPalette) {
        color = selectedPalette.hex;
      }
    }

    return color.split("#")[1];
  }

  renderSoundCloud(v) {
    const {
      url,
      autoPlay,
      likeButton,
      buyButton,
      downloadButton,
      shareButton,
      comments,
      playCounts,
      username,
      artWork,
      style
    } = v;

    const controlsColor = this.getColor(v);

    return url ? (
      <SoundCloud
        src={url}
        isAutoPlay={autoPlay === "on"}
        isVisual={style !== "basic"}
        showLikeButton={likeButton === "on"}
        showBuyButton={buyButton === "on"}
        showDownloadButton={downloadButton === "on"}
        showShareButton={shareButton === "on"}
        showComments={comments === "on"}
        showPlayCounts={playCounts === "on"}
        showUsername={username === "on"}
        showArtwork={artWork === "on"}
        controlsColor={controlsColor}
        className={isEditor(this.props.renderContext) ? "brz-blocked" : ""}
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
      this.css(
        `${this.getComponentId()}-bg2`,
        `${this.getId()}-bg2`,
        styleWrapperAudio({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const classNameControls = classnames(
      "brz-audio-controls",
      this.css(
        `${this.getComponentId()}-controls`,
        `${this.getId()}-controls`,
        styleControls({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const classNameIcon = this.css(
      `${this.getComponentId()}-icon`,
      `${this.getId()}-icon`,
      styleIcon({
        v,
        vs,
        vd,
        store: this.getReduxStore(),
        contexts: this.getContexts()
      })
    );
    const config = this.getGlobalConfig();
    const audioSource = customFileUrl(audio, config) ?? "";

    return isView(this.props.renderContext) ? (
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
      this.css(
        this.getComponentId(),
        this.getId(),
        styleContent({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
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
      this.css(
        this.getComponentId(),
        this.getId(),
        styleContent({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className: classNameContent,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
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
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default Audio;
