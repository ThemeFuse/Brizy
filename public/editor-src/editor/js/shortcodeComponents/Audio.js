const { t } = global.Brizy;

export default {
  id: "audio",
  title: t("Audio"),
  icon: "nc-audio",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--audio"],
      items: [
        {
          type: "Audio",
          value: {
            _styles: ["audio"]
          }
        }
      ]
    }
  }
};
