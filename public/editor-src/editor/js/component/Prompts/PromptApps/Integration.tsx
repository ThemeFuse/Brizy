import produce from "immer";
import { assetUrl } from "visual/utils/asset";
import { pendingRequest } from "visual/utils/api/editor";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import { getAccounts } from "../common/GlobalApps/api";
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
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const data = await r.json();

    this.appsData = data.facebook;

    await this.getData();
  }

  async getData(): Promise<void> {
    const { group, service } = this.props;
    const { status, data } = await getAccounts({ group, services: service });

    if (data && data.length > 0 && status === 200) {
      const integrationData = data[0];
      const { services } = integrationData;

      this.setState(
        produce(draft => {
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
      produce(draft => {
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
