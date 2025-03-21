import { useEffect, useState } from "react";
import { ToastNotification } from "visual/component/Notifications";
import { logout, sync } from "visual/component/Prompts/PromptAuthorization/api";
import { useConfig } from "visual/providers/ConfigProvider";
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
  const config = useConfig();

  const setDisconnect = (): void => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      logout(config)
        .then((r) => {
          if (!r.status || r.status >= 400) {
            updateError(r);
            ToastNotification.error(t("Something went wrong"));
          } else {
            setLoading(false);
            updateDisconnect(true);
          }
        })
        .catch((e) => {
          setLoading(false);
          updateError(e);
          ToastNotification.error(t("Something went wrong"));
        });
    }
  }, [loading, config]);

  useEffect(() => {
    if (isDisconnect) {
      updateDisconnect(false);
    }
  }, [isDisconnect]);

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
  const config = useConfig();

  const setSync = (): void => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      sync(config)
        .then((r) => {
          if (!r.status || r.status >= 400) {
            updateError(r);
            ToastNotification.error(t("Unsuccessful sync"));
          } else {
            setLoading(false);
            updateSync(true);

            ToastNotification.success(t("Done, your library has synced"));
          }
        })
        .catch((e) => {
          setLoading(false);
          updateError(e);
          ToastNotification.error(t("Unsuccessful sync"));
        });
    }
  }, [loading, config]);

  return { isSync, error, loading, setSync };
};
