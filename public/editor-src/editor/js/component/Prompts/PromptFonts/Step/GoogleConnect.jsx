import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { fontSelector } from "visual/redux/selectors2";
import { addFonts } from "visual/redux/actions2";
import {
  getGoogleFontDetails,
  getGoogleFonts,
  getGroupFontsById
} from "visual/utils/fonts";
import { Context } from "visual/component/Prompts/common/GlobalApps/Context";
import { pendingRequest } from "visual/utils/api/editor";
import InputFields from "visual/component/Prompts/common/GlobalApps/StepsView/InputFields";
import { t } from "visual/utils/i18n";

class GoogleConnect extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    const { config, blocks = {}, google = {} } = this.props.fonts;

    this.usedFonts = [
      ...(config.data || []),
      ...(google.data || []),
      ...(blocks.data || [])
    ];
    this.state = {
      selectedFont: "",
      nextLoading: false,
      prevLoading: false,
      error: null
    };
  }

  static async onBeforeLoad(context) {
    const {
      app: { id, data },
      onChange
    } = context;
    const googleFonts = await getGoogleFonts();

    onChange(id, { ...data, fonts: googleFonts });
  }

  handleAddNewFont = (name, value) => {
    this.setState({
      selectedFont: value
    });
  };

  handleNext = async () => {
    const { selectedFont } = this.state;
    const {
      app: {
        data: { fonts }
      },
      onChangeNext
    } = this.context;
    const font = fonts.find(({ family }) => family === selectedFont);

    this.setState({
      nextLoading: true,
      error: null
    });

    await pendingRequest();

    if (font) {
      // Check if Fonts was added and removed with deleted: true
      const oldFont = getGroupFontsById(
        this.props.fonts,
        getGoogleFontDetails(font).id
      );

      if (oldFont) {
        this.props.addFonts([
          {
            type: oldFont.group,
            fonts: [{ ...oldFont.font, deleted: false }]
          }
        ]);
      } else {
        this.props.addFonts([
          {
            type: "google",
            fonts: [font]
          }
        ]);
      }

      onChangeNext();
    } else {
      this.setState({
        error: `Font ${selectedFont} not found, please try again`,
        nextLoading: false
      });
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
    const { selectedFont, prevLoading, nextLoading, error } = this.state;

    const fonts = app.data.fonts
      .filter(font => {
        const { id } = getGoogleFontDetails(font);

        return !this.usedFonts.some(uFont => {
          const { id: uFontId, deleted } = getGoogleFontDetails(uFont);
          return deleted !== true && uFontId === id;
        });
      })
      .map(font => ({
        value: font.family,
        label: font.family
      }));
    const data = [
      {
        title: t("Font name"),
        type: "search",
        choices: fonts,
        value: selectedFont
      }
    ];
    const description = (
      <Fragment>
        {t("Tip: You can browse the Google font library")}{" "}
        <a
          className="brz-a"
          href="https://fonts.google.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("here")}
        </a>
        .
      </Fragment>
    );

    return (
      <InputFields
        {...app}
        data={data}
        headTitle={t("ADD GOOGLE FONT")}
        description={description}
        prevLoading={prevLoading}
        nextLoading={nextLoading}
        error={error}
        onActive={this.handleAddNewFont}
        onPrev={this.handlePrev}
        onNext={this.handleNext}
      />
    );
  }
}

const mapStateToProps = state => ({
  fonts: fontSelector(state)
});
const mapDispatchToProps = {
  addFonts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleConnect);
