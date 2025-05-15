import { produce } from "immer";
import { getForm, getIntegration } from "visual/utils/api";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import BaseIntegration from "../common/GlobalApps/BaseIntegration";
import {
  AppData,
  BaseIntegrationContext,
  BaseIntegrationProps,
  BaseIntegrationState,
  FormField
} from "../common/GlobalApps/type";
import * as AppsComponent from "./Apps";

type Props = BaseIntegrationProps & {
  formId: string;
  formFields: FormField[];
};

type Context = BaseIntegrationContext & {
  formId: string;
  formFields: FormField[];
};

class Service extends BaseIntegration<Props, BaseIntegrationState, Context> {
  appsData: AppData[] = [];
  appsComponent = AppsComponent;
  proExceptions = !isPro(this.props.config);

  async componentDidMount(): Promise<void> {
    const { Integrations } = await import("visual/config/integrations");
    this.appsData = Integrations.services;
    await this.getData();
  }

  async getData(): Promise<void> {
    const { formId, config, onLoading } = this.props;
    const data = await getForm({ formId }, config);

    if (data) {
      this.setState({
        connectedApps: this.getConnectedApps(data.integrations),
        loading: false
      });
    } else {
      this.setState({
        error: t("Something went wrong")
      });
    }

    onLoading(false);
  }

  getContextValue(): Context {
    const { formId, formFields } = this.props;
    const parentContext = super.getContextValue();

    return {
      ...parentContext,
      formId,
      formFields
    };
  }

  handleConnectApp = async (appData: AppData): Promise<void> => {
    const { id, stages } = appData;
    const { formId, config } = this.props;

    const data = await getIntegration({ formId, id }, config);

    if (!data) {
      return this.setState({
        appError: t(
          "The integration is not responding, please try again or verify the account credentials"
        )
      });
    }

    this.setState(
      produce((draft) => {
        draft.appError = null;
        draft.stages = stages;
        draft.connectedApp = id;
        draft.data[id] = appData;
        draft.data[id].data = data;
      }),
      () => {
        this.handleNext();
      }
    );
  };
}

export default Service;
