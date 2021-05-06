import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import Button from "visual/component/Prompts/common/Button";
import { updateAuthorization } from "visual/redux/actions2";
import {
  authorizedSelector,
  syncAllowedSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import { t } from "visual/utils/i18n";
import { SyncAllowed } from "visual/types";
import { useDisconnect, useSync } from "./common";
import { setAuthorized } from "visual/utils/user/getAuthorized";

const handleConnect = (): void => {
  const data: PromptsProps = {
    mode: "stack",
    prompt: "authorization",
    props: {}
  };
  Prompts.open(data);
};

const mapState = (
  state: ReduxState
): { isAuthorized: boolean; syncAllowed: SyncAllowed } => ({
  isAuthorized: authorizedSelector(state) === "connected",
  syncAllowed: syncAllowedSelector(state)
});
const mapDispatch = { updateAuthorization };
const cloudConnector = connect(mapState, mapDispatch);

type CloudConnectProps = ConnectedProps<typeof cloudConnector> & {
  onSuccessSync?: () => void;
};

export const CloudConnectWP: React.FC<CloudConnectProps> = (
  props: CloudConnectProps
): React.ReactElement => {
  const {
    isAuthorized,
    syncAllowed,
    onSuccessSync,
    updateAuthorization
  } = props;
  const { isSync, setSync, loading: syncLoading } = useSync();
  const { isDisconnect, setDisconnect, loading } = useDisconnect();

  useEffect(() => {
    if (isSync) {
      onSuccessSync && onSuccessSync();
    }
  }, [isSync]);

  useEffect(() => {
    if (isDisconnect) {
      updateAuthorization("disconnect");
      setAuthorized("disconnect");
    }
  }, [isDisconnect]);

  return (
    <div className="brz-ed-popup-two__cloud">
      <p className="brz-p">
        {isAuthorized
          ? t("Saved Library is syncing to your Brizy Account")
          : t(
              "Access your Library in any WP install by connecting your Brizy Account"
            )}
      </p>
      <div className="brz-ed-popup-two__cloud-icon">
        <div className="brz-d-inline-block brz-p-relative">
          <EditorIcon icon="nc-upload" />
          {isAuthorized && (
            <div className="brz-ed-popup-two__cloud-icon--connect">
              <EditorIcon icon="nc-check-circle-white" />
            </div>
          )}
        </div>
      </div>
      <Button
        className="brz-ed-popup-two__cloud-button"
        size={4}
        color={isAuthorized ? "gray" : "teal"}
        loading={loading}
        onClick={(): void => {
          isAuthorized ? setDisconnect() : handleConnect();
        }}
      >
        {isAuthorized ? t("Disconnect") : t("Connect")}
      </Button>
      {isAuthorized && syncAllowed && (
        <Button
          className="brz-ed-popup-two__cloud-button-sync"
          size={4}
          color="teal"
          loading={syncLoading}
          onClick={(): void => {
            setSync();
          }}
        >
          {t("Sync Now")}
        </Button>
      )}

      {!syncAllowed && (
        <p className="brz-p">
          {t(
            "Your Plugin version is incompatible with Brizy Account version, please update plugin"
          )}
        </p>
      )}

      <div className="brz-ed-popup-two__cloud-info">
        <EditorIcon icon="nc-alert-circle-que" />
        <a href="#" target="_blank" className="brz-a">
          {t("What’s this")}?
        </a>
      </div>
    </div>
  );
};

export default cloudConnector(CloudConnectWP);
