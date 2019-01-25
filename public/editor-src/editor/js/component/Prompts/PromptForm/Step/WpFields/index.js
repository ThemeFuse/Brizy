import React, { Component } from "react";
import { Context } from "../../Context";
import { validateEmail, updateIntegration, fakeLoading } from "../../utils";
import ViewFields from "./ViewFields";

class WPFields extends Component {
  static contextType = Context;

  constructor(props, context) {
    super(props);
    const {
      app: { data }
    } = context;

    this.state = {
      emailTo: data.emailTo || "",
      subject: data.subject || "",
      prevLoading: false,
      nextLoading: false,
      error: null
    };
  }

  handleActive = (id, value) => {
    this.setState({
      [`${id}`]: value
    });
  };

  handlePrev = async () => {
    this.setState({
      error: null,
      prevLoading: true
    });

    // Emitted fake request
    await fakeLoading();

    this.props.onChangePrev();
  };

  handleNext = async () => {
    const { emailTo, subject } = this.state;
    const { app, formId, onChange } = this.context;

    this.setState({
      error: null,
      nextLoading: true
    });

    if (!emailTo || !subject) {
      // Emitted fake request
      await fakeLoading();

      this.setState({
        error: "All fields cannot be empty",
        nextLoading: false
      });

      return;
    }

    if (!validateEmail(emailTo)) {
      // Emitted fake request
      await fakeLoading();

      this.setState({
        error: "Email is not valid",
        nextLoading: false
      });

      return;
    }

    const integrationData = await updateIntegration({
      formId,
      body: {
        ...app.data,
        emailTo,
        subject,
        completed: true
      }
    });

    onChange(app.id, { data: { ...app.data, ...integrationData } });
    this.props.onChangeNext();
  };

  render() {
    const { app } = this.context;
    const { emailTo, subject, error, nextLoading, prevLoading } = this.state;

    return (
      <ViewFields
        {...app}
        emailTo={emailTo}
        subject={subject}
        error={error}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        handleActive={this.handleActive}
        handlePrev={this.handlePrev}
        handleNext={this.handleNext}
      />
    );
  }
}

export default WPFields;
