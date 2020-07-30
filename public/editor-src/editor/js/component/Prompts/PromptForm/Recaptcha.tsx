import produce from "immer";
import { assetUrl } from "visual/utils/asset";
import { pendingRequest } from "visual/utils/api/editor";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import { getAccounts } from "../common/GlobalApps/api";
import { AppData } from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";

class Recaptcha extends BaseIntegration {
  appsData = [];
  appsComponent = AppsComponent;

  async componentDidMount(): Promise<void> {
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const { recaptcha } = await r.json();
    const { status, data: accounts } = await getAccounts({
      group: "recaptcha",
      services: "recaptcha"
    });

    this.appsData = recaptcha;

    if (status === 200 && accounts && accounts.length > 0) {
      this.setState(
        produce(draft => {
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
      produce(draft => {
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
