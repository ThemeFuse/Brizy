import { produce } from "immer";
import { type ConnectedProps, connect } from "react-redux";
import { fontsSelector } from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types";
import { pendingRequest } from "visual/utils/api";
import { isPro } from "visual/utils/env";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import type { AppData, BaseIntegrationProps } from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";
import type { Fonts, StateToProps } from "./types";

const mapState = (state: ReduxState): StateToProps => ({
  fonts: fontsSelector(state)
});

const connector = connect(mapState);

type IntegrationProps = BaseIntegrationProps &
  ConnectedProps<typeof connector> & {
    fonts: Fonts;
  };

class Integration extends BaseIntegration<IntegrationProps> {
  appsData: AppData[] = [];
  appsComponent = AppsComponent;
  proExceptions = !isPro(this.props.config);

  async componentDidMount(): Promise<void> {
    const { Integrations } = await import("visual/config/integrations");
    const adobeId = this.props?.fonts?.adobe?.id;
    this.appsData = Integrations.fonts;

    if (adobeId) {
      const accounts = {
        id: "adobe",
        type: "adobe",
        completed: true,
        data: {
          id: adobeId
        }
      };

      this.setState(
        produce((draft) => {
          draft.data = {
            adobe: accounts
          };
          draft.connectedApps = this.getConnectedApps([accounts]);
          draft.loading = false;
        })
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const appId = appData.id;
    const { stages = [] } = this.appsData.find((app) => app.id === appId) || {};

    await pendingRequest();

    this.setState(
      produce((draft) => {
        const connectedAppData = draft.data[appId] || {};

        draft.connectedApp = appId;
        draft.stages = stages;
        draft.data[appId] = { ...appData, ...connectedAppData };
      }),
      () => {
        this.handleNext();
      }
    );
  };
}

export default connector(Integration);
