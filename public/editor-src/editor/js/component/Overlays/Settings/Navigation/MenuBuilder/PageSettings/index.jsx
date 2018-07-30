var _ = require("underscore"),
  React = require("react"),
  CheckBox = require("./CheckBox"),
  TextField = require("./TextField"),
  TextArea = require("./TextArea"),
  RadioButton = require("./RadioButton"),
  Select = require("./Select"),
  ProjectUtils = require("visual/helper/utils/ProjectUtils"),
  pageTypes = require("visual/global/Pages").pageTypes;

class PageSettings extends React.Component {
  static defaultProps = {
    page: null,
    onCancel: _.noop,
    onSave: _.noop,
    onDelete: _.noop
  };

  state = {
    title: "",
    description: "",
    slug: "",
    url: "",
    type: "",
    index: ""
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      var page = nextProps.page || {};
      this.setState({
        title: page.title,
        description: page.description,
        slug: page.slug,
        url: page.url,
        type: page.type,
        index: page.index,

        //needed for singlePage render
        urlAnchor: page.type === pageTypes.anchor ? page.url : "",
        urlExternal: page.type === pageTypes.external ? page.url : ""
      });
    }
  }

  setFieldValue = (key, value) => {
    var newState = {};
    newState[key] = value;
    this.setState(newState);
  };

  close = () => {
    this.props.close();
  };

  delete = () => {
    this.props.onDelete(this.props.page.id);
    this.close();
  };

  save = () => {
    var s = _.pick(
      this.state,
      "title",
      "type",
      "slug",
      "description",
      "url",
      "index"
    );
    s.url =
      this.state.type === pageTypes.anchor
        ? this.state.urlAnchor
        : this.state.urlExternal;

    this.props.onSave(this.props.page.id, s);
    this.close();
  };

  renderButtons = () => {
    var className = "brz-ed-large-popup-navigation-buttons";
    var deleteButton = <button className="brz-button" onClick={this.delete}>DELETE</button>;

    if (this.state.index) {
      className += " brz-ed-large-popup-navigation-buttons-large";
      deleteButton = null;
    }

    return (
      <div className={className}>
        <button className="brz-button" onClick={this.close}>CANCEL</button>
        {deleteButton}
        <button className="brz-button" onClick={this.save}>SAVE</button>
      </div>
    );
  };

  renderForMultiPage = () => {
    var showIfAnchor = {
      display: this.state.type === pageTypes.anchor ? "block" : "none"
    };
    var showIfInternal = {
      display: this.state.type === pageTypes.internal ? "block" : "none"
    };
    var showIfExternal = {
      display: this.state.type === pageTypes.external ? "block" : "none"
    };
    var showIfNotIndex = { display: this.state.index ? "none" : "block" };

    return (
      <div className="brz-ed-large-popup-navigation-settings">
        <div className="brz-ed-large-popup-navigation-field-wrap">
          <label className="brz-label">Title:</label>
          <TextField
            value={this.state.title}
            onChange={this.setFieldValue.bind(null, "title")}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap"
          style={showIfInternal}
        >
          <label className="brz-label">Slug:</label>
          <TextField
            value={this.state.slug}
            onChange={this.setFieldValue.bind(null, "slug")}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap brz-ed-large-popup-navigation-field-wrap-textarea"
          style={showIfInternal}
        >
          <label className="brz-label">Description (SEO):</label>
          <TextArea
            value={this.state.description}
            onChange={this.setFieldValue.bind(null, "description")}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap"
          style={showIfExternal}
        >
          <label className="brz-label">Url:</label>
          <TextField
            value={this.state.urlExternal}
            onChange={this.setFieldValue.bind(null, "urlExternal")}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap"
          style={showIfAnchor}
        >
          <label className="brz-label">Block to Anchor</label>
          <Select
            value={this.state.urlAnchor}
            onChange={this.setFieldValue.bind(null, "urlAnchor")}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap clearfix"
          style={showIfNotIndex}
        >
          <label className="brz-label">Link Type:</label>
          <RadioButton
            label="Internal"
            checked={this.state.type === pageTypes.internal}
            onChange={this.setFieldValue.bind(null, "type", pageTypes.internal)}
          />
          <RadioButton
            label="External"
            checked={this.state.type === pageTypes.external}
            onChange={this.setFieldValue.bind(null, "type", pageTypes.external)}
          />
          <RadioButton
            label="Anchor"
            checked={this.state.type === pageTypes.anchor}
            onChange={this.setFieldValue.bind(null, "type", pageTypes.anchor)}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap brz-ed-large-popup-navigation-field-wrap-set-as-home"
          style={showIfInternal}
        >
          <CheckBox
            label="Set As Home Page"
            checked={this.state.index}
            disabled={this.props.page ? this.props.page.index : false}
            onChange={this.setFieldValue.bind(null, "index")}
          />
        </div>
        {this.renderButtons()}
      </div>
    );
  };

  renderForSinglePage = () => {
    var showIfAnchor = {
      display: this.state.type === pageTypes.anchor ? "block" : "none"
    };
    var showIfExternal = {
      display: this.state.type === pageTypes.external ? "block" : "none"
    };

    return (
      <div className="brz-ed-large-popup-navigation-settings">
        <div className="brz-ed-large-popup-navigation-field-wrap">
          <label className="brz-label">Title:</label>
          <TextField
            value={this.state.title}
            onChange={this.setFieldValue.bind(null, "title")}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap"
          style={showIfExternal}
        >
          <label className="brz-label">Url:</label>
          <TextField
            value={this.state.urlExternal}
            onChange={this.setFieldValue.bind(null, "urlExternal")}
          />
        </div>
        <div
          className="brz-ed-large-popup-navigation-field-wrap"
          style={showIfAnchor}
        >
          <label className="brz-label">Block to Anchor</label>
          <Select
            value={this.state.urlAnchor}
            onChange={this.setFieldValue.bind(null, "urlAnchor")}
          />
        </div>
        <div className="brz-ed-large-popup-navigation-field-wrap clearfix">
          <label className="brz-label">Link Type:</label>
          <RadioButton
            label="External"
            checked={this.state.type === pageTypes.external}
            onChange={this.setFieldValue.bind(null, "type", pageTypes.external)}
          />
          <RadioButton
            label="Anchor"
            checked={this.state.type === pageTypes.anchor}
            onChange={this.setFieldValue.bind(null, "type", pageTypes.anchor)}
          />
        </div>
        {this.renderButtons()}
      </div>
    );
  };

  render() {
    return ProjectUtils.isMultiPage()
      ? this.renderForMultiPage()
      : this.renderForSinglePage();
  }
}

export default PageSettings;
