import classnames from "classnames";
import produce from "immer";
import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";
import { connect, ConnectedProps } from "react-redux";
import { noop } from "underscore";
import { Alert } from "visual/component/Alert";
import CheckGroup, {
  CheckGroupItem
} from "visual/component/Controls/CheckGroup";
import InputPlaceholder from "visual/component/Controls/InputPlaceholder";
import { Spacer } from "visual/component/Controls/Spacer";
import EditorIcon from "visual/component/EditorIcon";
import { Button } from "visual/component/Prompts/common/Button";
import { Loading } from "visual/component/Prompts/common/Loading";
import Config, { isWp } from "visual/global/Config";
import { updateAuthorization, updateSyncAllowed } from "visual/redux/actions2";
import { assetUrl } from "visual/utils/asset";
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
  data: null | { img: string; signUpDescription: string };
  notice: null | { message: string; type: "error" | "success" };
  formData: {
    [k: string]: unknown;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    termsCondition: boolean;
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
      confirmPassword: "",
      termsCondition: false
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
    const { onSuccess, onClose, updateAuthorization, updateSyncAllowed } =
      this.props;
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      termsCondition
    } = this.state.formData;

    if (!termsCondition) {
      this.setState({
        nextLoading: false,
        notice: {
          message: t("Agree Terms & Conditions"),
          type: "error"
        }
      });
      return;
    }

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
      signUp({
        firstName,
        lastName,
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

            if (isWp(Config.getAll())) {
              checkCompatibility().then((r) => {
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

            <CheckGroup
              className="brz-ed-popup-authorization__terms"
              defaultValue={{
                termsCondition: this.state.formData.termsCondition
              }}
              onChange={({ termsCondition }: { termsCondition: boolean }) => {
                this.handleChange("termsCondition", termsCondition);
              }}
            >
              <CheckGroupItem
                value="termsCondition"
                renderIcons={({ active }: { active: boolean }) =>
                  active ? (
                    <EditorIcon icon="nc-check-alt" />
                  ) : (
                    <EditorIcon icon="nc-uncheck-alt" />
                  )
                }
              >
                <a
                  className="brz-a"
                  href="https://www.brizy.io/terms-and-conditions"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("I agree with Terms & Conditions")}
                </a>
              </CheckGroupItem>
            </CheckGroup>

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
