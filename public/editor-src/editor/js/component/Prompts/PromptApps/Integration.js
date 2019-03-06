import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import * as AppsComponent from "./Apps";
import AppsData from "./app.json";
import { getAccounts } from "../common/GlobalApps/api";
import { fakeRequest } from "../common/utils";

class Apps extends BaseIntegration {
  appsData = AppsData.filter(app => app.id === this.props.value.service);
  appsComponent = AppsComponent;

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const { group, service } = this.props.value;
    const { status, data } = await getAccounts({ group, service });

    if (data.length > 0 && status === 200) {
      const integrationData = data[0];
      const { service } = integrationData;

      this.setState({
        data: {
          [`${service}`]: {
            data: integrationData
          }
        },
        connectedApps: [service],
        loading: false
      });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  handleConnectApp = async appData => {
    const appId = appData.id;
    const { stages } = this.appsData[0];
    const { data } = this.state;

    await fakeRequest();

    this.setState(
      {
        stages,
        connectedApp: appId,
        data: {
          [`${appId}`]: {
            ...appData,
            data: data[appId] && data[appId].data
          }
        }
      },
      () => {
        this.handleNext();
      }
    );
  };
}

export default Apps;
