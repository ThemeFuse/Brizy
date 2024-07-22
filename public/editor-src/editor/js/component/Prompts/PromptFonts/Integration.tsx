import { produce } from "immer";
import Config from "visual/global/Config";
import { pendingRequest } from "visual/utils/api";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import { AppData } from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";

const IS_PRO = Config.get("pro");

class Integration extends BaseIntegration {
  appsData: AppData[] = [];
  appsComponent = AppsComponent;
  proExceptions = !IS_PRO;

  async componentDidMount(): Promise<void> {
    const { Integrations } = await import("visual/config/integrations");
    this.appsData = Integrations.fonts;

    this.setState({
      loading: false
    });
  }

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const connectedApp = appData.id;
    const { stages = [] } =
      this.appsData.find((app) => app.id === connectedApp) || {};

    await pendingRequest();

    this.setState(
      produce((draft) => {
        draft.stages = stages;
        draft.connectedApp = connectedApp;
        draft.data[connectedApp] = appData;
      }),
      () => {
        this.handleNext();
      }
    );
  };
}

export default Integration;
