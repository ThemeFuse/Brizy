import { useEffect, useState } from "react";
import { logout, sync } from "visual/component/Prompts/PromptAuthorization/api";
import { ToastNotification } from "visual/component/Notifications";
import { t } from "visual/utils/i18n";

type Disconnect = {
  isDisconnect: boolean;
  loading: boolean;
  setDisconnect: () => void;
  error?: Response;
};

export const useDisconnect = (): Disconnect => {
  const [isDisconnect, updateDisconnect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, updateError] = useState<Response | undefined>(undefined);

  const setDisconnect = (): void => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      logout()
        .then(r => {
          if (!r.status || r.status >= 400) {
            updateError(r);
            ToastNotification.error(t("Something went wrong"), {
              toastContainer: window.parent.document.body
            });
          } else {
            setLoading(false);
            updateDisconnect(true);
          }
        })
        .catch(e => {
          setLoading(false);
          updateError(e);
          ToastNotification.error(t("Something went wrong"), {
            toastContainer: window.parent.document.body
          });
        });
    }
  }, [loading]);

  return { isDisconnect, error, loading, setDisconnect };
};

type Sync = {
  isSync: boolean;
  loading: boolean;
  setSync: () => void;
  error?: Response;
};

export const useSync = (): Sync => {
  const [isSync, updateSync] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, updateError] = useState<Response | undefined>(undefined);

  const setSync = (): void => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      sync()
        .then(r => {
          if (!r.status || r.status >= 400) {
            updateError(r);
            ToastNotification.error(t("Unsuccessful sync"), {
              toastContainer: window.parent.document.body
            });
          } else {
            setLoading(false);
            updateSync(true);

            ToastNotification.success(t("Success sync"), {
              toastContainer: window.parent.document.body
            });
          }
        })
        .catch(e => {
          setLoading(false);
          updateError(e);
          ToastNotification.error(t("Unsuccessful sync"), {
            toastContainer: window.parent.document.body
          });
        });
    }
  }, [loading]);

  return { isSync, error, loading, setSync };
};
