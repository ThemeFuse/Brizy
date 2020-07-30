import React, { Component } from "react";
import _ from "underscore";
import { connect } from "react-redux";
import { addFonts } from "visual/redux/actions2";
import { uuid } from "visual/utils/uuid";
import { pendingRequest } from "visual/utils/api/editor";
import { weightTypes } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { Context } from "visual/component/Prompts/common/GlobalApps/Context";
import { createFont } from "visual/component/Prompts/PromptFonts/api";
import ViewAdd from "./ViewAdd";
import ViewEdit from "./ViewEdit";

const getWeights = _.memoize(weights => {
  return Object.entries(weights).map(([name, title]) => ({
    title,
    name
  }));
});

class Variation extends Component {
  static contextType = Context;

  state = {
    mode: "add",
    keyValue: this.getDefaultData(),
    nextLoading: false,
    prevLoading: false,
    addLoading: false,
    error: null
  };

  getDefaultData() {
    return {
      weight: "400",
      ttf: "",
      eot: "",
      woff: "",
      woff2: ""
    };
  }

  getAddData() {
    const { weight, ttf, eot, woff, woff2 } = this.state.keyValue;

    return [
      {
        title: t("Font weight"),
        name: "weight",
        type: "select",
        value: weight,
        choices: getWeights(weightTypes)
      },
      {
        title: t("TTF File"),
        name: "ttf",
        value: ttf,
        type: "upload",
        accept: ".ttf",
        helper:
          "The Web Open Font Format (TTF) is a format used in web pages by modern browsers."
      },
      {
        title: t("EOT File"),
        name: "eot",
        value: eot,
        type: "upload",
        accept: ".eot",
        helper:
          "The Web Open Font Format (EOT) is a format used in web pages by modern browsers."
      },
      {
        title: t("WOFF File"),
        name: "woff",
        value: woff,
        type: "upload",
        accept: ".woff",
        helper:
          "The Web Open Font Format (WOFF) is a format used in web pages by modern browsers."
      },
      {
        title: t("WOFF2 File"),
        name: "woff2",
        value: woff2,
        type: "upload",
        accept: ".woff2",
        helper:
          "The Web Open Font Format (WOFF2) is a format used in web pages by modern browsers."
      }
    ];
  }

  getEditData() {
    const {
      data: { fontName, weights }
    } = this.context.app;

    return weights.map(weight => ({
      id: weight,
      title: fontName,
      type: weightTypes[weight]
    }));
  }

  handleChangeAddMode = async () => {
    this.setState({
      addLoading: true
    });

    await pendingRequest();

    this.setState({
      mode: "add",
      addLoading: false
    });
  };

  handleUploadFonts = (name, file) => {
    this.setState(({ keyValue }) => ({
      error: null,
      keyValue: {
        ...keyValue,
        [`${name}`]: file
      }
    }));
  };

  handleAddFonts = async () => {
    const {
      app: { id, data },
      onChange
    } = this.context;
    const { weight, ...files } = this.state.keyValue;

    this.setState({
      nextLoading: true,
      error: null
    });

    await pendingRequest();

    if (!Object.values(files).some(file => Boolean(file))) {
      this.setState({
        nextLoading: false,
        error: t("You must be have one font added")
      });
      return;
    }

    let weightsMap = new Set([...(data.weights || []), Number(weight)]);

    const newData = Object.assign({}, data, {
      weights: [...weightsMap],
      files: { ...(data.files || []), [weight]: files }
    });

    onChange(id, newData);

    this.setState({
      mode: "edit",
      keyValue: this.getDefaultData(),
      nextLoading: false
    });
  };

  handleRemoveFonts = id => {
    const {
      app: { id: appId, data },
      onChange
    } = this.context;

    const newData = Object.assign({}, data, {
      weights: _.without(data.weights, id),
      files: _.omit(data.files, id)
    });

    onChange(appId, newData);
  };

  handleNext = async () => {
    const {
      app: {
        data: { files, fontName }
      },
      onChangeNext
    } = this.context;

    this.setState({
      nextLoading: true
    });

    const { status, data } = await createFont({
      id: uuid(),
      name: fontName,
      files
    });

    if (status !== 200) {
      this.setState({
        nextLoading: false,
        error: t("Something went wrong")
      });
    } else {
      this.props.dispatch(addFonts([{ type: "upload", fonts: [data] }]));
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
    const { mode, nextLoading, prevLoading, addLoading, error } = this.state;

    return mode === "add" ? (
      <ViewAdd
        data={this.getAddData()}
        error={error}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        onNext={this.handleAddFonts}
        onPrev={this.handlePrev}
        onActive={this.handleUploadFonts}
      />
    ) : (
      <ViewEdit
        data={this.getEditData()}
        error={error}
        nextLoading={nextLoading}
        prevLoading={prevLoading}
        createLoading={addLoading}
        onNext={this.handleNext}
        onPrev={this.handlePrev}
        onCreate={this.handleChangeAddMode}
        onActive={this.handleRemoveFonts}
      />
    );
  }
}

export default connect()(Variation);
