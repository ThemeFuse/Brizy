import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import * as AppsComponent from "./Apps";
import { getForm, getIntegration, createIntegration } from "./api";

const IS_PRO = Config.get("pro");

class Service extends BaseIntegration {
  appsData = [];
  appsComponent = AppsComponent;
  proExceptions = !IS_PRO;

  async componentDidMount() {
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const { services } = await r.json();
    const { status, data } = await getForm(this.props.value.formId);

    this.appsData = services;

    if (status !== 200) {
      this.setState({
        error: t("Something went wrong"),
        loading: false
      });
    } else {
      this.setState({
        connectedApps: this.getConnectedApps(data.integrations),
        loading: false
      });
    }
  }

  handleConnectApp = async appData => {
    const connectedApp = appData.id;
    const { formId } = this.props.value;
    const { stages } = this.appsData.find(app => app.id === connectedApp);

    let { status, data: integrationData } = await getIntegration({
      appId: connectedApp,
      formId
    });

    if (status !== 200) {
      if (status === 404) {
        const { status, data } = await createIntegration({
          formId,
          body: {
            id: connectedApp
          }
        });

        if (status !== 200) {
          this.setState({
            error: t("Something went wrong")
          });

          return;
        } else {
          integrationData = data;
        }
      } else {
        this.setState({
          error: t("Something went wrong")
        });

        return;
      }
    }

    const data = Object.assign({}, this.state.data, {
      [`${connectedApp}`]: {
        ...appData,
        data: integrationData
      }
    });

    this.setState({ stages, connectedApp, data }, () => {
      this.handleNext();
    });
  };
}

export default Service;
