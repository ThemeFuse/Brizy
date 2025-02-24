import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Context } from "visual/component/Prompts/common/GlobalApps/Context";
import { Fields } from "visual/component/Prompts/common/GlobalApps/StepsView/Fields";
import { addFonts } from "visual/redux/actions2";
import { fontsSelector } from "visual/redux/selectors";
import { pendingRequest } from "visual/utils/api";
import { getGroupFontsById } from "visual/utils/fonts/getFontById";
import { getGoogleFonts } from "visual/utils/fonts/getGoogleFonts";
import { getGoogleFontDetails } from "visual/utils/fonts/transform";
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
      onChange,
      config
    } = context;
    const googleFonts = await getGoogleFonts({
      config,
      renderContext: "editor"
    });

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
      .filter((font) => {
        const { id } = getGoogleFontDetails(font);

        return !this.usedFonts.some((uFont) => {
          const { id: uFontId, deleted } = getGoogleFontDetails(uFont);
          return deleted !== true && uFontId === id;
        });
      })
      .map((font) => ({
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
    const descriptions = (
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
      <Fields
        {...app}
        data={data}
        headTitle={t("ADD GOOGLE FONT")}
        descriptions={descriptions}
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

const mapStateToProps = (state) => ({
  fonts: fontsSelector(state)
});

const mapDispatchToProps = {
  addFonts
};

export default connect(mapStateToProps, mapDispatchToProps)(GoogleConnect);
