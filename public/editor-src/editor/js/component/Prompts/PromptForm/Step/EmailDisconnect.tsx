import React, { ReactElement, useCallback, useContext, useState } from "react";
import { IntegrationType } from "visual/global/Config/types/Form";
import { useConfig } from "visual/providers/ConfigProvider";
import { deleteSmtpIntegration, pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Context } from "../../common/GlobalApps/Context";
import { Disconnect } from "../../common/GlobalApps/StepsView";
import { AppData } from "../../common/GlobalApps/type";

interface Props {
  app?: AppData;
  notification?: IntegrationType;
  formId: string;
  handleRemoveDeletedApp: VoidFunction;
}

export const EmailDisconnect = ({
  app,
  notification,
  formId,
  handleRemoveDeletedApp
}: Props): ReactElement => {
  const [nextLoading, setNextLoading] = useState<boolean>(false);
  const [prevLoading, setPrevLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const config = useConfig();
  const { onDisconnectApp } = useContext(Context);

  const { id } = app || {};

  const handleNext = useCallback(async () => {
    if (!id) {
      setNextLoading(false);
      setError(t("Something went wrong"));
      return;
    }

    const { success } = await deleteSmtpIntegration(
      {
        formId,
        integration: id,
        notificationId: notification?.id || ""
      },
      config,
      id
    );

    if (success) {
      onDisconnectApp(id);
      handleRemoveDeletedApp();
    } else {
      setNextLoading(false);
      setError(t("Something went wrong"));
    }
  }, [
    formId,
    id,
    notification,
    handleRemoveDeletedApp,
    config,
    onDisconnectApp
  ]);

  const handlePrev = useCallback(async () => {
    setPrevLoading(true);
    setError(null);

    await pendingRequest();
    handleRemoveDeletedApp();
  }, [handleRemoveDeletedApp]);

  return (
    <Disconnect
      {...app}
      descriptions={t(
        "Are you sure you want to delete your email connection ?"
      )}
      nextLoading={nextLoading}
      prevLoading={prevLoading}
      error={error}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
};
