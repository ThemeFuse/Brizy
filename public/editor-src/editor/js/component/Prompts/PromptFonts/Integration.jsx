import { mergeDeep } from "timm";
import Config from "visual/global/Config";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import * as AppsComponent from "./Apps";
import { fakeRequest } from "../common/utils";
import { assetUrl } from "visual/utils/asset";

const IS_PRO = Config.get("pro");

class Integration extends BaseIntegration {
  appsData = [];
  appsComponent = AppsComponent;
  proExceptions = !IS_PRO;

  async componentDidMount() {
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const { fonts } = await r.json();

    this.appsData = fonts;

    this.setState({
      loading: false
    });
  }

  handleConnectApp = async appData => {
    const connectedApp = appData.id;
    const { stages } = this.appsData.find(app => app.id === connectedApp);

    await fakeRequest();

    const data = mergeDeep(this.state.data, { [`${connectedApp}`]: appData });

    this.setState({ stages, connectedApp, data }, () => {
      this.handleNext();
    });
  };
}

export default Integration;
