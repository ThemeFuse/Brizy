module.exports = {
  id: "StoryTempRome",
  thumbnailWidth: 680,
  thumbnailHeight: 726,
  title: "Rome",
  keywords:
    "about, about us, history, team, clients, advisors, business, corporate, financial",
  cat: [0, 1],
  resolve: {
    blocks: [
      {
        type: "StoryItem",
        value: {
          _styles: ["story-item"],
          items: [
            {
              type: "Cloneable",
              value: {
                _styles: ["wrapper-clone", "wrapper-clone--icon"],
                items: [
                  {
                    type: "Icon",
                    value: {
                      _styles: ["icon"]
                    }
                  }
                ]
              }
            },
            {
              type: "Cloneable",
              value: {
                _styles: ["wrapper-clone", "wrapper-clone--button"],
                items: [
                  {
                    type: "Button",
                    value: {
                      _styles: ["button"]
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
