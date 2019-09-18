module.exports = {
  id: "FlavourReservations",
  thumbnailWidth: 680,
  thumbnailHeight: 782,
  title: "Reservations",
  keywords:
    "reservations, flavour, Food, restaurant, catering, delivery, dining",
  cat: [0, 10],
  pro: true,
  resolve: {
    blocks: [
      {
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                items: [
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text:
                              '<p class="brz-tp-heading6 brz-text-lg-center brz-text-xs-center"><span class="brz-cp-color2">BOOK A TABLE</span></p>'
                          }
                        }
                      ],
                      marginBottom: 10,
                      marginBottomSuffix: "px",
                      margin: 0,
                      animationName: "fadeInDown",
                      tempAnimationName: "fadeInDown",
                      animationDuration: 900,
                      animationDelay: 0
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text:
                              '<h1 class="brz-text-xs-center brz-tp-heading2 brz-text-lg-center"><span class="brz-cp-color2">Request Reservation</span></h1>'
                          }
                        }
                      ],
                      marginTop: 0,
                      marginTopSuffix: "px",
                      margin: 0,
                      marginBottom: 10,
                      marginBottomSuffix: "px",
                      animationName: "fadeInUp",
                      tempAnimationName: "fadeInUp",
                      animationDuration: 900,
                      animationDelay: 0
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text:
                              '<p class="brz-text-xs-center brz-tp-paragraph brz-text-lg-center"><span class="brz-cp-color2">Vivamus hendrerit arcu erat molestie vehicula. Sed auctor nequeu tellus rhoncus retut eleifcibendend nibh porttitor. Ut in nulla enim haret mirolestie magna non lorem</span></p>'
                          }
                        }
                      ],
                      marginRight: 300,
                      marginRightSuffix: "px",
                      margin: 0,
                      marginLeft: 300,
                      marginLeftSuffix: "px"
                    }
                  }
                ],
                paddingType: "ungrouped",
                paddingTop: 60,
                paddingBottom: 70,
                padding: 75
              }
            }
          ]
        },
        blockId: "Blank000Light"
      },
      {
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                items: [
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--iconText"],
                      items: [
                        {
                          type: "Form",
                          value: {
                            _styles: ["form"],
                            items: [
                              {
                                type: "FormFields",
                                value: {
                                  items: [
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Text",
                                        label: "NAME ON RESERVATION",
                                        required: "on",
                                        options: ["Option 1", "Option 2"],
                                        width: 50
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Email",
                                        label: "EMAIL ADDRESS",
                                        required: "on",
                                        options: ["Option 1", "Option 2"],
                                        width: 50
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Text",
                                        label: "DATE",
                                        required: "on",
                                        options: ["Option 1", "Option 2"],
                                        width: 30
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Number",
                                        label: "PARTY OF",
                                        required: "on",
                                        options: ["Option 1", "Option 2"],
                                        width: 20
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Number",
                                        label: "PHONE NUMBER",
                                        required: "off",
                                        options: ["Option 1", "Option 2"],
                                        width: 50
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Paragraph",
                                        label: "MESSAGE",
                                        required: "off",
                                        options: ["Option 1", "Option 2"]
                                      }
                                    }
                                  ],
                                  borderColorPalette: "color8",
                                  bgColorHex: "#ffffff",
                                  bgColorOpacity: 0,
                                  bgColorPalette: "",
                                  colorPalette: "color8",
                                  colorHex: "#ffffff",
                                  colorOpacity: 1,
                                  fontStyle: "button",
                                  mobileFontStyle: "",
                                  padding: 20,
                                  paddingRight: 20,
                                  paddingBottom: 20,
                                  paddingLeft: 20
                                }
                              },
                              {
                                type: "Button",
                                value: {
                                  _styles: ["button", "submit"],
                                  text: "SUBMIT",
                                  colorPalette: "color1",
                                  colorOpacity: 1,
                                  iconName: "",
                                  iconType: "",
                                  borderRadiusType: "custom",
                                  tempBorderRadiusType: "custom",
                                  paddingRight: 42,
                                  paddingLeft: 42,
                                  fillType: "filled",
                                  borderRadius: 0,
                                  borderWidth: 2,
                                  borderColorOpacity: 1,
                                  borderColorPalette: "color3",
                                  bgColorOpacity: 1,
                                  bgColorPalette: "color3",
                                  hoverBgColorOpacity: 1,
                                  hoverBorderColorOpacity: 0.8000000000000000444089209850062616169452667236328125,
                                  tempBorderRadius: 0,
                                  tempMobileBorderRadius: 0,
                                  hoverBgColorPalette: "color8",
                                  hoverBorderColorPalette: "",
                                  tempHoverBorderColorPalette: "",
                                  hoverBgColorHex: "#ffffff",
                                  tempHoverBgColorOpacity: 1,
                                  tempHoverBgColorPalette: "color3",
                                  hoverBorderColorHex: "#ffffff",
                                  hoverColorPalette: "color3",
                                  hoverColorOpacity: 1
                                }
                              }
                            ],
                            mobileHorizontalAlign: "center"
                          }
                        }
                      ]
                    }
                  }
                ],
                bgColorPalette: "color1",
                bgColorHex: "#0d0d0d",
                bgColorOpacity: 0.6999999999999999555910790149937383830547332763671875,
                tempBgColorOpacity: 0.6999999999999999555910790149937383830547332763671875,
                bgImageWidth: 1920,
                bgImageHeight: 900,
                bgImageSrc: "733c933c65b08a58c4aa4179bedcfc16.jpg",
                bgPositionX: 50,
                bgPositionY: 50,
                tempMobileBgColorOpacity: 1,
                paddingType: "ungrouped",
                paddingTop: 140,
                paddingBottom: 140,
                padding: 75,
                containerSize: 70,
                bgPopulation: ""
              }
            }
          ]
        },
        blockId: "Blank000Light"
      },
      {
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                items: [
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--map"],
                      items: [
                        {
                          type: "Map",
                          value: {
                            _styles: ["map"],
                            height: 500,
                            mobileHeight: 300
                          }
                        }
                      ],
                      marginTop: 0,
                      marginTopSuffix: "px",
                      margin: 0,
                      marginBottom: 0,
                      marginBottomSuffix: "px"
                    }
                  }
                ],
                padding: 0,
                paddingTop: 0,
                paddingBottom: 0,
                containerType: "fullWidth"
              }
            }
          ]
        },
        blockId: "Blank000Light"
      }
    ]
  }
};
