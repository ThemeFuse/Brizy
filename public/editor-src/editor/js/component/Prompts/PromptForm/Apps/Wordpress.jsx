import React from "react";
import EmailApp from "../EmailApp/index";
import { updateWpIntegration } from "visual/utils/api/integrations";

const restrictions = {
  existLists: false,
  existFields: false,
  excludePages: ["accounts", "list"]
};

class Wordpress extends EmailApp {
  updateIntegration = (form, props) => {
    const { wpApiUrl, formId } = props;

    return updateWpIntegration(formId, {
      wpApiUrl,
      body: {
        ...form
      }
    });
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
          this.setState({
            nextLoading: false,
            prevLoading: false
          });
          this.props.onClickBack();
        }
        break;

      case "done":
        this.updateIntegration(form, props).then(() => {
          this.setState({
            type,
            form,
            nextLoading: false,
            prevLoading: false
          });
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { form, list, action } = this.state;

    return (
      <div className="brz-ed-popup-body">
        {this.renderBreadCrumb()}
        {action && this.renderMessages()}
        {this.renderComponent()}
        {this.renderComponentButtons()}
      </div>
    );
  }
}

export default props => (
  <Wordpress {...props} type="linkFields" restrictions={restrictions} />
);
