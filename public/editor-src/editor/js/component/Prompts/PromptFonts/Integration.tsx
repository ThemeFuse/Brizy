import produce from "immer";
import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";
import { pendingRequest } from "visual/utils/api/editor";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import { AppData } from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";

const IS_PRO = Config.get("pro");

class Integration extends BaseIntegration {
  appsData: AppData[] = [];
  appsComponent = AppsComponent;
  proExceptions = !IS_PRO;

  async componentDidMount(): Promise<void> {
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const { fonts } = await r.json();

    this.appsData = fonts;

    this.setState({
      loading: false
    });
  }

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const connectedApp = appData.id;
    const { stages = [] } =
      this.appsData.find(app => app.id === connectedApp) || {};

    await pendingRequest();

    this.setState(
      produce(draft => {
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
