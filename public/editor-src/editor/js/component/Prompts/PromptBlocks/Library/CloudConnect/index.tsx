import React, { useEffect } from "react";
import { ConnectedProps, connect } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { updateAuthorization } from "visual/redux/actions2";
import { authorizedSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import { setAuthorized } from "visual/utils/user/getAuthorized";
import { useDisconnect } from "./common";

const mapState = (state: ReduxState): { isAuthorized: boolean } => ({
  isAuthorized: authorizedSelector(state) === "connected"
});
const mapDispatch = { updateAuthorization };
const cloudConnector = connect(mapState, mapDispatch);

type CloudConnectProps = ConnectedProps<typeof cloudConnector> & {
  onSuccessSync?: () => void;
};

export const CloudConnect: React.FC<CloudConnectProps> = (
  props: CloudConnectProps
): React.ReactElement => {
  const { isAuthorized, updateAuthorization } = props;
  const { isDisconnect } = useDisconnect();

  useEffect(() => {
    if (isDisconnect) {
      updateAuthorization("disconnect");
      setAuthorized("disconnect");
    }
  }, [isDisconnect, updateAuthorization]);

  return (
    <div className="brz-ed-popup-two__cloud">
      <p className="brz-p">
        {isAuthorized
          ? t("Saved Library is syncing to your Account")
          : t(
              "Access your Library in any WP install by connecting your Account"
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
    </div>
  );
};

export default cloudConnector(CloudConnect);
