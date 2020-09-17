module.exports = {
  id: "StoryTemp3Info",
  thumbnailWidth: 680,
  thumbnailHeight: 1452,
  title: "Info",
  keywords:
    "about, about us, history, team, clients, advisors, business, corporate, financial",
  cat: [0, 1],
  pro: true,
  resolve: {
    blocks: [
      {
        type: "StoryItem",
        value: {
          _styles: ["story-item"],
          items: [
            {
              type: "Wrapper",
              value: {
                _styles: ["wrapper", "wrapper--iconText"],
                items: [
                  {
                    type: "IconText",
                    value: {
                      _styles: ["iconText"],
                      items: [
                        {
                          type: "Icon",
                          value: {
                            _styles: ["icon", "iconText--icon"]
                          }
                        },
                        {
                          type: "RichText",
                          value: {
                            _styles: ["text", "iconText--text"]
                          }
                        },
                        {
                          type: "Cloneable",
                          value: {
                            _styles: [
                              "wrapper-clone",
                              "iconText--wrapper-clone--button"
                            ],
                            items: [
                              {
                                type: "Button",
                                value: {
                                  _styles: ["button", "iconText--button"]
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
};
