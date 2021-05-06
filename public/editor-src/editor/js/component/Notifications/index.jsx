import React from "react";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import Config from "visual/global/Config";
import { updateError } from "visual/redux/actions";
import { errorSelector } from "visual/redux/selectors";
import {
  HEART_BEAT_ERROR,
  PROJECT_DATA_VERSION_ERROR,
  PROJECT_LOCKED_ERROR
} from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import { sendHearBeatTakeOver } from "visual/utils/api";
import { ToastNotification } from "./ToastNotifications";
import EditorIcon from "visual/component/EditorIcon";

const getUserEmail = data => data.lockedBy.user_email;

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

const Notification = ({ error, dispatch }) => {
  const { code, data } = error || {};
  let content;

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
      const urls = Config.get("urls");

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
            <a
              className="brz-a brz-d-xs-flex brz-align-items-xs-center brz-ed-notification__to-dashboard"
              href={urls.backToDashboard}
            >
              {t("To Dashboard")}
            </a>
            <button
              className="brz-button brz-ed-notification__take-over brz-ed-btn brz-ed-btn-blue brz-ed-btn-round brz-ed-btn-xs-2"
              onClick={() => {
                dispatch(updateError(null));
                sendHearBeatTakeOver().catch(() => {
                  ToastNotification.error(
                    t("Take over failed please refresh the page")
                  );
                });
              }}
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

const mapStateToProps = state => ({
  error: errorSelector(state)
});

export default connect(mapStateToProps)(Notification);

export { ToastNotification };
