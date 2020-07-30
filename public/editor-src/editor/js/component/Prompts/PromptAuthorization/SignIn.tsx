import React, { Component } from "react";
import produce from "immer";
import { noop } from "underscore";
import classnames from "classnames";
import Scrollbars from "react-custom-scrollbars";
import { connect, ConnectedProps } from "react-redux";
import Config from "visual/global/Config";
import { pendingRequest } from "visual/utils/api/editor";
import EditorIcon from "visual/component/EditorIcon";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import Button from "visual/component/Prompts/common/Button";
import { updateAuthorization, updateSyncAllowed } from "visual/redux/actions2";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import { validateEmail } from "visual/component/Prompts/common/utils";
import { recoveryEmail, signIn, checkCompatibility } from "./api";
import { SignAuthorizationProps, AuthorizationField } from "./types";

type SignInState = {
  loading: boolean;
  nextLoading: boolean;
  prevLoading: boolean;
  recoverLoading: boolean;
  formData: {
    [k: string]: string | undefined;
  };
  data: null | { img: string; signInDescription: string };
  notice: null | { message: string; type: "error" | "success" };
};

const mapDispatch = { updateAuthorization, updateSyncAllowed };
const signInConnector = connect(null, mapDispatch);

type SingInProps = ConnectedProps<typeof signInConnector> &
  SignAuthorizationProps;

const isWP = Boolean(Config.get("wp"));
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
    const url = assetUrl("integrations.json");
    const r = await fetch(url);
    const { cloudAuthorization } = await r.json();
    const { onLoading } = this.props;

    this.setState({
      data: cloudAuthorization,
      loading: false
    });

    onLoading && onLoading(false);
  }

  handleChange = (k: string, v: string): void => {
    if (this.state.formData[k] !== undefined) {
      this.setState(
        produce(draft => {
          draft.formData[k] = v;
        })
      );
    }
  };

  handleConnect = (): void => {
    const { username, password } = this.state.formData;
    const {
      onSuccess,
      onClose,
      updateAuthorization,
      updateSyncAllowed
    } = this.props;

    this.setState({
      notice: null,
      nextLoading: true
    });

    if (username && username.trim() && password && password.trim()) {
      signIn({
        password,
        email: username
      })
        .then(r => {
          if (!r.status || r.status >= 400) {
            throw r;
          } else {
            updateAuthorization("connected");

            if (isWP) {
              checkCompatibility().then(r => {
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

            onSuccess && onSuccess();
            onClose && onClose();
          }
        })
        .catch(e => {
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
    onSkip && onSkip();
    onClose && onClose();
  };

  handleRecover = async (): Promise<void> => {
    const { recoverEmail } = this.state.formData;

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

    if (recoverEmail && recoverEmail.trim()) {
      recoveryEmail(recoverEmail)
        .then(r => {
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
        .catch(e => {
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
    return (
      <div className="brz-ed-popup-content--loading">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
  }

  renderNotice(): React.ReactElement | undefined {
    const { notice } = this.state;

    if (notice !== null) {
      const { message, type } = notice;

      return (
        <div className={`brz-ed-alert brz-ed-alert-${type}`}>
          <span className="brz-span">{message}</span>
        </div>
      );
    }
  }

  renderContent(): React.ReactElement | undefined {
    if (this.state.data) {
      const {
        data: { img, signInDescription },
        formData: { recoverEmail },
        notice,
        nextLoading,
        prevLoading,
        recoverLoading
      } = this.state;

      return (
        <Scrollbars className="brz-text-lg-center">
          <div className="brz-ed-popup-integrations__connect-head">
            <img className="brz-img" src={img} alt="Brizy" />
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
                  value={this.state.formData[name] || ""}
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
              title="Email to recover password"
              icon="nc-right-arrow-tail"
              loading={recoverLoading}
              value={recoverEmail || ""}
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
