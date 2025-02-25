import classnames from "classnames";
import { noop } from "es-toolkit";
import { produce } from "immer";
import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import { ConnectedProps, connect } from "react-redux";
import { Alert } from "visual/component/Alert";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { Spacer } from "visual/component/Controls/Spacer";
import { Button } from "visual/component/Prompts/common/Button";
import { Loading } from "visual/component/Prompts/common/Loading";
import { validateEmail } from "visual/component/Prompts/common/utils";
import { updateAuthorization, updateSyncAllowed } from "visual/redux/actions2";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { setAuthorized } from "visual/utils/user/getAuthorized";
import { checkCompatibility, recoveryEmail, signIn } from "./api";
import { AuthorizationField, SignAuthorizationProps } from "./types";

interface SignInState {
  loading: boolean;
  nextLoading: boolean;
  prevLoading: boolean;
  recoverLoading: boolean;
  formData: {
    [k: string]: unknown;
    username: string;
    password: string;
    recoverEmail: string;
  };
  data: null | { signInDescription: string };
  notice: null | { message: string; type: "error" | "success" };
}

const mapDispatch = { updateAuthorization, updateSyncAllowed };
const signInConnector = connect(null, mapDispatch);

type SingInProps = ConnectedProps<typeof signInConnector> &
  SignAuthorizationProps;

const fields: AuthorizationField[] = [
  {
    title: "username",
    name: "username",
    required: true
  },
  {
    title: "password",
    name: "password",
    type: "password",
    required: true
  }
];

class SignIn extends Component<SingInProps, SignInState> {
  static defaultProps = {
    className: "",
    onSuccess: noop,
    onSkip: noop,
    onClose: noop,
    onLoading: noop
  };

  state: SignInState = {
    data: null,
    loading: true,
    nextLoading: false,
    prevLoading: false,
    recoverLoading: false,
    notice: null,
    formData: {
      username: "",
      password: "",
      recoverEmail: ""
    }
  };

  async componentDidMount(): Promise<void> {
    const { onLoading } = this.props;
    const { Integrations } = await import("visual/config/integrations");

    this.setState({
      data: Integrations.cloudAuthorization,
      loading: false
    });

    onLoading && onLoading(false);
  }

  handleChange = <T extends SignInState["formData"], K extends keyof T>(
    k: K,
    v: T[K]
  ): void => {
    this.setState(
      produce((draft) => {
        draft.formData[k] = v;
      })
    );
  };

  handleConnect = (): void => {
    const { username, password } = this.state.formData;
    const {
      onSuccess,
      onClose,
      updateAuthorization,
      updateSyncAllowed,
      checkCompatibilityAfter,
      config
    } = this.props;

    this.setState({
      notice: null,
      nextLoading: true
    });

    if (username.trim() && password.trim()) {
      signIn(
        {
          password,
          email: username
        },
        config
      )
        .then((r) => {
          if (!r.status || r.status >= 400) {
            throw r;
          } else {
            updateAuthorization("connected");
            setAuthorized("connected");

            if (checkCompatibilityAfter) {
              checkCompatibility(config).then((r) => {
                const { status, data } = r || {};

                if (!status || status >= 400) {
                  console.warn("Something went wrong", r);
                } else {
                  if (data?.isSyncAllowed) {
                    updateSyncAllowed(true);
                  }
                }
              });
            }

            onSuccess?.();
            onClose?.();
          }
        })
        .catch((e) => {
          this.setState({
            nextLoading: false,
            notice: {
              message: t("Incorrect username or password"),
              type: "error"
            }
          });

          if (process.env.NODE_ENV === "development") {
            console.error(e);
          }
        });
    } else {
      this.setState({
        nextLoading: false,
        notice: {
          message: t("Incorrect username or password"),
          type: "error"
        }
      });
    }
  };

  handleSkip = async (): Promise<void> => {
    const { onSkip, onClose, updateAuthorization } = this.props;
    this.setState({ prevLoading: true });

    await pendingRequest();

    this.setState({ prevLoading: false });

    updateAuthorization("pending");
    setAuthorized("pending");
    onSkip && onSkip();
    onClose && onClose();
  };

  handleRecover = async (): Promise<void> => {
    const { recoverEmail } = this.state.formData;
    const { config } = this.props;

    this.setState({
      notice: null,
      recoverLoading: true
    });

    if (!validateEmail(recoverEmail)) {
      this.setState({
        recoverLoading: false,
        notice: {
          message: t("The email address format is not valid"),
          type: "error"
        }
      });

      return;
    }

    if (recoverEmail.trim()) {
      recoveryEmail(recoverEmail, config)
        .then((r) => {
          if (!r.status || r.status >= 400) {
            throw r;
          } else {
            this.setState({
              recoverLoading: false,
              notice: {
                message: t("Check your email address"),
                type: "success"
              }
            });
          }
        })
        .catch((e) => {
          this.setState({
            recoverLoading: false,
            notice: {
              message: t("Failed to reset password"),
              type: "error"
            }
          });
          if (process.env.NODE_ENV === "development") {
            console.error(e);
          }
        });
    } else {
      await pendingRequest();

      this.setState({
        recoverLoading: false,
        notice: {
          message: t("Email to recover password cannot be empty"),
          type: "error"
        }
      });
    }
  };

  renderLoading(): React.ReactElement {
    return <Loading />;
  }

  renderNotice(): React.ReactElement | undefined {
    const { notice } = this.state;

    if (notice !== null) {
      const { message, type } = notice;

      return <Alert message={message} type={type} />;
    }
  }

  renderContent(): React.ReactElement | undefined {
    if (this.state.data) {
      const {
        data: { signInDescription },
        formData: { recoverEmail },
        notice,
        nextLoading,
        prevLoading,
        recoverLoading
      } = this.state;

      return (
        <Scrollbars className="brz-text-lg-center">
          <div className="brz-ed-popup-integrations__connect-head">
            <Spacer space="73px" />
            <p className="brz-p">{signInDescription}</p>
          </div>
          <div className="brz-ed-popup-integrations__connect-body">
            {notice && this.renderNotice()}

            {fields.map(({ title, name, required, type = "text" }, index) => {
              return (
                <InputPlaceholder
                  key={index}
                  title={title}
                  type={type}
                  value={`${this.state.formData[name] ?? ""}`}
                  required={required}
                  onChange={({ target }): void => {
                    this.handleChange(name, target.value);
                  }}
                />
              );
            })}

            <div className="brz-ed-popup-authorization__buttons">
              <Button
                color="teal"
                loading={nextLoading}
                onClick={this.handleConnect}
              >
                {t("Connect")}
              </Button>
              <Button
                color="default"
                loading={prevLoading}
                onClick={this.handleSkip}
              >
                {t("Skip")}
              </Button>
            </div>
            <InputPlaceholder
              title={t("Email to recover password")}
              icon="nc-right-arrow-tail"
              loading={recoverLoading}
              value={recoverEmail}
              onChange={({ target }): void => {
                this.handleChange("recoverEmail", target.value);
              }}
              onClickIcon={this.handleRecover}
            />
          </div>
        </Scrollbars>
      );
    }
  }

  render(): React.ReactElement {
    const className = classnames(
      "brz-ed-popup-authorization",
      this.props.className
    );

    return (
      <div className={className}>
        {this.state.loading ? this.renderLoading() : this.renderContent()}
      </div>
    );
  }
}

export default signInConnector(SignIn);
