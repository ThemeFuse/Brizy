import React, { Component, Fragment } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import {
  createIntegration,
  updateIntegration,
  deleteIntegrationAccount,
  getIntegration,
  getIntegrationAccount,
  getIntegrationAccountLists,
  getIntegrationAccountFields,
  getIntegrationFields
} from "visual/utils/api/integrations";
import accounts from "./Accounts";
import list from "./List";
import linkFields from "./LinkFields";
import done from "./Done";

const TABS = [accounts, list, linkFields, done];

const RESTRICTIONS = {
  existLists: true,
  existFields: true
};

class EmailApp extends Component {
  static defaultProps = {
    type: "accounts",
    apiUrl: "",
    wpApiUrl: "",
    form: {},
    list: null,
    restrictions: { ...RESTRICTIONS },
    onChange: _.noop,
    onClickBack: _.noop
  };

  constructor(props) {
    super(props);

    const { type, list, form } = this.props;
    this.state = {
      type,
      action: null,
      form,
      list,
      prevLoading: false,
      nextLoading: false,
      deletedAccountId: null,
      mounting: false
    };
  }

  componentDidMount() {
    this.setState({ mounting: true });
  }

  componentWillReceiveProps(nextProps) {
    const { id, form } = this.props;
    if (id === "wordpress" && form !== nextProps.form) {
      this.setState({
        form: nextProps.form
      });
    }
  }

  componentDidUpdate(nextProps, nextState) {
    if (
      this.state.type !== nextState.type ||
      nextState.deletedAccountId !== this.state.deletedAccountId
    ) {
      this.forceUpdate();
    }
  }

  getIntegrationList = () => {
    const { id, apiUrl } = this.props;

    return getIntegrationAccount(id, { apiUrl });
  };

  getAccountLists = account => {
    const { id: appId, apiUrl } = this.props;

    return getIntegrationAccountLists(appId, { account, apiUrl });
  };

  getAccountFields = (form, props) => {
    const { app, editorFields, apiUrl } = props;
    const {
      list,
      fields,
      account: { id }
    } = form;

    return getIntegrationAccountFields(app, {
      apiUrl,
      account: id,
      list
    });
  };

  updateIntegration = (form, props) => {
    const {
      app,
      form: {
        form: { form_id: formId }
      },
      apiUrl
    } = props;

    return updateIntegration(app, {
      apiUrl,
      formId,
      body: form
    });
  };

  deleteIntegrationAccountList = (id, props) => {
    const { id: app, apiUrl } = props;

    return deleteIntegrationAccount(app, { apiUrl, account: id });
  };

  onChange = (type, form, props) => {
    const { nextLoading = false, prevLoading = false } = props || {};
    if (nextLoading) {
      this.setState({ nextLoading });
    }
    if (prevLoading) {
      this.setState({ prevLoading });
    }

    switch (type) {
      case "accounts":
        if (form.type === "get") {
          this.getIntegrationList().then(list => {
            this.setState({
              list,
              type,
              nextLoading: false,
              prevLoading: false
            });
          });
        }
        if (form.type === "delete") {
          this.setState({ deletedAccountId: form.id });
        }
        break;
      case "list":
        this.getAccountLists(form.account.id).then(list => {
          if (list.length === 0) {
            this.onChangeAction({
              type: "error",
              message: "Lists are empty. Please add a new list and try again."
            });
            this.setState({
              nextLoading: false,
              prevLoading: false
            });
          } else {
            this.setState({
              list,
              type,
              form,
              nextLoading: false,
              prevLoading: false
            });
          }
        });
        break;
      case "linkFields":
        const { restrictions } = props;
        if (!restrictions.existLists) {
          this.setState({
            type,
            form,
            nextLoading: false,
            prevLoading: false
          });
        } else {
          this.getAccountFields(form, props).then(list => {
            if (list.length === 0) {
              this.onChangeAction({
                type: "error",
                message: "Lists are empty. Please add a new list and try again."
              });
              this.setState({
                nextLoading: false,
                prevLoading: false
              });
            } else {
              this.setState({
                list: _.sortBy(list, item => !item.required),
                type,
                form,
                nextLoading: false,
                prevLoading: false
              });
            }
          });
        }
        break;
      case "done":
        this.updateIntegration(form, props).then(({ fields }) => {
          if (!fields) {
            this.onChangeAction({
              type: "error",
              message: "Fields error don't saved"
            });
            this.setState({
              nextLoading: false,
              prevLoading: false
            });
          } else {
            const newForm = Object.assign({}, props.form, { fields });
            this.setState({ type, form: newForm });
          }
        });
        break;
      default:
        break;
    }
  };

  onChangeAction = action => this.setState({ action });

  onClick = type => this.setState({ type });

  handleCancel = () => this.setState({ deletedAccountId: null });

  handleDeleteAccount = id => {
    this.setState({ nextLoading: true });
    this.deleteIntegrationAccountList(id, this.props).then(list => {
      const { form } = this.state;

      this.setState({
        form: { ...form, account: null },
        list,
        nextLoading: false,
        deletedAccountId: null
      });
      if (list.length === 0) {
        const { id, onClickBack } = this.props;
        onClickBack(true, id);
      }
    });
  };

  renderHeader() {
    const { title, description, img } = this.props;

    return (
      <Fragment>
        <div className="brz-ed-popup-form__head">
          <img className="brz-img" src={img} title={title} />
        </div>
        <div className="brz-ed-popup-form__body">
          <p className="brz-p">{description}</p>
        </div>
      </Fragment>
    );
  }

  renderComponentButtons() {
    const { mounting, prevLoading, nextLoading, list } = this.state;
    if (!this.component || !mounting) {
      return;
    }

    return this.component.renderButtons(prevLoading, nextLoading, list);
  }

  renderComponent() {
    const {
      id,
      title,
      formId,
      fields: editorFields,
      restrictions: _restrictions,
      apiUrl,
      wpApiUrl,
      onClickBack,
      onClose
    } = this.props;
    const { form, type, list } = this.state;
    const restrictions = { ...RESTRICTIONS, ..._restrictions };
    const data = {
      ref: el => {
        this.component = el;
      },
      app: id,
      formId,
      list,
      title,
      form,
      editorFields,
      restrictions,
      apiUrl,
      wpApiUrl,
      className: "brz-ed-popup-form__footer",
      onChange: this.onChange,
      onClickBack,
      onClose
    };

    const Component = _.findWhere(TABS, { id: type });

    return <Component {...data} />;
  }

  renderBreadCrumb() {
    const { excludePages } = this.props.restrictions;
    const { type } = this.state;
    let tabs = TABS;
    if (excludePages) {
      tabs = TABS.filter(({ id }) => !excludePages.includes(id));
    }

    const items = tabs.map(({ id, title }) => {
      let current =
        type === id
          ? "brz-li brz-ed-popup-form__breadcrumbs--current"
          : "brz-li";

      return (
        <li className={current} key={id}>
          <span className="brz-span">{title}</span>
        </li>
      );
    });

    return (
      <div className="brz-ed-popup-form__breadcrumbs">
        <ul className="brz-ul">{items}</ul>
      </div>
    );
  }

  renderMessages() {
    const { type, message } = this.state.action;
    const className = classnames(
      "brz-ed-popup-form__message brz-ed-alert",
      `brz-ed-alert-${type}`
    );

    return (
      <div className={className}>
        <span className="brz-span">{message}</span>
      </div>
    );
  }

  renderDeletedPage() {
    const { deletedAccountId, nextLoading, prevLoading } = this.state;

    return (
      <div className="brz-ed-popup-body brz-ed-popup-body-connect">
        {this.renderHeader()}
        <div className="brz-ed-form-row brz-ed-popup-app-form-buttons">
          {nextLoading ? (
            <button
              key="loading"
              className="brz-button brz-ed-btn brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-red brz-ed-btn-width-1 brz-ed-btn--loading"
            >
              <EditorIcon
                icon="nc-circle-02"
                className="brz-ed-animated--spin"
              />
            </button>
          ) : (
            <button
              key="disconnect"
              className="brz-button brz-ed-btn brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-red brz-ed-btn-width-1"
              onClick={() => {
                this.handleDeleteAccount(deletedAccountId);
              }}
            >
              Disconnect
            </button>
          )}
          <button
            key="cancel"
            className="brz-button brz-ed-btn brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-default brz-ed-btn-width-1"
            onClick={nextLoading ? null : this.handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { form, list, action, deletedAccountId } = this.state;
    if (deletedAccountId !== null) {
      return this.renderDeletedPage();
    }

    const hasList = list.length > 0;
    const className = classnames("brz-ed-popup-body", {
      "brz-ed-popup-body-connect": !hasList
    });

    return (
      <div className={className}>
        {hasList ? this.renderBreadCrumb() : this.renderHeader()}
        {action && this.renderMessages()}
        {this.renderComponent()}
        {this.renderComponentButtons()}
      </div>
    );
  }
}

export default EmailApp;
