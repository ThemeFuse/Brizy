import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import Radio from "visual/component/controls/Radio";
import RadioItem from "visual/component/controls/Radio/RadioItem";
import { updateIntegration } from "visual/utils/api/integrations";
import { substrString } from "./utils";

class List extends Component {
  static defaultProps = {
    list: [],
    onChange: _.noop,
    onClick: _.noop,
    value: "mailchimp"
  };

  static get title() {
    return "Lists";
  }
  static get id() {
    return "list";
  }

  constructor(props) {
    super(props);
    const { form, list } = props;

    this.state = {
      list,
      active: form.list || list[0].id
    };
  }

  componentWillReceiveProps({ list, form }) {
    if (this.props.list.length !== list.length) {
      this.setState({ list });
    }
  }

  onClickBack = event => {
    event.preventDefault();
    this.props.onChange("accounts", { type: "get" }, { prevLoading: true });
  };

  onClickNext = event => {
    event.preventDefault();
    const { app, form, apiUrl, onChange } = this.props;
    let {
      fields,
      list,
      form: { form_id: formId },
      account: { id }
    } = form;
    const active = this.state.active;

    if (!list || list !== active) {
      fields = null;
      updateIntegration(app, {
        apiUrl,
        formId,
        body: {
          account: id,
          list: active
        }
      });
    }

    onChange(
      "linkFields",
      {
        ...form,
        ...{ list: active, fields }
      },
      { ...this.props, nextLoading: true }
    );
  };

  onChange = active => this.setState({ active });

  renderRadio() {
    return (
      <div className="brz-ed-form-row">
        <div className="brz-ed-popup-apps">
          <div className="brz-ed-popup-apps-row brz-ed-popup-apps-head">
            <div className="brz-ed-popup-apps-col">Select a List</div>
          </div>
          <ScrollPane
            style={{ maxHeight: 255 }}
            className="brz-ed-scroll-pane brz-ed-scroll-pane-form-list"
          >
            <Radio
              className="brz-ed-popup-form__option-radio"
              name="list"
              defaultValue={this.state.active}
              onChange={this.onChange}
            >
              {this.renderOptions()}
            </Radio>
          </ScrollPane>
        </div>
      </div>
    );
  }

  renderOptions() {
    return this.state.list.map(({ name, id }) => {
      const title = substrString(name);

      return (
        <RadioItem value={id} key={id}>
          <div className="brz-ed-popup-apps-row">
            <div className="brz-ed-popup-apps-col">{title}</div>
          </div>
        </RadioItem>
      );
    });
  }

  renderNextButton(hasList, loading) {
    return hasList && !loading ? (
      <button
        key="listContinue"
        onClick={this.onClickNext}
        className="brz-button brz-ed-btn brz-ed-btn-rounded brz-ed-btn-width-1 brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-teal"
      >
        <span className="brz-span">Continue</span>
        <EditorIcon icon="nc-arrow-right" />
      </button>
    ) : (
      <button
        key="listNextLoading"
        className="brz-button brz-ed-btn brz-ed-btn-rounded brz-ed-btn-width-1 brz-ed-btn-sm brz-ed-btn-teal brz-ed-btn--loading"
      >
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </button>
    );
  }

  renderPrevButton(hasList, loading) {
    return hasList && !loading ? (
      <button
        key="listBack"
        onClick={this.onClickBack}
        className="brz-button brz-ed-btn brz-ed-btn-icon brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-gray brz-ed-btn-icon--left brz-ed-btn-width-3"
      >
        <EditorIcon icon="nc-arrow-right" className="brz-ed-rotate--180" />
        <span className="brz-span">Back</span>
      </button>
    ) : (
      <button
        key="listPrevLoading"
        className="brz-button brz-ed-btn brz-ed-btn-sm brz-ed-btn-rounded brz-ed-btn-gray brz-ed-btn-width-3 brz-ed-btn--loading"
      >
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </button>
    );
  }

  renderError() {
    return (
      <div className="brz-ed-alert brz-ed-alert-error">
        <span className="brz-span">
          Lists are empty. Please add a new list and try again.
        </span>
      </div>
    );
  }

  renderButtons = (prevLoading, nextLoading, list) => {
    const hasList = list.length > 0;

    return (
      <div className="brz-ed-form-row brz-ed-popup-app-form-buttons brz-d-xs-flex brz-justify-content-xs-between">
        {this.renderPrevButton(hasList, prevLoading)}
        {this.renderNextButton(hasList, nextLoading)}
      </div>
    );
  };

  render() {
    const { className: _className } = this.props;
    const { list } = this.state;
    const hasList = list.length > 0;
    const className = classnames("brz-ed-popup-app-form", _className);

    return (
      <form className={className}>
        {hasList ? this.renderRadio() : this.renderError()}
      </form>
    );
  }
}

export default List;
