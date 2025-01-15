import classnames from "classnames";
import { produce } from "immer";
import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import { ConnectedProps, connect } from "react-redux";
import { noop } from "underscore";
import { Alert } from "visual/component/Alert";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { Spacer } from "visual/component/Controls/Spacer";
import { Button } from "visual/component/Prompts/common/Button";
import { Loading } from "visual/component/Prompts/common/Loading";
import { updateAuthorization, updateSyncAllowed } from "visual/redux/actions2";
import { t } from "visual/utils/i18n";
import { setAuthorized } from "visual/utils/user/getAuthorized";
import { validateEmail } from "../common/utils";
import { checkCompatibility, signUp } from "./api";
import { AuthorizationField, SignAuthorizationProps } from "./types";

const fields: AuthorizationField[] = [
  {
    title: "first name",
    name: "firstName",
    required: true
  },
  {
    title: "last name",
    name: "lastName",
    required: true
  },
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

interface SignUpState {
  nextLoading: boolean;
  loading: boolean;
  data: null | { signUpDescription: string };
  notice: null | { message: string; type: "error" | "success" };
  formData: {
    [k: string]: unknown;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
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

  handleChange = <T extends SignUpState["formData"], K extends keyof T>(
    k: K,
    v: T[K]
  ): void => {
    this.setState(
      produce((draft) => {
        draft.formData[k] = v;
      })
    );
  };

  handleConnect = async (): Promise<void> => {
    const {
      onSuccess,
      onClose,
      updateAuthorization,
      updateSyncAllowed,
      checkCompatibilityAfter,
      config
    } = this.props;
    const { email, password, confirmPassword, firstName, lastName } =
      this.state.formData;

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

    if (
      email.trim() &&
      password.trim() &&
      confirmPassword.trim() &&
      firstName.trim() &&
      lastName.trim()
    ) {
      signUp(
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword
        },
        config
      )
        .then((r: Response) => {
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
        .catch((e: unknown) => {
          this.setState({
            nextLoading: false,
            notice: {
              message: t("Something went wrong"),
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
    return <Loading />;
  }

  renderNotice(): React.ReactElement | undefined {
    const { notice } = this.state;

    if (notice) {
      const { message, type } = notice;

      return <Alert message={message} type={type} />;
    }
  }

  renderContent(): React.ReactElement | undefined {
    if (this.state.data) {
      const {
        data: { signUpDescription },
        nextLoading
      } = this.state;

      return (
        <Scrollbars className="brz-text-lg-center">
          <div className="brz-ed-popup-integrations__connect-head">
            <Spacer space="17px" />
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
