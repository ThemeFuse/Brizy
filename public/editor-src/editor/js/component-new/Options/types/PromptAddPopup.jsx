import React from "react";
import _ from "underscore";
import classnames from "classnames";
import UIState from "visual/global/UIState";
import random4 from "visual/helper/utils/MiscUtils/randomStringFragment";
import addPopup from "visual/helper/utils/popups/addPopup";
import showPopup from "visual/helper/utils/popups/showPopup";
import EditorIcon from "visual/component-new/EditorIcon";

// import deletePopup from 'visual/helper/utils/popups/deletePopup';

const ID_PREFIX = "#brz-popup-";
const VALUE_REGEX = new RegExp(`^${ID_PREFIX}([\\w]*)$`);
const TIMEOUT = 2000;

class PromptAddPopupOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    value: "",
    icon: "nc-circle-remove",
    onChange: _.noop
  };

  constructor(props) {
    super(props);
    const [, popupId = null] = VALUE_REGEX.exec(props.value) || [];

    this.state = { popupId };
  }

  handleAdd = () => {
    // this.props.toolbar.resetContent();

    UIState.set("prompt", {
      prompt: "popup",
      onChange: blockType => {
        const id = random4() + random4() + random4() + random4();

        addPopup({ id, blockType });
        showPopup(id);

        setTimeout(() => {
          this.props.onChange(`${ID_PREFIX}${id}`);
          // this.props.toolbar.resetContent();
        }, TIMEOUT);
      }
    });
  };

  handleDelete = () => {
    const { popupId } = this.state;

    this.props.onChange("");

    /*
     * ATTENTION: These lines are commented out
     * because there isn't yet a better solution
     * for popups cleanup.
     * They need to be cleaned up when deleting a block
     * that could potentially have buttons with popup links
     * or when a cloneable is removed
     */
    // setTimeout(() => {
    //   deletePopup(popupId);
    // }, TIMEOUT);
  };

  handleEdit = () => {
    // this.props.toolbar.resetContent();
    showPopup(this.state.popupId);
  };

  renderIcon = () => {
    return (
      <div className="brz-ed-toolbar__link__icon">
        <EditorIcon icon={this.props.icon} />
      </div>
    );
  };

  render() {
    const title = this.state.popupId ? (
      <div className="brz-ed-toolbar__link__title" onClick={this.handleEdit}>
        Click to edit popup
      </div>
    ) : (
      <div className="brz-ed-toolbar__link__title" onClick={this.handleAdd}>
        Click to add popup
      </div>
    );

    const icons = this.state.popupId ? (
      [
        <div
          key="edit"
          className="brz-ed-toolbar__link--save brz-ed-toolbar--active"
          onClick={this.handleEdit}
        >
          <EditorIcon icon="nc-cog" />
        </div>,
        <div
          key="delete"
          className="brz-ed-toolbar__link--save brz-ed-toolbar--active"
          onClick={this.handleDelete}
        >
          <EditorIcon icon="nc-trash" />
        </div>
      ]
    ) : (
      <div
        key="edit"
        className="brz-ed-toolbar__link--save"
        onClick={this.handleAdd}
      >
        <EditorIcon icon="nc-arrow-right" />
      </div>
    );

    const { className: _className, attr: _attr, icon } = this.props;

    const className = classnames(
      "brz-ed-toolbar__link__popup",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        {icon ? this.renderIcon() : null}
        {title}
        {icons}
      </div>
    );
  }
}

export default PromptAddPopupOptionType;
