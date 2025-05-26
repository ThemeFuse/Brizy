import { produce } from "immer";
import { getAccounts, pendingRequest } from "visual/utils/api";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import { AppData, BaseIntegrationProps } from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";

type Props = BaseIntegrationProps & {
  group: string;
  service: string;
};

class Apps extends BaseIntegration<Props> {
  appsData: AppData[] = [];
  appsComponent = AppsComponent;

  async componentDidMount(): Promise<void> {
    const { Integrations } = await import("visual/config/integrations");
    this.appsData = Integrations.facebook;

    await this.getData();
  }

  async getData(): Promise<void> {
    const { group, service, config } = this.props;
    const data = await getAccounts({ group, services: service }, config);
    if (data && data.length > 0) {
      const integrationData = data[0];
      const { services } = integrationData;

      this.setState(
        produce((draft) => {
          draft.data[services] = {
            data: integrationData
          };
          draft.loading = false;
          draft.connectedApps = [services];
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
    const { stages } = this.appsData[0];

    await pendingRequest();

    this.setState(
      produce((draft) => {
        draft.stages = stages;
        draft.connectedApp = appId;
        Object.assign(draft.data[appId], appData);
      }),
      () => {
        this.handleNext();
      }
    );
  };
}

export default Apps;
