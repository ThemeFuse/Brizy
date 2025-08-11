import { Audio as AudioComponent } from "@brizy/component/src/Flex/Audio";
import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import type { Patch } from "visual/component/BoxResizer/types";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as sidebarConfig from "visual/editorComponents/Audio/sidebar";
import { styleContent } from "visual/editorComponents/Audio/styles";
import * as titleSidebarConfig from "visual/editorComponents/Audio/titleSidebar";
import * as titleToolbarConfig from "visual/editorComponents/Audio/titleToolbar";
import * as toolbarConfig from "visual/editorComponents/Audio/toolbar";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { customFileUrl } from "visual/utils/customFile";
import { splitFile } from "visual/utils/customFile/customFileUrl";
import { t } from "visual/utils/i18n";
import { attachRefs } from "visual/utils/react";
import { BaseAudio } from "./Base";
import * as captionSidebarConfig from "./captionSidebar";
import * as captionToolbarConfig from "./captionToolbar";
import type { Value } from "./types";
import { getResizerRestrictions, resizerPoints } from "./utils";

class Audio extends BaseAudio {
  handleResizerChange = (patch: Patch) => this.patchValue(patch);

  renderAudio(v: Value, vs: Value, vd: Value) {
    const {
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
        caption={t("This is a sample caption of the audio content")}
      />
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
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
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              titleToolbarConfig,
              titleSidebarConfig,
              {
                allowExtend: false
              }
            )}
            selector=".brz-audio-title"
          >
            {({ ref: titleToolbarRef }) => (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  captionToolbarConfig,
                  captionSidebarConfig,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-audio-caption"
              >
                {({ ref: captionToolbarRef }) => (
                  <CustomCSS selectorName={this.getId()} css={v.customCSS}>
                    {({ ref: cssRef }) => (
                      <Wrapper
                        {...this.makeWrapperProps({
                          className: classNameContent,
                          ref: (el) => {
                            attachRefs(el, [
                              toolbarRef,
                              cssRef,
                              titleToolbarRef,
                              captionToolbarRef
                            ]);
                          }
                        })}
                      >
                        <BoxResizer
                          points={resizerPoints}
                          restrictions={getResizerRestrictions(v)}
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
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}

export default Audio;
