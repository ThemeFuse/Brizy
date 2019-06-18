(function() {
  Brizy.registerThirdPartyElementToolbar("Comments", {
    avatar: getToolbarAvatar(),
    content: getToolbarContent()
  });

  function getToolbarAvatar() {
    function getItemsForDesktop(v) {
      return [
        {
          id: "toolbarAvatar",
          type: "popover",
          icon: "nc-img",
          title: "Image",
          position: 80,
          options: [
            {
              id: "avatarSize",
              label: "Size",
              type: "radioGroup",
              choices: [
                {
                  value: "48",
                  icon: "nc-small"
                },
                {
                  value: "56",
                  icon: "nc-medium"
                },
                {
                  value: "64",
                  icon: "nc-large"
                }
              ],
              value: v.avatarSize,
              onChange(value) {
                return {
                  avatarSize: value
                };
              }
            },
            {
              id: "avatarRadius",
              label: "Corner",
              type: "radioGroup",
              choices: [
                {
                  value: "square",
                  icon: "nc-corners-square"
                },
                {
                  value: "rounded",
                  icon: "nc-corners-round"
                }
              ],
              value: v.avatarRadius,
              onChange(value) {
                return {
                  avatarRadius: value
                };
              }
            },
            {
              id: "avatarSpacing",
              label: "Spacing",
              type: "slider",
              slider: {
                min: 0,
                max: 100
              },
              input: {
                show: true
              },
              suffix: {
                show: true,
                choices: [
                  {
                    title: "px",
                    value: "px"
                  }
                ]
              },
              value: {
                value: v.avatarSpacing
              },
              onChange: ({ value: avatarSpacing }) => {
                return {
                  avatarSpacing
                };
              }
            }
          ]
        },

        {
          id: "toolbarSettings",
          type: "popover",
          icon: "nc-cog",
          options: [
            {
              id: "numComments",
              label: "How Many",
              type: "select",
              choices: [
                {
                  title: "1",
                  value: "1"
                },
                {
                  title: "3",
                  value: "3"
                },
                {
                  title: "5",
                  value: "5"
                }
              ],
              value: v.numComments,
              onChange(value) {
                return {
                  numComments: value
                };
              }
            }
          ]
        }
      ];
    }

    function getItemsForTablet(v) {
      return [];
    }

    function getItemsForMobile(v) {
      return [];
    }

    return {
      getItemsForDesktop,
      getItemsForTablet,
      getItemsForMobile
    };
  }

  function getToolbarContent() {
    function getItemsForDesktop(v) {
      return [
        {
          id: "toolbarContent",
          type: "popover",
          icon: "nc-font",
          title: "Content Text",
          position: 80,
          options: [
            {
              id: "contentColor",
              label: "Text Color",
              type: "select",
              choices: [
                {
                  title: "Red",
                  value: "red"
                },
                {
                  title: "Green",
                  value: "green"
                },
                {
                  title: "Black",
                  value: "black"
                }
              ],
              value: v.contentColor,
              onChange(value) {
                return {
                  contentColor: value
                };
              }
            }
          ]
        }
      ];
    }

    function getItemsForTablet(v) {
      return [];
    }

    function getItemsForMobile(v) {
      return [];
    }

    return {
      getItemsForDesktop,
      getItemsForTablet,
      getItemsForMobile
    };
  }
})();
