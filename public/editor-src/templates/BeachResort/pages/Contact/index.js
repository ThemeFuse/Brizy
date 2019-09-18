module.exports = {
  id: "BeachResortContact",
  thumbnailWidth: 680,
  thumbnailHeight: 1347,
  title: "Contact",
  keywords:
    "contact, location, address, beach, Hotel, Spa, Restaurant, Travel, Vacation, apartments, rooms, suites, houses",
  cat: [0, 2],
  pro: true,
  resolve: {
    blocks: [
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
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--spacer"],
                      items: [
                        {
                          type: "Spacer",
                          value: {
                            _styles: ["spacer"],
                            height: 450,
                            mobileHeight: 140
                          }
                        }
                      ]
                    }
                  }
                ],
                padding: 100,
                paddingTop: 100,
                paddingBottom: 100,
                bgImageWidth: 1920,
                bgImageHeight: 1000,
                bgImageSrc: "5a60c028800ad984fdd142411393bbed.jpg",
                bgPositionX: 50,
                bgPositionY: 50,
                bgColorOpacity: 0,
                tempBgColorOpacity: 1,
                tempMobileBgColorOpacity: 1,
                containerSize: 100,
                bgPopulation: "",
                shape: "bottom",
                shapeBottomType: "1",
                shapeBottomHorizontal: "on",
                shapeBottomColorPalette: "color8",
                shapeBottomColorHex: "",
                shapeBottomColorOpacity: 1
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
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text:
                              '<h1 class="brz-tp-heading1"><span class="brz-cp-color2">Contact Us</span></h1>'
                          }
                        }
                      ],
                      marginBottom: 0,
                      margin: 0,
                      animationName: "fadeInUp",
                      tempAnimationName: "fadeInUp",
                      animationDelay: 0,
                      animationDuration: 900
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
                              '<p class="brz-tp-subtitle"><strong class="brz-cp-color3" style="opacity: 1;">GET IN TOUCH BY FILLING THE FORM BELOW</strong></p>'
                          }
                        }
                      ],
                      marginTop: 0,
                      margin: 0,
                      animationName: "fadeInUp",
                      tempAnimationName: "fadeInUp",
                      animationDelay: 0,
                      animationDuration: 900
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
                                        type: "Text",
                                        label: "Full Name",
                                        required: false,
                                        options: ["Option 1", "Option 2"],
                                        width: 50
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Text",
                                        label: "Email Address",
                                        required: false,
                                        options: ["Option 1", "Option 2"],
                                        width: 50
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Text",
                                        label: "Subject",
                                        required: false,
                                        options: ["Option 1", "Option 2"]
                                      }
                                    },
                                    {
                                      type: "FormField",
                                      value: {
                                        type: "Paragraph",
                                        label: "Message",
                                        required: false,
                                        options: ["Option 1", "Option 2"]
                                      }
                                    }
                                  ],
                                  fontStyle: "paragraph",
                                  mobileFontStyle: "",
                                  bgColorPalette: "color4",
                                  bgColorHex: "#b7b9c1",
                                  bgColorOpacity: 0.1499999999999999944488848768742172978818416595458984375,
                                  borderColorPalette: "color4",
                                  borderColorHex: "#b7b9c1",
                                  borderColorOpacity: 0,
                                  fontSize: 14,
                                  fontFamily: "lato",
                                  lineHeight: 1.8000000000000000444089209850062616169452667236328125,
                                  letterSpacing: 1,
                                  fontWeight: 400
                                }
                              },
                              {
                                type: "Button",
                                value: {
                                  _styles: ["button", "submit"],
                                  borderRadiusType: "custom",
                                  tempBorderRadiusType: "custom",
                                  paddingRight: 42,
                                  paddingLeft: 42,
                                  fillType: "outline",
                                  borderRadius: 0,
                                  borderWidth: 1,
                                  borderColorOpacity: 1,
                                  borderColorPalette: "color1",
                                  bgColorOpacity: 0,
                                  bgColorPalette: "",
                                  hoverBgColorOpacity: 1,
                                  hoverBorderColorOpacity: 1,
                                  mobileBorderRadius: 2,
                                  tempBorderRadius: 0,
                                  tempFillType: "outline",
                                  paddingRL: 42,
                                  paddingTB: 14,
                                  paddingTop: 14,
                                  paddingBottom: 14,
                                  mobilePaddingRL: 26,
                                  mobilePaddingRight: 26,
                                  mobilePaddingLeft: 26,
                                  tempBorderColorPalette: "color1",
                                  tempBorderWidth: 1,
                                  colorPalette: "color1",
                                  colorOpacity: 1,
                                  iconName: "",
                                  iconType: "",
                                  hoverBgColorPalette: "color2",
                                  hoverBorderColorPalette: "color1",
                                  tempHoverBorderColorPalette: "color1",
                                  hoverBgColorHex: "#2a2d41",
                                  tempHoverBgColorOpacity: 1,
                                  tempHoverBgColorPalette: "color3",
                                  hoverBorderColorHex: "#2a2d41",
                                  text: "SEND"
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
                containerSize: 85,
                padding: 80,
                paddingTop: 15,
                paddingBottom: 51,
                bgColorPalette: "color8",
                bgColorHex: "#ffffff",
                bgColorOpacity: 1,
                tempBgColorOpacity: 1,
                paddingType: "ungrouped"
              }
            }
          ]
        }
      },
      {
        type: "Section",
        blockId: "Blank000Light",
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
                      _styles: ["wrapper", "wrapper--line"],
                      items: [
                        {
                          type: "Line",
                          value: {
                            _styles: ["line"],
                            borderColorPalette: "color4",
                            borderColorOpacity: 0.5,
                            borderWidth: 1,
                            width: 35,
                            borderColorHex: "#b7b9c1"
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: "Row",
                    value: {
                      _styles: ["row"],
                      items: [
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
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
                                          '<h3 class="brz-tp-heading3"><span class="brz-cp-color2">Find us on the map</span></h3>'
                                      }
                                    }
                                  ],
                                  marginBottom: 0,
                                  margin: 0
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
                                          '<p class="brz-tp-abovetitle"><span class="brz-cp-color7">NULLA AT NULLA USTO, EGET LUCTUS TORTOR</span></p>'
                                      }
                                    }
                                  ],
                                  marginTop: 0,
                                  margin: 0
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
                                        height: 30
                                      }
                                    }
                                  ],
                                  showOnMobile: "off"
                                }
                              }
                            ],
                            width: 100
                          }
                        }
                      ],
                      size: 90
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--map"],
                      items: [
                        {
                          type: "Map",
                          value: {
                            _styles: ["map"],
                            height: 600,
                            mobileHeight: 300
                          }
                        }
                      ],
                      animationName: "none",
                      tempAnimationName: "none",
                      animationDuration: 800,
                      animationDelay: 0
                    }
                  },
                  {
                    type: "Row",
                    value: {
                      _styles: ["row"],
                      items: [
                        {
                          type: "Column",
                          value: {
                            _styles: ["column"],
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
                                          '<p class="brz-tp-abovetitle brz-text-lg-right brz-text-xs-left"><span class="brz-cp-color7">WESTBAY CORAL DRIVE, NO. 16, NASSAU, BAHAMAS</span></p>'
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            width: 100
                          }
                        }
                      ],
                      paddingType: "ungrouped",
                      paddingRight: 10,
                      padding: 10,
                      size: 90
                    }
                  }
                ],
                containerType: "fullWidth",
                paddingType: "ungrouped",
                paddingTop: 0,
                padding: 0,
                paddingBottom: 15,
                shape: "bottom",
                shapeBottomType: "none"
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
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text:
                              '<p class="brz-tp-subtitle brz-text-xs-center"><span class="brz-cp-color6">OUR REVIEWS</span></p>'
                          }
                        }
                      ],
                      marginBottom: 0,
                      margin: 0
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
                              '<h2 class="brz-text-xs-center brz-tp-heading2 brz-text-lg-left"><span class="brz-cp-color2">What our guests say:</span></h2>'
                          }
                        }
                      ],
                      marginBottom: 0,
                      margin: 0,
                      paddingType: "ungrouped",
                      paddingRight: 50,
                      padding: 0,
                      marginTop: 0
                    }
                  }
                ],
                padding: 0,
                paddingTop: 0,
                paddingBottom: 0
              }
            }
          ]
        }
      },
      {
        type: "Section",
        blockId: "Blank000Light",
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
                                  _styles: ["wrapper", "wrapper--richText"],
                                  items: [
                                    {
                                      type: "RichText",
                                      value: {
                                        _styles: ["richText"],
                                        text:
                                          '<p class="brz-tp-paragraph brz-text-xs-center"><span class="brz-cp-color7">If you are looking for a beautiful, relaxing and amazing vacation on a gorgeous European city with exceptional amenities and phenomenal customer service, than Alpine Lodge Resort is just the place for you: 4.5 stars out of 5! Quo interesset deterruisset ut, congue neglegentur et cum</span></p>'
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
                                        _styles: ["spacer"],
                                        height: 10
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                type: "Row",
                                value: {
                                  _styles: [
                                    "row",
                                    "hide-row-borders",
                                    "padding-0"
                                  ],
                                  items: [
                                    {
                                      type: "Column",
                                      value: {
                                        _styles: ["column"],
                                        items: [
                                          {
                                            type: "Wrapper",
                                            value: {
                                              _styles: [
                                                "wrapper",
                                                "wrapper--image"
                                              ],
                                              items: [
                                                {
                                                  type: "Image",
                                                  value: {
                                                    _styles: ["image"],
                                                    imageWidth: 500,
                                                    imageHeight: 500,
                                                    imageSrc:
                                                      "950d143d6d6dd000fbd8c7715b0aaf1f.jpg",
                                                    height: 98,
                                                    positionX: 50,
                                                    positionY: 50,
                                                    mobileHeight: 100,
                                                    mobileResize: 20,
                                                    imagePopulation: "",
                                                    borderRadiusType: "rounded",
                                                    borderRadius: 62
                                                  }
                                                }
                                              ],
                                              mobileHorizontalAlign: "center"
                                            }
                                          }
                                        ],
                                        width: 14.9000000000000003552713678800500929355621337890625,
                                        paddingType: "grouped",
                                        padding: 0,
                                        paddingTop: 0,
                                        paddingRight: 0,
                                        paddingBottom: 0,
                                        paddingLeft: 0
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
                                              _styles: [
                                                "wrapper",
                                                "wrapper--richText"
                                              ],
                                              items: [
                                                {
                                                  type: "RichText",
                                                  value: {
                                                    _styles: ["richText"],
                                                    text:
                                                      '<p class="brz-tp-subtitle brz-text-xs-center"><strong class="brz-cp-color2">ROBERT HARRIS</strong></p>'
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ],
                                        width: 85.099999999999994315658113919198513031005859375,
                                        verticalAlign: "center",
                                        paddingLeft: 40,
                                        padding: 15
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            width: 74,
                            paddingLeft: 0,
                            padding: 15,
                            paddingRight: 15
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
                                  _styles: ["wrapper", "wrapper--richText"],
                                  items: [
                                    {
                                      type: "RichText",
                                      value: {
                                        _styles: ["richText"],
                                        text:
                                          '<p class="brz-tp-paragraph"><br></p>'
                                      }
                                    }
                                  ],
                                  showOnMobile: "on"
                                }
                              }
                            ],
                            width: 26,
                            paddingLeft: 0,
                            padding: 15,
                            paddingRight: 15,
                            showOnMobile: "on"
                          }
                        }
                      ]
                    }
                  }
                ],
                padding: 25,
                paddingTop: 0,
                paddingBottom: 80,
                paddingType: "ungrouped",
                mobilePadding: 0,
                mobilePaddingTop: 0,
                mobilePaddingBottom: 0
              }
            },
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
                                  _styles: ["wrapper", "wrapper--richText"],
                                  items: [
                                    {
                                      type: "RichText",
                                      value: {
                                        _styles: ["richText"],
                                        text:
                                          '<p class="brz-tp-paragraph brz-text-xs-center"><span class="brz-cp-color7">Lorem ipsum dolor sit amet, eos diam intellegat interesset te, vivendo intellegam sea no. Ceteros molestiae gubergren has no. Sed ei placerat tractatos. Quo vidisse eruditi vocibus at, movet veniam vituperata vim eu, mea iusto feugait at. Nam no ferri animal regione, errem dictas perfecto vix in</span></p>'
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
                                        _styles: ["spacer"],
                                        height: 10
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                type: "Row",
                                value: {
                                  _styles: [
                                    "row",
                                    "hide-row-borders",
                                    "padding-0"
                                  ],
                                  items: [
                                    {
                                      type: "Column",
                                      value: {
                                        _styles: ["column"],
                                        items: [
                                          {
                                            type: "Wrapper",
                                            value: {
                                              _styles: [
                                                "wrapper",
                                                "wrapper--image"
                                              ],
                                              items: [
                                                {
                                                  type: "Image",
                                                  value: {
                                                    _styles: ["image"],
                                                    imageWidth: 127,
                                                    imageHeight: 127,
                                                    imageSrc:
                                                      "2a37612be6f7f514127d7d54e248c24f.png",
                                                    height: 99,
                                                    positionX: 50,
                                                    positionY: 50,
                                                    mobileHeight: 100,
                                                    mobileResize: 20
                                                  }
                                                }
                                              ],
                                              mobileHorizontalAlign: "center"
                                            }
                                          }
                                        ],
                                        width: 14.9000000000000003552713678800500929355621337890625,
                                        paddingType: "grouped",
                                        padding: 0,
                                        paddingTop: 0,
                                        paddingRight: 0,
                                        paddingBottom: 0,
                                        paddingLeft: 0
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
                                              _styles: [
                                                "wrapper",
                                                "wrapper--richText"
                                              ],
                                              items: [
                                                {
                                                  type: "RichText",
                                                  value: {
                                                    _styles: ["richText"],
                                                    text:
                                                      '<p class="brz-tp-subtitle brz-text-xs-center"><strong class="brz-cp-color2">CARLA GENSON</strong></p>'
                                                  }
                                                }
                                              ]
                                            }
                                          }
                                        ],
                                        width: 85.099999999999994315658113919198513031005859375,
                                        verticalAlign: "center",
                                        paddingLeft: 40,
                                        padding: 15
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            width: 74,
                            paddingLeft: 0,
                            padding: 15,
                            paddingRight: 15,
                            paddingTop: 0,
                            paddingBottom: 0
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
                                  _styles: ["wrapper", "wrapper--richText"],
                                  items: [
                                    {
                                      type: "RichText",
                                      value: {
                                        _styles: ["richText"],
                                        text:
                                          '<p class="brz-tp-paragraph"><br></p>'
                                      }
                                    }
                                  ],
                                  showOnMobile: "on"
                                }
                              }
                            ],
                            width: 26,
                            paddingLeft: 0,
                            padding: 15,
                            paddingRight: 15,
                            showOnMobile: "on"
                          }
                        }
                      ]
                    }
                  }
                ],
                padding: 25,
                paddingTop: 0,
                paddingBottom: 80,
                paddingType: "ungrouped",
                mobilePadding: 0,
                mobilePaddingTop: 0,
                mobilePaddingBottom: 0
              }
            }
          ],
          slider: "on",
          sliderAutoPlay: "on",
          sliderAutoPlaySpeed: 5,
          sliderDotsColorPalette: "color2",
          sliderDotsColorOpacity: 1,
          sliderArrowsColorPalette: "color2",
          sliderArrowsColorOpacity: 1
        }
      },
      {
        type: "Section",
        blockId: "Blank000Light",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                items: [
                  {
                    type: "Cloneable",
                    value: {
                      _styles: ["wrapper-clone", "wrapper-clone--icon"],
                      items: [
                        {
                          type: "Icon",
                          value: {
                            _styles: ["icon"],
                            name: "logo-twitter",
                            type: "glyph",
                            size: "custom",
                            customSize: 20,
                            borderRadius: 0,
                            colorPalette: "color2",
                            colorOpacity: 1,
                            hoverColorPalette: "color2",
                            hoverColorOpacity: 1,
                            hoverColorHex: "#2a2d41"
                          }
                        },
                        {
                          type: "Icon",
                          value: {
                            _styles: ["icon"],
                            name: "logo-fb-simple",
                            type: "glyph",
                            size: "custom",
                            customSize: 20,
                            borderRadius: 0,
                            colorPalette: "color2",
                            colorOpacity: 1,
                            hoverColorPalette: "color2",
                            hoverColorOpacity: 1,
                            hoverColorHex: "#2a2d41"
                          }
                        },
                        {
                          type: "Icon",
                          value: {
                            _styles: ["icon"],
                            name: "logo-instagram",
                            type: "glyph",
                            size: "custom",
                            customSize: 20,
                            borderRadius: 0,
                            colorPalette: "color2",
                            colorOpacity: 1,
                            hoverColorPalette: "color2",
                            hoverColorOpacity: 1,
                            hoverColorHex: "#2a2d41"
                          }
                        },
                        {
                          type: "Icon",
                          value: {
                            _styles: ["icon"],
                            name: "logo-youtube",
                            type: "glyph",
                            size: "custom",
                            customSize: 20,
                            borderRadius: 0,
                            colorPalette: "color2",
                            colorOpacity: 1,
                            hoverColorPalette: "color2",
                            hoverColorOpacity: 1,
                            hoverColorHex: "#2a2d41"
                          }
                        }
                      ],
                      horizontalAlign: "right",
                      itemPadding: 12,
                      itemPaddingRight: 12,
                      itemPaddingLeft: 12
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
                              '<p class="brz-text-lg-right brz-tp-heading6"><span class="brz-cp-color7">Beach Resort Hotel &amp; Spa, Westbay Coral Drive, No. 16, Nassau, Bahamas</span></p>'
                          }
                        }
                      ]
                    }
                  },
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--line"],
                      items: [
                        {
                          type: "Line",
                          value: {
                            _styles: ["line"],
                            borderWidth: 1,
                            width: 100,
                            borderColorHex: "#888a96",
                            borderColorOpacity: 0.299999999999999988897769753748434595763683319091796875,
                            borderColorPalette: "color7"
                          }
                        }
                      ]
                    }
                  }
                ],
                padding: 50,
                paddingTop: 60,
                paddingBottom: 50,
                bgColorPalette: "",
                bgColorHex: "#e5eaeb",
                bgColorOpacity: 1,
                paddingType: "ungrouped"
              }
            }
          ]
        }
      }
    ]
  }
};
