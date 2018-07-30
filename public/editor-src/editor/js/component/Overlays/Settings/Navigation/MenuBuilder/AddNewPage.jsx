var React = require("react"),
  jQuery = require("jquery"),
  ProjectUtils = require("visual/helper/utils/ProjectUtils");

class AddNewPage extends React.Component {
  static defaultProps = { onSubmit: function() {} };
  state = { opened: false };

  close = () => {
    this.setState({ opened: false });
  };

  handleBlur = () => {
    this.close();
  };

  handleClick = e => {
    e.preventDefault();
    this.open();
  };

  handleKeyUp = e => {
    if (e.keyCode === 13) {
      // ENTER KEY
      this.submit();
    } else if (e.keyCode === 27) {
      // ESC KEY
      this.close();
    }
  };

  open = () => {
    this.setState({ opened: true }, function() {
      jQuery(this.input).focus();
    });
  };

  submit = () => {
    var value = this.input.value;
    if (value) {
      this.props.onSubmit(value);
    }
    this.close();
  };

  render() {
    var content;

    if (this.state.opened) {
      content = (
        <div>
          <i className="brz-ed-icon-nav-new-page" />
          <input
            ref={el => {
              this.input = el;
            }}
            className="brz-input"
            type="text"
            placeholder={
              ProjectUtils.isMultiPage() ? "Page Title" : "Anchor Title"
            }
            onKeyUp={this.handleKeyUp}
            onBlur={this.handleBlur}
          />
          <button
            className="brz-button brz-ed-icon-arrow-save"
            onMouseDown={this.submit}
          />
        </div>
      );
    } else {
      content = (
        <a
          href="#"
          className="brz-a brz-ed-large-popup-navigation-add-page-link"
          onClick={this.handleClick}
        >
          <i />
          <span className="brz-span">Add New {ProjectUtils.isMultiPage() ? "Page" : "Anchor"}</span>
        </a>
      );
    }

    return (
      <div className="brz-ed-large-popup-navigation-add-page">{content}</div>
    );
  }
}

export default AddNewPage;
