import { Audio as AudioComponent } from "@brizy/component/src/Flex/Audio";
import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import { styleContent } from "visual/editorComponents/Audio/styles";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { customFileUrl } from "visual/utils/customFile";
import { splitFile } from "visual/utils/customFile/customFileUrl";
import { BaseAudio } from "./Base";
import type { Value } from "./types";

class Audio extends BaseAudio {
  renderAudio(v: Value, vs: Value, vd: Value) {
    const {
      loop,
      audio,
      showCurrentTime,
      showDurationTime,
      showProgressBarTrack,
      showProgressBarVolume,
      showTitle,
      caption
    } = v;

    const { classNameIcon, classNameAudio, classNameControls } =
      this.getAudioClassNames(v, vs, vd);
    const config = this.getGlobalConfig();
    const audioSource = customFileUrl(audio, config) ?? "";
    const captionSource = customFileUrl(caption, config) ?? "";
    const [, audioTitle] = splitFile(audio);

    return (
      <AudioComponent
        src={audioSource}
        isLoop={loop === "on"}
        showCurrentTime={showCurrentTime === "on"}
        showDurationTime={showDurationTime === "on"}
        showProgressBarTrack={showProgressBarTrack === "on"}
        showProgressBarVolume={showProgressBarVolume === "on"}
        showTitle={showTitle === "on"}
        classNameAudio={classNameAudio}
        classNameControls={classNameControls}
        classNameIcon={classNameIcon}
        title={audioTitle}
        captionSrc={captionSource}
      />
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
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
}

export default Audio;
