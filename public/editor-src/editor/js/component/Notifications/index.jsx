import React, { useCallback } from "react";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import EditorIcon from "visual/component/EditorIcon";
import { useConfig } from "visual/global/hooks";
import { updateError } from "visual/redux/actions2";
import { errorSelector } from "visual/redux/selectors";
import { sendHeartBeatTakeOver } from "visual/utils/api";
import {
  HEART_BEAT_ERROR,
  PROJECT_DATA_VERSION_ERROR,
  PROJECT_LOCKED_ERROR,
  SYNC_ERROR
} from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import * as Str from "visual/utils/reader/string";
import { ToastNotification } from "./ToastNotifications";

const getUserEmail = (data) => data.lockedBy.user_email;

const NotificationContainer = ({ children }) => {
  return (
    <div className="brz-ed-notification">
      <div className="brz-ed-notification__body brz-d-xs-flex brz-flex-xs-column brz-align-items-xs-center brz-text-lg-center">
        {children}
      </div>
    </div>
  );
};

const NotificationHeader = ({ children }) => (
  <div className="brz-ed-notification__head">{children}</div>
);

const NotificationContent = ({ children }) => (
  <div className="brz-ed-notification__content">{children}</div>
);

const NotificationFooter = ({ children }) => (
  <div className="brz-ed-notification__footer brz-d-xs-flex brz-align-items-xs-center">
    {children}
  </div>
);

const NotificationCloseIcon = ({ onClick }) => (
  <EditorIcon
    icon="nc-close"
    className="brz-ed-notification__close-icon"
    onClick={onClick}
  />
);

const Notification = ({ error, dispatch }) => {
  const config = useConfig();
  const { code, data } = error || {};
  let content;

  const clearError = () => dispatch(updateError(null));
  const handleTakeOver = useCallback(async () => {
    clearError();
    try {
      await sendHeartBeatTakeOver(config.api);
    } catch (e) {
      ToastNotification.error(t("Take over failed please refresh the page"));
    }
  }, []);

  switch (code) {
    case HEART_BEAT_ERROR: {
      content = (
        <NotificationContainer>
          <NotificationHeader>
            <EditorIcon
              icon="nc-warning"
              className="brz-ed-notification__warning"
            />
          </NotificationHeader>
          <NotificationContent>
            {data.lockedBy
              ? `${getUserEmail(data)} ${t("is already editing project")}`
              : data.statusText || t("Something went wrong")}
          </NotificationContent>
          <NotificationFooter>
            <button
              className="brz-button brz-ed-btn brz-ed-btn-blue brz-ed-btn-round brz-ed-btn-xs-2"
              onClick={() => {
                window.parent.location.reload();
              }}
            >
              {t("Refresh")}
            </button>
          </NotificationFooter>
        </NotificationContainer>
      );
      break;
    }
    case PROJECT_LOCKED_ERROR: {
      content = (
        <NotificationContainer>
          <NotificationHeader>
            <EditorIcon
              icon="nc-warning"
              className="brz-ed-notification__warning"
            />
          </NotificationHeader>
          <NotificationContent>
            {data.lockedBy
              ? `${t("You can’t make changes")}.
          ${getUserEmail(data)} ${t(
            "is currently working on this page. Do you want to take over"
          )} ?`
              : data}
          </NotificationContent>
          <NotificationFooter>
            <button
              className="brz-button brz-ed-notification__take-over brz-ed-btn brz-ed-btn-blue brz-ed-btn-round brz-ed-btn-xs-2"
              onClick={handleTakeOver}
            >
              {t("Take over")}
            </button>
          </NotificationFooter>
        </NotificationContainer>
      );
      break;
    }
    case PROJECT_DATA_VERSION_ERROR: {
      content = (
        <NotificationContainer>
          <NotificationHeader>
            <EditorIcon
              icon="nc-warning"
              className="brz-ed-notification__warning"
            />
          </NotificationHeader>
          <NotificationContent>{data}</NotificationContent>
          <NotificationFooter>
            <button
              className="brz-button brz-ed-btn brz-ed-btn-blue brz-ed-btn-round brz-ed-btn-xs-2"
              onClick={() => {
                window.parent.location.reload();
              }}
            >
              {t("Refresh")}
            </button>
          </NotificationFooter>
        </NotificationContainer>
      );
      break;
    }
    case SYNC_ERROR: {
      content = (
        <NotificationContainer>
          <NotificationHeader>
            <EditorIcon
              icon="nc-lock2"
              className="brz-ed-notification__warning"
            />
          </NotificationHeader>
          <NotificationContent>
            {t(
              "You have reached the maximum number of published pages for the Free plan. Continue creating drafts or upgrade to PRO to unlock unlimited published pages."
            )}
          </NotificationContent>
          <NotificationFooter>
            <button
              className="brz-ed-notification__button-continue"
              onClick={clearError}
            >
              {t("Continue with Free")}
            </button>
            <a
              className="brz-button brz-ed-notification__take-over brz-ed-btn brz-ed-btn-blue brz-ed-btn-round brz-ed-btn-xs-2"
              href={Str.read(data?.upgradeToProUrl) ?? "#"}
            >
              {t("Upgrade to PRO")}
            </a>
          </NotificationFooter>
          <NotificationCloseIcon onClick={clearError} />
        </NotificationContainer>
      );
      break;
    }
    default: {
      content = null;
    }
  }

  return (
    <CSSTransition
      in={Boolean(content)}
      timeout={300}
      classNames="brz-ed-fade"
      unmountOnExit
    >
      {content ? content : <span />}
    </CSSTransition>
  );
};

const mapStateToProps = (state) => ({
  error: errorSelector(state)
});

export default connect(mapStateToProps)(Notification);

export { ToastNotification };
