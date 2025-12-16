import classNames from "classnames";
import { isFunction } from "es-toolkit";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTransitionState } from "react-transition-state";
import EditorIcon from "visual/component/EditorIcon";
import { useConfig } from "visual/providers/ConfigProvider";
import { useTranslation } from "visual/providers/I18nProvider";
import { updateError } from "visual/redux/actions2";
import { errorSelector } from "visual/redux/selectors";
import { ProjectLocked } from "visual/types";
import { isProjectLocked } from "visual/types/utils";
import { sendHeartBeatTakeOver } from "visual/utils/api";
import { ErrorCodes } from "visual/utils/errors";
import { FCC } from "visual/utils/react/types";
import * as Str from "visual/utils/reader/string";
import { ToastNotification } from "./ToastNotifications";

const getUserEmail = (data: ProjectLocked) => data.lockedBy.user_email;

const NotificationContainer: FCC = ({ children }) => {
  const [{ status, isMounted }, toggle] = useTransitionState({
    timeout: 300,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true
  });

  useEffect(() => {
    toggle(true);
  }, [toggle]);

  const className = classNames("brz-ed-notification", "brz-ed-fade", status);

  return isMounted ? (
    <div className={className}>
      <div className="brz-ed-notification__body brz-d-xs-flex brz-flex-xs-column brz-align-items-xs-center brz-text-lg-center">
        {children}
      </div>
    </div>
  ) : null;
};

const NotificationHeader: FCC = ({ children }) => (
  <div className="brz-ed-notification__head">{children}</div>
);

const NotificationContent: FCC = ({ children }) => (
  <div className="brz-ed-notification__content">{children}</div>
);

const NotificationFooter: FCC = ({ children }) => (
  <div className="brz-ed-notification__footer brz-d-xs-flex brz-align-items-xs-center">
    {children}
  </div>
);

const NotificationCloseIcon: FCC<{ onClick: VoidFunction }> = ({ onClick }) => (
  <EditorIcon
    icon="nc-close"
    className="brz-ed-notification__close-icon"
    onClick={onClick}
  />
);

const Notification = () => {
  const [loading, setLoading] = useState(false);

  const config = useConfig();
  const error = useSelector(errorSelector);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const clearError = useCallback(() => dispatch(updateError(null)), [dispatch]);

  const handleTakeOver = useCallback(async () => {
    clearError();
    try {
      await sendHeartBeatTakeOver(config.api);
    } catch (_) {
      ToastNotification.error(t("Take over failed please refresh the page"));
    }
  }, [clearError, config.api, t]);

  const handleDeleteGlobalBlock = useCallback(() => {
    const handleRemove =
      error?.code === ErrorCodes.REMOVE_GLOBAL_BLOCK
        ? error.data.handleDelete
        : undefined;

    if (isFunction(handleRemove)) {
      setLoading(true);
      handleRemove({ onAfterResponse: () => setLoading(false) });
    }
  }, [error]);

  if (!error || !(error.code in ErrorCodes)) {
    return null;
  }

  switch (error.code) {
    case ErrorCodes.HEART_BEAT_ERROR: {
      const { data } = error ?? {};
      return (
        <NotificationContainer>
          <NotificationHeader>
            <EditorIcon
              icon="nc-warning"
              className="brz-ed-notification__warning"
            />
          </NotificationHeader>
          <NotificationContent>
            {isProjectLocked(data)
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
    }
    case ErrorCodes.PROJECT_LOCKED_ERROR: {
      const { data } = error ?? {};

      return (
        <NotificationContainer>
          <NotificationHeader>
            <EditorIcon
              icon="nc-warning"
              className="brz-ed-notification__warning"
            />
          </NotificationHeader>
          <NotificationContent>
            {data.lockedBy ? (
              `${t("You can’t make changes")}.
          ${getUserEmail(data)} ${t(
            "is currently working on this page. Do you want to take over"
          )} ?`
            ) : (
              <>{data}</>
            )}
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
    }
    case ErrorCodes.PROJECT_DATA_VERSION_ERROR: {
      const { data } = error ?? {};

      return (
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
    }
    case ErrorCodes.SYNC_ERROR: {
      const { data } = error ?? {};

      return (
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
    }
    case ErrorCodes.REMOVE_GLOBAL_BLOCK: {
      const {
        data: { text }
      } = error ?? {};

      return (
        <NotificationContainer>
          <NotificationHeader>
            <EditorIcon
              icon="nc-warning"
              className="brz-ed-notification__warning"
            />
          </NotificationHeader>
          <NotificationContent>{text}</NotificationContent>
          <NotificationFooter>
            <button
              className="brz-ed-notification__remove-gb--cancel"
              onClick={clearError}
            >
              <EditorIcon icon="t2-cancel" />
              {t("Cancel")}
            </button>
            <button
              className="brz-button brz-ed-btn brz-ed-btn-blue brz-ed-btn-round brz-ed-btn-xs-2 brz-ed-notification__remove-gb--confirmation"
              onClick={handleDeleteGlobalBlock}
            >
              {loading ? (
                <EditorIcon
                  icon="nc-circle-02"
                  className="brz-ed-animated--spin"
                />
              ) : (
                t("Delete Anyway")
              )}
            </button>
          </NotificationFooter>
        </NotificationContainer>
      );
    }
    default: {
      return null;
    }
  }
};

export default Notification;
export { ToastNotification };
