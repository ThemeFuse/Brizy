import React, { Component } from "react";
import { Context } from "visual/component/Prompts/common/GlobalApps/Context";
import { InputFields } from "visual/component/Prompts/common/GlobalApps/StepsView";
import { pendingRequest } from "visual/utils/api/editor";
import { t } from "visual/utils/i18n";

class Upload extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      fontName: "",
      nextLoading: false,
      prevLoading: false,
      error: null
    };
  }

  handleChange = (_, value) => {
    if (value.length <= 17) {
      this.setState({
        fontName: value
      });
    }
  };

  handleNext = async () => {
    const { fontName } = this.state;
    const {
      app: { id, data: appData = {} },
      onChange,
      onChangeNext
    } = this.context;

    this.setState({
      nextLoading: true
    });

    await pendingRequest();

    if (!fontName.trim()) {
      this.setState({
        nextLoading: false,
        error: t("Font Name is Required")
      });
    } else {
      onChange(id, { ...appData, fontName });
      onChangeNext();
    }
  };

  handlePrev = async () => {
    this.setState({
      prevLoading: true
    });

    await pendingRequest();
    this.context.onChangePrev();
  };

  render() {
    const { app } = this.context;
    const { fontName, prevLoading, nextLoading, error } = this.state;
    const data = [{ title: t("Font name"), value: fontName }];

    return (
      <InputFields
        {...app}
        headTitle={t("UPLOAD FONT")}
        data={data}
        error={error}
        prevLoading={prevLoading}
        nextLoading={nextLoading}
        onActive={this.handleChange}
        onNext={this.handleNext}
        onPrev={this.handlePrev}
      />
    );
  }
}

export default Upload;
