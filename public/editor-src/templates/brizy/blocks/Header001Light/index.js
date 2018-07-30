export default {
  id: "Header001Light",
  thumbnailSrc: require("./Preview.jpg"),
  thumbnailWidth: 600,
  thumbnailHeight: 311,
  title: "Header001Light",
  keywords: "header",
  cat: [0],
  type: 0,
  resolve: {
    type: "SectionHeader",
    value: {
      _styles: ["sectionHeader"],
      items: [
        {
          type: "SectionHeaderItem",
          value: {
            _styles: ["sectionHeaderItem"],
            items: [
              {
                type: "Row",
                value: {
                  _styles: ["row"],
                  items: [
                    {
                      type: "Column",
                      value: {
                        _styles: ["column"],
                        items: []
                      }
                    },
                    {
                      type: "Column",
                      value: {
                        _styles: ["column"],
                        items: []
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          type: "SectionHeaderStickyItem",
          value: {
            _styles: ["sectionHeaderStickyItem"],
            items: []
          }
        }
      ]
    }
  }
};
