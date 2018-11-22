import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import Radio from "visual/component/Controls/Radio";
import RadioItem from "visual/component/Controls/Radio/RadioItem";
import { updateIntegration } from "visual/utils/api/integrations";
import { substrString } from "./utils";

class Accounts extends Component {
  static defaultProps = {
    className: "",
    app: "mailchimp",
    list: [],
    onChange: _.noop,
    onClick: _.noop
  };

  static get title() {
    return "Accounts";
  }
  static get id() {
    return "accounts";
  }

  constructor(props) {
    super(props);
    const { form, list } = props;
    let activeByList = list.length > 0 ? list[0].id : null;

    this.state = {
      list,
      active: form.account ? form.account.id : activeByList
    };
  }

  componentWillReceiveProps({ list }) {
    if (this.state.list.length !== list.length) {
      let { active } = this.state;

      if (!list.filter(el => el.id === active)[0] && list.length) {
        active = list[0].id;
      }
      this.setState({ list, active });
    }
  }

  onClickNext = event => {
    event.preventDefault();
    const {
      app,
      form,
      restrictions: { existLists },
      apiUrl,
      onChange
    } = this.props;
    const { active, list } = this.state;

    if (!active) {
      return;
    }

    let data = null;

    if (!form.account || form.account.id !== active) {
      data = {
        account: {
          id: active
        },
        list: null,
        fields: null
      };

      updateIntegration(app, {
        apiUrl,
        formId: form.form.form_id,
        body: {
          account: active
        }
      });
    }

    let page = existLists ? "list" : "linkFields";
    const account = {
      account: _.findWhere(list, { id: active })
    };

    onChange(
      page,
      { ...form, ...data, ...account },
      { ...this.props, nextLoading: true }
    );
  };

  onChange = active => this.setState({ active });

  onAuth = event => {
    event.preventDefault();
    const { app, apiUrl, onChange } = this.props;

    const makeUrl = () => {
      const { userId } = GLOBAL_CONFIG;
      return `${apiUrl}/${app}/auth/login/user/${userId}`;
    };

    const makeDimensions = () => {
      const windowWidth = 600;
      const windowHeight = 600;
      const left = screen.width / 2 - windowWidth / 2;
      const top = 100;

      return `width=${windowWidth},height=${windowHeight},top=${top},left=${left}`;
    };

    const win = window.open(makeUrl(), "", makeDimensions());
    const timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        onChange("accounts", { type: "get" }, { nextLoading: true });
      }
    }, 500);
  };

  onDelete = id => {
    this.props.onChange("accounts", { type: "delete", id });
  };

  renderRadio() {
    return (
      <div className="brz-ed-form-row">
        <div className="brz-ed-popup-apps">
          <div className="brz-ed-popup-apps-row brz-ed-popup-apps-head">
            <div className="brz-ed-popup-apps-col">SELECT ACCOUNT</div>
          </div>
          <Radio
            className="brz-ed-popup-form__option-radio"
            name="list"
            defaultValue={this.state.active}
            onChange={this.onChange}
          >
            {this.renderOptions()}
          </Radio>
          <div
            className="brz-ed-popup-apps-row brz-ed-popup-app-form--add-new"
            onClick={this.onAuth}
          >
            <div className="brz-ed-popup-apps-col">
              <svg
                className="brz-icon-svg"
                xmlns="http://www.w3.org/2000/svg"
                x="0"
                y="0"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <g className="nc-icon-wrapper" fill="currentColor">
                  <path
                    fill="currentColor"
                    d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4 9H9v3H7V9H4V7h3V4h2v3h3v2z"
                  />
                </g>
              </svg>
              Connect a new account
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderOptions() {
    return this.state.list.map(({ email, id }) => {
      const title = substrString(email);

      return (
        <RadioItem value={id} key={id}>
          <div className="brz-ed-popup-apps-row">
            <div className="brz-ed-popup-apps-col">
              {title}
              <div
                className="brz-ed-form-field-feedback"
                onClick={e => this.onDelete(id, e)}
              >
                <svg
                  className="brz-icon-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                >
                  <g className="nc-icon-wrapper" fill="currentColor">
                    <path
                      fill="currentColor"
                      d="M2 6v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6H2z"
                    />
                    <path
                      datacolor="color-2"
                      fill="currentColor"
                      d="M12 3V1c0-.6-.4-1-1-1H5c-.6 0-1 .4-1 1v2H0v2h16V3h-4zm-2 0H6V2h4v1z"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </RadioItem>
      );
    });
  }

  renderButtons = (prevLoading, nextLoading, list) => {
    const hasList = list.length > 0;
    const formRowClassName = classnames(
      "brz-ed-form-row brz-ed-popup-app-form-buttons",
      {
        "brz-d-xs-flex brz-justify-content-xs-between": hasList
      }
    );

    return (
      <div className={formRowClassName}>
        {!hasList &&
          !nextLoading && (
            <button
              key="connect"
              className="brz-button brz-ed-btn brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-teal brz-ed-btn-width-1"
              onClick={this.onAuth}
            >
              Connect
            </button>
          )}
        {hasList && (
          <button
            key="back"
            className="brz-button brz-ed-btn brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-gray brz-ed-btn-icon--left brz-ed-btn-width-3"
            onClick={this.props.onClickBack}
          >
            <EditorIcon icon="nc-arrow-right" className="brz-ed-rotate--180" />
            <span className="brz-span">Back</span>
          </button>
        )}
        {nextLoading && (
          <button className="brz-button brz-ed-btn brz-ed-btn-rounded brz-ed-btn-width-1 brz-ed-btn-sm brz-ed-btn-teal brz-ed-btn--loading">
            <svg
              className="brz-icon-svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <g
                className="nc-loop_circle-02-16"
                transform="rotate(183.80428572285123 8 8)"
              >
                <path
                  opacity="0.4"
                  fill="currentColor"
                  d="M8,16c-4.4111328,0-8-3.5888672-8-8s3.5888672-8,8-8s8,3.5888672,8,8S12.4111328,16,8,16z M8,2C4.6914062,2,2,4.6914062,2,8s2.6914062,6,6,6s6-2.6914062,6-6S11.3085938,2,8,2z"
                />
                <path
                  datacolor="color-2"
                  fill="currentColor"
                  d="M16,8h-2c0-3.3085938-2.6914062-6-6-6V0C12.4111328,0,16,3.5888672,16,8z"
                />
              </g>
            </svg>
          </button>
        )}
        {!hasList && (
          <button
            key="cancel"
            className="brz-button brz-ed-btn brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-default brz-ed-btn-width-1"
            onClick={this.props.onClickBack}
          >
            Cancel
          </button>
        )}
        {hasList &&
          !nextLoading && (
            <button
              key="continue"
              className="brz-button brz-ed-btn brz-ed-btn-rounded brz-ed-btn-width-1 brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-teal"
              onClick={this.onClickNext}
            >
              <span className="brz-span">Continue</span>
              <EditorIcon icon="nc-arrow-right" />
            </button>
          )}
      </div>
    );
  };

  render() {
    const { className: _className } = this.props;
    const { list } = this.state;
    const hasList = list.length > 0;
    const className = classnames("brz-ed-popup-app-form", _className);

    return <form className={className}>{hasList && this.renderRadio()}</form>;
  }
}

export default Accounts;
