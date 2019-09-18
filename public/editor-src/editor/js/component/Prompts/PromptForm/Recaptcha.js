import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import * as AppsComponent from "./Apps";
import { assetUrl } from "visual/utils/asset";
import { getAccounts } from "../common/GlobalApps/api";

class Recaptcha extends BaseIntegration {
  appsData = [];
  appsComponent = AppsComponent;

  async componentDidMount() {
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const { recaptcha } = await r.json();
    const { status, data: accounts } = await getAccounts();

    this.appsData = recaptcha;

    if (status === 200 && accounts.length > 0) {
      this.setState({
        connectedApps: this.getConnectedApps(accounts),
        loading: false
      });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  getConnectedApps(accounts) {
    return accounts.reduce(
      (acc, cur) => {
        return this.appsData.find(({ id }) => id === cur.group)
          ? [...acc, cur.group]
          : acc;
      },
      [...this.state.connectedApps]
    );
  }

  handleConnectApp = async appData => {
    const connectedApp = appData.id;
    const { stages } = this.appsData.find(app => app.id === connectedApp);
    const { data: stateData } = this.state;
    const { status, data: accounts } = await getAccounts({
      group: connectedApp,
      service: connectedApp
    });

    if (accounts.length > 0 && status === 200) {
      const data = Object.assign({}, stateData, {
        [`${connectedApp}`]: {
          ...appData,
          data: accounts.find(({ group }) => group === connectedApp)
        }
      });

      this.setState({ stages, connectedApp, data }, () => {
        this.handleNext();
      });
    } else {
      const data = Object.assign({}, stateData, {
        [`${connectedApp}`]: appData
      });

      this.setState({ stages, connectedApp, data }, () => {
        this.handleNext();
      });
    }
  };
}

export default Recaptcha;
