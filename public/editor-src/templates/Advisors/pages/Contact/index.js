module.exports = {
  id: "AdvisorsContact",
  thumbnailWidth: 680,
  thumbnailHeight: 1120,
  title: "Contact",
  keywords:
    "contact, location, address, advisors, business, corporate, financial",
  cat: [0, 1],
  pro: true,
  resolve: {
    blocks: [
      {
        blockId: "Gabi041Light",
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                bgColorHex: "#ffffff",
                paddingTop: 220,
                paddingBottom: 220,
                bgVideo: "https://www.youtube.com/watch?v=8lQB3Had90A",
                tempBgColorOpacity: 0.200000000000000011102230246251565404236316680908203125,
                padding: 168,
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
                              '<h1 class="brz-fs-xs-50 brz-tp-heading1 brz-text-lg-center"><span class="brz-cp-color1">Contact Us</span></h1>'
                          }
                        }
                      ],
                      marginBottom: 0,
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
                              '<h1 class="brz-fs-xs-18 brz-text-lg-center brz-tp-abovetitle"><span class="brz-cp-color1">LET US KNOW HOW WE CAN HELP</span></h1>'
                          }
                        }
                      ],
                      marginTop: 0,
                      animationName: "fadeInUp",
                      tempAnimationName: "fadeInUp",
                      animationDuration: 900,
                      animationDelay: 0
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--spacer"],
                      items: [
                        {
                          type: "Spacer",
                          value: {
                            _styles: ["spacer"],
                            height: 20
                          }
                        }
                      ]
                    }
                  }
                ],
                containerSize: 60,
                paddingType: "ungrouped",
                mobileBgColorOpacity: 0.34999999999999997779553950749686919152736663818359375,
                mobileBgPositionX: 67,
                mobileBgColorPalette: "color8",
                mobilePadding: 53,
                mobilePaddingTop: 53,
                mobilePaddingBottom: 53,
                mobileBgPositionY: 54,
                bgImageWidth: 1920,
                bgImageHeight: 830,
                bgImageSrc: "e26e98ecd3afd563f8cd919358057fbc.jpg",
                bgColorOpacity: 0,
                bgPositionX: 50,
                bgPositionY: 50,
                tempMobileBgColorOpacity: 1,
                bgColorPalette: ""
              }
            }
          ],
          sliderDotsColorPalette: "color1",
          sliderArrowsColorPalette: "color1",
          sliderArrowsColorHex: "#042935"
        }
      },
      {
        blockId: "Gabi035Light",
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                bgColorHex: "#ffffff",
                bgColorOpacity: 1,
                items: [
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--spacer"],
                      items: [
                        {
                          type: "Spacer",
                          value: {
                            _styles: ["spacer"],
                            height: 20
                          }
                        }
                      ],
                      showOnMobile: "off"
                    }
                  },
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
                                        label: "Email Address",
                                        options: ["Option 1", "Option 2"],
                                        width: 50
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        label: "Phone Number",
                                        required: false,
                                        options: ["Option 1", "Option 2"],
                                        width: 50,
                                        type: "Email"
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        label: "Subject",
                                        required: false,
                                        options: [
                                          "Freelance",
                                          "Business",
                                          "Affiliate"
                                        ]
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Paragraph",
                                        label: "Message",
                                        required: false,
                                        options: ["Option 1", "Option 2"],
                                        height: 140
                                      }
                                    }
                                  ],
                                  fontStyle: "paragraph",
                                  fontWeight: 300,
                                  lineHeight: 1.6999999999999999555910790149937383830547332763671875,
                                  mobileFontSize: 16,
                                  bgColorPalette: "color8",
                                  colorPalette: "color7",
                                  borderColorPalette: "color7",
                                  borderColorHex: "#73777f",
                                  borderColorOpacity: 0.200000000000000011102230246251565404236316680908203125,
                                  padding: 25,
                                  paddingRight: 25,
                                  paddingBottom: 25,
                                  paddingLeft: 25,
                                  mobilePadding: 21,
                                  mobilePaddingRight: 21,
                                  mobilePaddingBottom: 21,
                                  mobilePaddingLeft: 21,
                                  mobileLetterSpacing: 0,
                                  mobileFontWeight: 300,
                                  mobileLineHeight: 1.8000000000000000444089209850062616169452667236328125
                                }
                              },
                              {
                                type: "Button",
                                value: {
                                  _styles: ["button", "submit"],
                                  iconName: "",
                                  iconType: "",
                                  hoverBgColorOpacity: 1,
                                  tempHoverBgColorOpacity: 1,
                                  hoverBgColorHex: "#142850",
                                  hoverBorderColorOpacity: 1,
                                  hoverBorderColorHex: "#142850",
                                  text: "SEND NOW",
                                  size: "custom",
                                  fontSize: 15,
                                  paddingRL: 65,
                                  paddingRight: 65,
                                  paddingLeft: 65,
                                  tempPaddingRL: 65,
                                  tempPaddingRight: 65,
                                  tempPaddingLeft: 65,
                                  hoverBgColorPalette: "color1",
                                  hoverBorderColorPalette: "color1",
                                  tempHoverBorderColorPalette: "color1",
                                  paddingTB: 15,
                                  paddingTop: 15,
                                  paddingBottom: 15,
                                  tempPaddingTB: 15,
                                  tempPaddingTop: 15,
                                  tempPaddingBottom: 15,
                                  mobileSize: "medium",
                                  mobileFontSize: 15,
                                  mobilePaddingTB: 14,
                                  mobilePaddingTop: 14,
                                  mobilePaddingBottom: 14,
                                  tempMobilePaddingTB: 14,
                                  tempMobilePaddingTop: 14,
                                  tempMobilePaddingBottom: 14,
                                  mobilePaddingRL: 42,
                                  mobilePaddingRight: 42,
                                  mobilePaddingLeft: 42,
                                  tempMobilePaddingRL: 42,
                                  tempMobilePaddingRight: 42,
                                  tempMobilePaddingLeft: 42,
                                  mobileLetterSpacing: 3,
                                  mobileFontWeight: 600,
                                  mobileFontStyle: ""
                                }
                              }
                            ],
                            horizontalAlign: "center"
                          }
                        }
                      ]
                    }
                  }
                ],
                containerSize: 60,
                paddingType: "ungrouped",
                paddingBottom: 60
              }
            }
          ]
        }
      },
      {
        blockId: "Blank000Light",
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
                    type: "Row",
                    value: {
                      _styles: ["row", "hide-row-borders", "padding-0"],
                      items: [
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
                            items: [
                              {
                                type: "Wrapper",
                                value: {
                                  _styles: ["wrapper", "wrapper--line"],
                                  items: [
                                    {
                                      type: "Line",
                                      value: {
                                        _styles: ["line"],
                                        width: 100,
                                        borderWidth: 3,
                                        borderColorPalette: "color3",
                                        borderColorHex: "#0d91bb",
                                        borderColorOpacity: 1
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            paddingRight: 0,
                            paddingLeft: 0,
                            width: 50
                          }
                        },
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
                            items: [
                              {
                                type: "Wrapper",
                                value: {
                                  _styles: ["wrapper", "wrapper--line"],
                                  items: [
                                    {
                                      type: "Line",
                                      value: {
                                        _styles: ["line"],
                                        width: 100,
                                        borderWidth: 3,
                                        borderColorPalette: "color5",
                                        borderColorHex: "#0d91bb",
                                        borderColorOpacity: 1
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            paddingRight: 0,
                            paddingLeft: 0,
                            showOnMobile: "off",
                            width: 50
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--spacer"],
                      items: [
                        {
                          type: "Spacer",
                          value: {
                            _styles: ["spacer"]
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: "Row",
                    value: {
                      _styles: ["row", "hide-row-borders", "padding-0"],
                      items: [
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
                            items: [
                              {
                                type: "Cloneable",
                                value: {
                                  _styles: [
                                    "wrapper-clone",
                                    "wrapper-clone--icon"
                                  ],
                                  items: [
                                    {
                                      type: "Icon",
                                      value: {
                                        _styles: ["icon"],
                                        name: "newsletter",
                                        type: "outline"
                                      }
                                    }
                                  ]
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
                                          '<p class="brz-text-lg-center brz-tp-heading4 brz-fs-xs-25"><span class="brz-cp-color1">Information</span></p>'
                                      }
                                    }
                                  ]
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
                                          '<p class="brz-text-lg-center brz-tp-paragraph brz-mb-lg-0 brz-fs-xs-17"><span class="brz-cp-color4">Tel: 0253.567.363</span></p><p class="brz-text-lg-center brz-tp-paragraph brz-fs-xs-17"><span class="brz-cp-color4">Email: office@the-advisors.net</span></p><p class="brz-text-lg-center brz-tp-paragraph brz-fs-xs-17"><span class="brz-cp-color4">Fax: 0638.998.464</span></p>'
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            width: 33.2999999999999971578290569595992565155029296875,
                            borderWidthType: "ungrouped",
                            borderRightWidth: 1,
                            tempBorderRightWidth: 1,
                            tempBorderLeftWidth: 0,
                            tempBorderBottomWidth: 0,
                            tempBorderTopWidth: 0,
                            borderColorOpacity: 1,
                            borderColorPalette: "color5",
                            borderColorHex: "",
                            mobilePaddingRight: 10,
                            mobilePaddingLeft: 10
                          }
                        },
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
                            items: [
                              {
                                type: "Cloneable",
                                value: {
                                  _styles: [
                                    "wrapper-clone",
                                    "wrapper-clone--icon"
                                  ],
                                  items: [
                                    {
                                      type: "Icon",
                                      value: {
                                        _styles: ["icon"],
                                        name: "map-pin",
                                        type: "outline"
                                      }
                                    }
                                  ]
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
                                          '<p class="brz-tp-heading4 brz-text-lg-center brz-fs-xs-25"><span class="brz-cp-color1">Address</span></p>'
                                      }
                                    }
                                  ]
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
                                          '<p class="brz-text-lg-center brz-tp-paragraph brz-fs-xs-17"><span class="brz-cp-color4">New York City,</span></p><p class="brz-tp-paragraph brz-text-lg-center brz-fs-xs-17"><span class="brz-cp-color4">68 Beaver Ridge Court Suite 3&nbsp;</span></p><p class="brz-text-lg-center brz-tp-paragraph brz-fs-xs-17"><span class="brz-cp-color4">Bozeman, MT 59715</span></p>'
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            width: 33.2999999999999971578290569595992565155029296875,
                            borderWidthType: "ungrouped",
                            borderRightWidth: 1,
                            tempBorderRightWidth: 1,
                            tempBorderLeftWidth: 0,
                            tempBorderBottomWidth: 0,
                            tempBorderTopWidth: 0,
                            borderColorOpacity: 1,
                            borderColorPalette: "color5",
                            borderColorHex: "",
                            mobilePaddingRight: 10,
                            mobilePaddingLeft: 10
                          }
                        },
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
                            items: [
                              {
                                type: "Cloneable",
                                value: {
                                  _styles: [
                                    "wrapper-clone",
                                    "wrapper-clone--icon"
                                  ],
                                  items: [
                                    {
                                      type: "Icon",
                                      value: {
                                        _styles: ["icon"],
                                        name: "time-clock",
                                        type: "outline"
                                      }
                                    }
                                  ]
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
                                          '<p class="brz-tp-heading4 brz-text-lg-center brz-fs-xs-25"><span class="brz-cp-color1">Schedule</span></p>'
                                      }
                                    }
                                  ]
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
                                          '<p class="brz-text-lg-center brz-tp-paragraph brz-fs-xs-17"><span class="brz-cp-color4">M-T: 08:00 - 17:00</span></p><p class="brz-text-lg-center brz-tp-paragraph brz-fs-xs-17"><span class="brz-cp-color4">F: 08:00 - 15:00</span></p><p class="brz-text-lg-center brz-tp-paragraph brz-fs-xs-17"><span class="brz-cp-color4">S: 08:00 - 13:00</span></p>'
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            width: 33.39999999999999857891452847979962825775146484375
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--spacer"],
                      items: [
                        {
                          type: "Spacer",
                          value: {
                            _styles: ["spacer"]
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: "Row",
                    value: {
                      _styles: ["row", "hide-row-borders", "padding-0"],
                      items: [
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
                            items: [
                              {
                                type: "Wrapper",
                                value: {
                                  _styles: ["wrapper", "wrapper--line"],
                                  items: [
                                    {
                                      type: "Line",
                                      value: {
                                        _styles: ["line"],
                                        width: 100,
                                        borderWidth: 3,
                                        borderColorPalette: "color5",
                                        borderColorHex: "#0d91bb",
                                        borderColorOpacity: 1
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            paddingRight: 0,
                            paddingLeft: 0,
                            showOnMobile: "off",
                            width: 50
                          }
                        },
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
                            items: [
                              {
                                type: "Wrapper",
                                value: {
                                  _styles: ["wrapper", "wrapper--line"],
                                  items: [
                                    {
                                      type: "Line",
                                      value: {
                                        _styles: ["line"],
                                        width: 100,
                                        borderWidth: 3,
                                        borderColorPalette: "color3",
                                        borderColorHex: "#0d91bb",
                                        borderColorOpacity: 1
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            paddingRight: 0,
                            paddingLeft: 0,
                            width: 50
                          }
                        }
                      ]
                    }
                  }
                ],
                padding: 0,
                paddingTop: 20,
                paddingBottom: 80,
                paddingType: "ungrouped"
              }
            }
          ]
        }
      },
      {
        blockId: "Bogdan016Light",
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                bgColorHex: "#ffffff",
                bgColorOpacity: 1,
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
                            height: 530,
                            address: "manhattan"
                          }
                        }
                      ]
                    }
                  }
                ],
                containerSize: 80,
                containerType: "fullWidth",
                paddingType: "ungrouped",
                paddingTop: 30,
                paddingBottom: 40
              }
            }
          ]
        }
      }
    ]
  }
};
