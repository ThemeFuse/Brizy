import { SoundCloud } from "@brizy/component/src/Flex/SoundCloud";
import classnames from "classnames";
import React from "react";
import Placeholder from "visual/component/Placeholder";
import {
  styleControls,
  styleIcon,
  styleWrapperAudio
} from "visual/editorComponents/Audio/styles";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { currentStyleSelector } from "visual/redux/selectors";
import EditorComponent from "../EditorComponent";
import defaultValue from "./defaultValue.json";
import type { Value } from "./types";

export class BaseAudio extends EditorComponent<Value> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId() {
    return ElementTypes.Audio;
  }

  getAudioClassNames(v: Value, vs: Value, vd: Value) {
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
    return { classNameIcon, classNameAudio, classNameControls };
  }

  getColor(v: Value) {
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

  renderSoundCloud(v: Value) {
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
}
