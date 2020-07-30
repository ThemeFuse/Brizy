import React, { Component } from "react";
import { noop } from "underscore";
import { assetUrl } from "visual/utils/asset";
import { detectOS } from "visual/utils/dom/detectOS";
import Fixed from "visual/component/Prompts/Fixed";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

export default class PromptKeyHelper extends Component {
  static defaultProps = {
    opened: false,
    onClose: noop
  };

  render() {
    const { opened, onClose } = this.props;
    const os = detectOS();
    const isMac = os === "MacOS";
    const src = isMac
      ? `${assetUrl("editor/img/mac-keyboard1x.png")} 1x , ${assetUrl(
          "editor/img/mac-keyboard2x.png"
        )} 2x`
      : `${assetUrl("editor/img/pc-keyboard1x.png")} 1x , ${assetUrl(
          "editor/img/pc-keyboard2x.png"
        )} 2x`;

    return (
      <Fixed
        id="key-helper"
        className="brz-ed-hotkeys-overlay"
        opened={opened}
        onClose={onClose}
      >
        <div className="brz-ed-hotkeys-wrapper">
          <EditorIcon
            icon="nc-close-popup"
            className="brz-ed-hotkeys-btn-close"
            onClick={onClose}
          />
          <div className="brz-ed-hotkeys-label">{t("Keyboard Shortcuts")}</div>
          <div className="brz-ed-hotkeys-image-container">
            <picture>
              <img className="brz-ed-hotkeys-image" srcSet={src} />
            </picture>
          </div>
          <div className="brz-ed-hotkeys-combination-container">
            <div className="brz-ed-hotkeys-combination-container-column">
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + C" : "Ctrl + C"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Copy")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + V" : "Ctrl + V"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Paste")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + shift + V" : "Ctrl + Shift + V"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Paste Style")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + D" : "Ctrl + D"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Duplicate")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + delete" : "Delete"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Delete")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd +" : "Ctrl +"}
                  <EditorIcon
                    className="brz-ed-hotkeys-icons"
                    icon="nc-arrow"
                  />
                  <span className="divider"> / </span>
                  <EditorIcon
                    className="brz-ed-hotkeys-icons brz-ed-deg180"
                    icon="nc-arrow"
                  />
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Horizontal Align")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd +" : "Ctrl +"}
                  <EditorIcon
                    className="brz-ed-hotkeys-icons brz-ed-deg90"
                    icon="nc-arrow"
                  />
                  <span className="divider"> / </span>
                  <EditorIcon
                    className="brz-ed-hotkeys-icons brz-ed-deg270"
                    icon="nc-arrow"
                  />
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Vertical Align")}
                </span>
              </div>
            </div>
            <div className="brz-ed-hotkeys-combination-container-column">
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + Z" : "Ctrl + Z"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Undo")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + shift + Z" : "Ctrl + Shift + Z"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Redo")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + S" : "Ctrl + S"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Save Draft / Update Page")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd +" : "Ctrl +"}
                  <EditorIcon
                    className="brz-ed-hotkeys-icons"
                    icon="nc-plus2"
                  />
                  <span className="divider"> / </span>
                  <EditorIcon
                    className="brz-ed-hotkeys-icons"
                    icon="nc-minus"
                  />
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Responsive Zoom In / Out")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd +" : "Ctrl +"}
                  <EditorIcon
                    className="brz-ed-hotkeys-icons"
                    icon="nc-alert-circle-que"
                  />
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Shortcuts")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "cmd + shift + A" : "Ctrl + Shift + A"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Add New Block / Layout")}
                </span>
              </div>
              <div className="brz-ed-hotkeys-combination-container-column-list">
                <span className="brz-ed-hotkeys-combination-container-column-label">
                  {isMac ? "esc" : "Esc"}
                </span>
                <span className="brz-ed-hotkeys-combination-container-column-label-2">
                  {t("Select Parent Element")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Fixed>
    );
  }
}
