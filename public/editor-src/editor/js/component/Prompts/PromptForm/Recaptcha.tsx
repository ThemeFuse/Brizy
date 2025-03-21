import { produce } from "immer";
import { pendingRequest } from "visual/utils/api";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import { getAccounts } from "../common/GlobalApps/api";
import { AppData } from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";

class Recaptcha extends BaseIntegration {
  appsData: AppData[] = [];
  appsComponent = AppsComponent;

  async componentDidMount(): Promise<void> {
    const { config, onLoading } = this.props;

    const { status, data: accounts } = await getAccounts(
      {
        group: "recaptcha",
        services: "recaptcha"
      },
      config
    );

    const { Integrations } = await import("visual/config/integrations");
    this.appsData = Integrations.recaptcha;

    if (status === 200 && accounts && accounts.length > 0) {
      this.setState(
        produce((draft) => {
          draft.data = { recaptcha: { data: accounts[0] } };
          draft.connectedApps = this.getConnectedApps(accounts);
          draft.loading = false;
        })
      );
    } else {
      this.setState({
        loading: false
      });
    }

    onLoading(false);
  }

  getConnectedApps(accounts: Array<{ group: string }>): Array<string> {
    return accounts.reduce(
      (acc, cur) => {
        return this.appsData.find(({ id }) => id === cur.group)
          ? [...acc, cur.group]
          : acc;
      },
      [...this.state.connectedApps]
    );
  }

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const appId = appData.id;
    await pendingRequest();

    this.setState(
      produce((draft) => {
        const connectedAppData = draft.data[appId] || {};

        draft.connectedApp = appId;
        draft.stages = appData.stages;
        draft.data[appId] = { ...connectedAppData, ...appData };
      }),
      () => {
        this.handleNext();
      }
    );
  };
}

export default Recaptcha;
