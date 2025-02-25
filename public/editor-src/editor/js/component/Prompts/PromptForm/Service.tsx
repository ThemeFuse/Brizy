import { produce } from "immer";
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
import { createForm, createIntegration, getForm, getIntegration } from "./api";

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
    const { status, data } = await getForm({ formId }, config);

    if (status !== 200) {
      if (status === 404) {
        const { status } = await createForm({ formId }, config);

        if (status >= 400) {
          this.setState({
            error: t("Something went wrong")
          });
        } else {
          this.setState({
            loading: false
          });
        }
      } else {
        this.setState({
          error: t("Something went wrong")
        });
      }
    } else if (data) {
      this.setState({
        connectedApps: this.getConnectedApps(data.integrations),
        loading: false
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

    let { status, data } = await getIntegration({ formId, id }, config);

    if (status !== 200) {
      if (status === 404) {
        ({ status, data } = await createIntegration({ formId, id }, config));

        if (status !== 200) {
          this.setState({
            appError: t(
              "The integration is not responding, please try again or verify the account credentials"
            )
          });

          return;
        }
      } else {
        this.setState({
          appError: t(
            "The integration is not responding, please try again or verify the account credentials"
          )
        });

        return;
      }
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
