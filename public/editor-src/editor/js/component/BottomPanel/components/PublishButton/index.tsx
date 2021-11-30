import React, { Component, ReactElement } from "react";
import { connect, ConnectedProps } from "react-redux";
import HotKeys from "visual/component/HotKeys";
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
import { IS_STORY, IS_GLOBAL_POPUP } from "visual/utils/models";
import { isNumber } from "visual/utils/math";
import { BottomPanelItem } from "../Item";
import { Controls, Props as ControlsProps } from "./Control";
import { getTooltipPageIcon, getTooltipPageTitle } from "./utils";

type Page = ReduxState["page"];

const mapState = (
  state: ReduxState
): {
  pageStatus: Page["status"];
  pageData: Page["data"];
  extraFontStyles: ReduxState["extraFontStyles"];
} => ({
  pageStatus: pageSelector(state).status,
  pageData: pageDataNoRefsSelector(state),
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

  handleClick = (): void => {
    const { pageStatus } = this.props;

    switch (pageStatus) {
      case "publish": {
        this.handlePublish("updateLoading");
        break;
      }
      case "draft": {
        this.handleDraft("updateLoading");
        break;
      }
    }
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
    let screenshotsSupported: boolean;

    try {
      screenshotsSupported = await browserSupports();
    } catch (e) {
      screenshotsSupported = false;
    }

    if (screenshotsSupported) {
      const node = document.querySelector("#brz-ed-page__blocks");
      const { src, width, height } = await makeNodeScreenshot(node).catch(
        () => ({
          src: undefined,
          width: undefined,
          height: undefined
        })
      );

      if (src && isNumber(width) && isNumber(height)) {
        const { id } = await createBlockScreenshot({
          base64: src,
          blockType: "layout"
        }).catch(() => ({ id: undefined }));

        if (id) {
          meta._thumbnailSrc = id;
          meta._thumbnailWidth = width;
          meta._thumbnailHeight = height;
          meta._thumbnailTime = Date.now();
        }
      }
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

    if (!screenshotsSupported) {
      ToastNotification.warn(
        t("Your block was saved without screenshot, browser is not compatible"),
        { hideAfter: 5 }
      );
    }

    this.setState({ layoutLoading: false });
  };

  handleClearPage = (): void => {
    this.props.removeBlocks();
  };

  getTooltipItems(): ControlsProps["addonAfter"] {
    const { pageStatus } = this.props;
    const layoutItems =
      IS_STORY || IS_GLOBAL_POPUP
        ? []
        : [
            {
              title: t("Clear Layout"),
              icon: "nc-trash",
              roles: ["admin"],
              onClick: (): void => {
                this.handleClearPage();
              }
            },
            {
              title: t("Save Layout"),
              icon: "nc-save-section",
              loading: this.state.layoutLoading,
              onClick: (): void => {
                this.handleSavePage();
              }
            }
          ];

    return [
      ...layoutItems,
      {
        title: getTooltipPageTitle(pageStatus),
        icon: getTooltipPageIcon(pageStatus),
        loading: this.state.draftLoading,
        onClick: (): void => {
          switch (pageStatus) {
            case "publish": {
              this.handleDraft("draftLoading");
              break;
            }
            case "draft": {
              this.handlePublish("draftLoading");
              break;
            }
          }
        }
      }
    ];
  }

  getLabel(): string {
    const { pageStatus } = this.props;

    switch (pageStatus) {
      case "publish": {
        return t("Update");
      }
      case "draft": {
        return t("Save Draft");
      }
    }
  }

  render(): ReactElement {
    return (
      <>
        <BottomPanelItem paddingSize="small">
          <Controls
            addonAfter={this.getTooltipItems()}
            onClick={this.handleClick}
            loading={this.state.updateLoading}
          >
            {this.getLabel()}
          </Controls>
        </BottomPanelItem>
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
