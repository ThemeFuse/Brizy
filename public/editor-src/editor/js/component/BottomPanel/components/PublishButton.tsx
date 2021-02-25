import React, { Component, ReactElement } from "react";
import classnames from "classnames";
import { connect, ConnectedProps } from "react-redux";
import Config from "visual/global/Config";
import Tooltip, { TooltipItem } from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import HotKeys from "visual/component/HotKeys";
import { Roles } from "visual/component/Roles";
import { ToastNotification } from "visual/component/Notifications";
import { removeBlocks } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { updatePageStatus, fetchPageSuccess } from "visual/redux/actions2";
import { SavedLayout } from "visual/types";
import { t } from "visual/utils/i18n";
import {
  pageSelector,
  pageDataNoRefsSelector,
  extraFontStylesSelector
} from "visual/redux/selectors";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { createBlockScreenshot, createSavedLayout } from "visual/utils/api";
import { uuid } from "visual/utils/uuid";
import { IS_STORY } from "visual/utils/models";

const { isGlobalPopup: IS_GLOBAL_POPUP } = Config.get("wp") || {};

type Page = ReduxState["page"];

const mapState = (
  state: ReduxState
): {
  pageStatus: Page["status"];
  pageData: Page["data"];
  extraFontStyles: ReduxState["extraFontStyles"];
} => ({
  pageStatus: pageSelector(state).status,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageData: pageDataNoRefsSelector(state) as any,
  extraFontStyles: extraFontStylesSelector(state)
});
const mapDispatch = { updatePageStatus, removeBlocks, fetchPageSuccess };
const PublishConnector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof PublishConnector>;
type State = {
  updateLoading: boolean;
  layoutLoading: boolean;
  draftLoading: boolean;
  [key: string]: boolean;
};

class PublishButton extends Component<Props, State> {
  state = {
    updateLoading: false,
    layoutLoading: false,
    draftLoading: false
  };

  handlePublish(loading: "updateLoading" | "draftLoading"): void {
    if (this.state[loading]) {
      return;
    }

    this.setState({ [loading]: true }, () => {
      this.props
        .updatePageStatus("publish")
        .then(() => {
          this.props.fetchPageSuccess();
          this.setState({ [loading]: false });
        })
        .catch(e => {
          if (process.env.NODE_ENV === "development") {
            console.error("could not publish or save page", e);
          }
          ToastNotification.error(t("Could not publish or save page"));
          this.setState({ [loading]: false });
        });
    });
  }

  handleDraft(loading: "updateLoading" | "draftLoading"): void {
    if (this.state[loading]) {
      return;
    }

    this.setState({ [loading]: true }, () => {
      this.props
        .updatePageStatus("draft")
        .then(() => {
          this.props.fetchPageSuccess();
          this.setState({ [loading]: false });
        })
        .catch(e => {
          if (process.env.NODE_ENV === "development") {
            console.error("could not switch to draft", e);
          }
          ToastNotification.error(t("Could not switch to draft"));
          this.setState({ [loading]: false });
        });
    });
  }

  handleSavePage = async (): Promise<void> => {
    const { pageData, extraFontStyles } = this.props;

    if (this.state.layoutLoading || pageData.items.length === 0) {
      return;
    }

    this.setState({ layoutLoading: true });

    const meta: SavedLayout["meta"] = {
      extraFontStyles,
      type: "normal"
    };
    const screenshotsSupported: boolean = await browserSupports();

    if (screenshotsSupported) {
      const node = document.querySelector("#brz-ed-page__blocks");
      const { src, width, height } = await makeNodeScreenshot(node).catch(e => {
        ToastNotification.error(t("Could not save layout"));
        console.error(e);

        return {
          src: undefined,
          width: undefined,
          height: undefined
        };
      });

      if (!src || typeof width !== "number" || typeof height !== "number") {
        ToastNotification.error(t("Could not save layout"));
        return;
      }

      const { id } = await createBlockScreenshot({
        base64: src,
        blockType: "layout"
      }).catch(e => {
        ToastNotification.error(t("Could not save layout"));
        console.error(e);
        return { id: undefined };
      });

      if (!id) {
        ToastNotification.error(t("Could not save layout"));
        return;
      }

      meta._thumbnailSrc = id;
      meta._thumbnailWidth = width;
      meta._thumbnailHeight = height;
      meta._thumbnailTime = Date.now();
    }

    await createSavedLayout({
      meta,
      data: pageData,
      dataVersion: 1,
      uid: uuid()
    }).catch(e => {
      ToastNotification.error(t("Could not save layout"));
      console.error(e);
    });

    this.setState({ layoutLoading: false });
  };

  handleClearPage = (): void => {
    this.props.removeBlocks();
  };

  renderPopover(): ReactElement {
    const { pageStatus } = this.props;
    const overlay: ReactElement = (
      <>
        {!IS_STORY ? (
          <>
            <Roles allow={["admin"]}>
              <TooltipItem
                className="brz-ed-fixed-bottom-panel-popover__item"
                onClick={this.handleClearPage}
              >
                <EditorIcon icon="nc-trash" />
                <span className="brz-span">{t("Clear Layout")}</span>
              </TooltipItem>
            </Roles>
            <TooltipItem
              className="brz-ed-fixed-bottom-panel-popover__item"
              onClick={this.handleSavePage}
            >
              {this.state.layoutLoading ? (
                <EditorIcon
                  icon="nc-circle-02"
                  className="brz-ed-animated--spin"
                />
              ) : (
                <EditorIcon icon="nc-save-section" />
              )}
              <span className="brz-span">{t("Save Layout")}</span>
            </TooltipItem>
          </>
        ) : null}
        {pageStatus === "publish" ? (
          <TooltipItem
            className="brz-ed-fixed-bottom-panel-popover__item"
            onClick={(): void => {
              this.handleDraft("draftLoading");
            }}
          >
            {this.state.draftLoading ? (
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            ) : (
              <EditorIcon icon="nc-switch" />
            )}
            <span className="brz-span">{t("Switch to Draft")}</span>
          </TooltipItem>
        ) : (
          <TooltipItem
            className="brz-ed-fixed-bottom-panel-popover__item"
            onClick={(): void => {
              this.handlePublish("draftLoading");
            }}
          >
            {this.state.draftLoading ? (
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            ) : (
              <EditorIcon icon="nc-publish" />
            )}
            <span className="brz-span">{t("Publish Page")}</span>
          </TooltipItem>
        )}
      </>
    );

    return (
      <Tooltip
        overlayClassName="brz-ed-tooltip__overlay-publish-button"
        placement="top-right"
        offset={20}
        overlay={overlay}
        inPortal={true}
      >
        <button className="brz-button">
          <EditorIcon icon="nc-arrow-up" />
        </button>
      </Tooltip>
    );
  }

  renderPublish(): ReactElement {
    const { pageStatus } = this.props;
    const { updateLoading } = this.state;
    const label = pageStatus === "publish" ? t("Update") : t("Save Draft");
    const loadingClassName = classnames("brz-ed-animated--spin", {
      "brz-d-none": !updateLoading
    });
    const labelClassName = classnames("brz-span", {
      "brz-invisible": updateLoading
    });

    if (IS_GLOBAL_POPUP) {
      return (
        <div
          className="brz-ed-fixed-bottom-panel__btn brz-ed-fixed-bottom-panel__btn-loading"
          onClick={(): void => {
            pageStatus === "publish"
              ? this.handlePublish("updateLoading")
              : this.handleDraft("updateLoading");
          }}
        >
          <EditorIcon icon="nc-circle-02" className={loadingClassName} />
          <span className={labelClassName}>{label}</span>
        </div>
      );
    }

    return (
      <div className="brz-ed-fixed-bottom-panel__btn brz-ed-fixed-bottom-panel__btn-popover">
        <div
          className="brz-ed-fixed-bottom-panel__btn-loading brz-d-xs-flex brz-align-items-xs-center brz-text-lg-center"
          onClick={(): void => {
            pageStatus === "publish"
              ? this.handlePublish("updateLoading")
              : this.handleDraft("updateLoading");
          }}
        >
          <EditorIcon icon="nc-circle-02" className={loadingClassName} />
          <span className={labelClassName}>{label}</span>
        </div>
        {this.renderPopover()}
      </div>
    );
  }

  render(): ReactElement {
    return (
      <>
        <li className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__item-btn">
          {this.renderPublish()}
        </li>
        <HotKeys
          id="key-helper-update-page"
          keyNames={["ctrl+S", "cmd+S", "right_cmd+S"]}
          onKeyDown={(e: MouseEvent): void => {
            e.preventDefault();

            this.props.pageStatus === "publish"
              ? this.handlePublish("updateLoading")
              : this.handleDraft("updateLoading");
          }}
        />
      </>
    );
  }
}

export default PublishConnector(PublishButton);
