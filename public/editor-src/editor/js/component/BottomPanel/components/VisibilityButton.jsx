import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { hiddenElementsSelector } from "visual/redux/selectors";
import { updateHiddenElements } from "visual/redux/actions";

class VisibilityButton extends React.Component {
  componentDidMount() {
    const { showHiddenElements } = this.props;
    this.setCSS(showHiddenElements);
  }

  setCSS(showHiddenElements) {
    if (showHiddenElements) {
      document.body.style.removeProperty("--elements-visibility");

      return;
    }

    document.body.style.setProperty("--elements-visibility", "none");
  }

  handleChange = () => {
    const { showHiddenElements, updateHiddenElements } = this.props;

    this.setCSS(!showHiddenElements);
    updateHiddenElements(!showHiddenElements);
  };

  render() {
    const icon = this.props.showHiddenElements ? "nc-eye-17" : "nc-eye-ban-18";

    return (
      <li
        className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__hidden_elements"
        onClick={this.handleChange}
      >
        <EditorIcon icon={icon} />
      </li>
    );
  }
}

const mapStateToProps = state => ({
  showHiddenElements: hiddenElementsSelector(state)
});

const mapDispatchToProps = dispatch => ({
  updateHiddenElements: value => dispatch(updateHiddenElements(value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibilityButton);
