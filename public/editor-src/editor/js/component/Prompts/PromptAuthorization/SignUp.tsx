import React, { Component } from "react";
import produce from "immer";
import classnames from "classnames";
import Scrollbars from "react-custom-scrollbars";
import { noop } from "underscore";
import { connect, ConnectedProps } from "react-redux";
import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";
import { updateAuthorization, updateSyncAllowed } from "visual/redux/actions2";
import EditorIcon from "visual/component/EditorIcon";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import Button from "visual/component/Prompts/common/Button";
import { validateEmail } from "../common/utils";
import { t } from "visual/utils/i18n";
import { checkCompatibility, signUp } from "./api";
import { SignAuthorizationProps, AuthorizationField } from "./types";
import { setAuthorized } from "visual/utils/user/getAuthorized";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { _getWhiteLabel } from "visual/utils/whiteLabel";

const isWP = Boolean(Config.get("wp"));
const fields: AuthorizationField[] = [
  {
    title: "email",
    name: "email",
    required: true
  },
  {
    title: "password",
    name: "password",
    type: "password",
    required: true
  },
  {
    title: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    required: true
  }
];

type SignUpState = {
  nextLoading: boolean;
  loading: boolean;
  data: null | { img: string; signUpDescription: string };
  notice: null | { message: string; type: "error" | "success" };
  formData: {
    [k: string]: string | undefined;
  };
};

const mapDispatch = { updateAuthorization, updateSyncAllowed };
const signUpConnector = connect(null, mapDispatch);

type SingUpProps = ConnectedProps<typeof signUpConnector> &
  SignAuthorizationProps;

class SignUp extends Component<SingUpProps, SignUpState> {
  static defaultProps = {
    className: "",
    onSuccess: noop,
    onSkip: noop,
    onClose: noop,
    onLoading: noop
  };

  state: SignUpState = {
    data: null,
    notice: null,
    nextLoading: false,
    loading: true,
    formData: {
      email: "",
      password: "",
      confirmPassword: ""
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

  handleConnect = async (): Promise<void> => {
    const {
      onSuccess,
      onClose,
      updateAuthorization,
      updateSyncAllowed
    } = this.props;
    const { email, password, confirmPassword } = this.state.formData;

    if (!validateEmail(email)) {
      this.setState({
        nextLoading: false,
        notice: {
          message: t("The email address format is not valid"),
          type: "error"
        }
      });

      return;
    }

    if (password !== confirmPassword) {
      this.setState({
        nextLoading: false,
        notice: {
          message: t("Password and confirm password is not the same"),
          type: "error"
        }
      });

      return;
    }

    this.setState({
      notice: null,
      nextLoading: true
    });

    if (email?.trim() && password?.trim() && confirmPassword?.trim()) {
      signUp({
        email,
        password,
        confirmPassword
      })
        .then((r: Response) => {
          if (!r.status || r.status >= 400) {
            throw r;
          } else {
            updateAuthorization("connected");
            setAuthorized("connected");

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
        .catch((e: unknown) => {
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
          message: t("All fields cannot be empty"),
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

    if (notice) {
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
        data: { img, signUpDescription },
        nextLoading
      } = this.state;

      const config = Config.getAll();

      const _img =
        (_getWhiteLabel(config) && isCloud(config) && config.urls.favicon) ||
        img;

      const _alt = _getWhiteLabel(config)?.brandingName || "Brizy";

      return (
        <Scrollbars className="brz-text-lg-center">
          <div className="brz-ed-popup-integrations__connect-head">
            <img className="brz-img" src={_img} alt={_alt} />
            <p className="brz-p">{signUpDescription}</p>
          </div>
          <div className="brz-ed-popup-integrations__connect-body">
            {this.renderNotice()}

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
                {t("Create Account & Connect")}
              </Button>
            </div>
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

export default signUpConnector(SignUp);
