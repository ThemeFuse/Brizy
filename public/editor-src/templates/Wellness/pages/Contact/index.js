module.exports = {
  id: "WellnessContact",
  thumbnailWidth: 680,
  thumbnailHeight: 1141,
  title: "Contact",
  keywords:
    "contact, wellness, features, projects, news, two columns, portfolio, grid, masonry",
  cat: [0, 13],
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
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            text:
                              '<h1 class="brz-tp-heading1 brz-text-lg-center"><span class="brz-cp-color8">Visit us the&nbsp;</span><strong class="brz-cp-color8">Location</strong><span class="brz-cp-color8"> in San Francisco</span></h1>'
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
                              '<p class="brz-text-lg-center brz-tp-heading5"><span class="brz-cp-color8">325, Broome Street, Melbourne, AU</span></p>'
                          }
                        }
                      ],
                      marginTop: 0,
                      animationName: "fadeInUp",
                      tempAnimationName: "fadeInUp",
                      animationDuration: 900,
                      animationDelay: 0
                    }
                  }
                ],
                paddingType: "ungrouped",
                paddingTop: 60,
                paddingBottom: 80,
                bgImageWidth: 1920,
                bgImageHeight: 430,
                bgImageSrc: "5e8cce1798ba1d43d6cfe86395272e1b.jpg",
                bgColorHex: "",
                bgColorOpacity: 0.59999999999999997779553950749686919152736663818359375,
                tempBgColorOpacity: 0.59999999999999997779553950749686919152736663818359375,
                bgPositionY: 50,
                bgPositionX: 50,
                bgColorPalette: "color4",
                tempMobileBgColorOpacity: 1
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
                              '<h2 class="brz-mb-lg-0 brz-tp-heading2 brz-text-lg-center"><span class="brz-cp-color2">Contact us&nbsp;</span><strong class="brz-cp-color2">using the Form</strong><span class="brz-cp-color2"> below</span></h2>'
                          }
                        }
                      ],
                      marginBottom: 0,
                      paddingType: "ungrouped",
                      paddingRight: 50,
                      marginTop: 0,
                      paddingLeft: 50
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
                              '<p class="brz-text-lg-center brz-tp-paragraph"><span class="brz-cp-color7">Please send us your feedback</span></p>'
                          }
                        }
                      ],
                      marginTop: 0
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
                                                    label: "EMAIL ADDRESS",
                                                    required: false,
                                                    options: [
                                                      "Option 1",
                                                      "Option 2"
                                                    ]
                                                  }
                                                },
                                                {
                                                  type: "FormField",
                                                  value: {
                                                    label: "WEBSITE",
                                                    required: false,
                                                    options: [
                                                      "Option 1",
                                                      "Option 2"
                                                    ],
                                                    width: 50
                                                  }
                                                },
                                                {
                                                  type: "FormField",
                                                  value: {
                                                    label: "ARE YOU A CLIENT?",
                                                    required: false,
                                                    options: [
                                                      "CLIENT",
                                                      "BUSINESS"
                                                    ],
                                                    width: 50,
                                                    type: "Select"
                                                  }
                                                },
                                                {
                                                  type: "FormField",
                                                  value: {
                                                    type: "Paragraph",
                                                    label: "MESSAGE",
                                                    required: false,
                                                    options: [
                                                      "Option 1",
                                                      "Option 2"
                                                    ]
                                                  }
                                                }
                                              ],
                                              borderColorOpacity: 0,
                                              fontSize: 13,
                                              fontFamily: "raleway",
                                              lineHeight: 1.8000000000000000444089209850062616169452667236328125,
                                              letterSpacing: 0.5,
                                              fontWeight: 500,
                                              bgColorPalette: "color8",
                                              colorPalette: "color1",
                                              fontStyle: "button"
                                            }
                                          },
                                          {
                                            type: "Button",
                                            value: {
                                              _styles: ["button", "submit"],
                                              iconName: "",
                                              iconType: "",
                                              borderRadiusType: "custom",
                                              tempBorderRadiusType: "custom",
                                              borderColorOpacity: 1,
                                              hoverBorderColorOpacity: 0.8000000000000000444089209850062616169452667236328125,
                                              borderRadius: 0,
                                              tempBorderRadius: 0,
                                              size: "small",
                                              fontSize: 11,
                                              paddingTB: 11,
                                              paddingTop: 11,
                                              paddingBottom: 11,
                                              tempPaddingTB: 11,
                                              tempPaddingTop: 11,
                                              tempPaddingBottom: 11,
                                              paddingRL: 26,
                                              paddingRight: 26,
                                              paddingLeft: 26,
                                              tempPaddingRL: 26,
                                              tempPaddingRight: 26,
                                              tempPaddingLeft: 26,
                                              bgColorPalette: "color1",
                                              tempBgColorPalette: "color1",
                                              borderColorPalette: "color1",
                                              tempBorderColorPalette: "color1",
                                              hoverBgColorPalette: "color5",
                                              hoverBorderColorPalette: "",
                                              tempHoverBorderColorPalette: "",
                                              hoverBgColorHex: "#db426b",
                                              hoverBgColorOpacity: 1,
                                              hoverBorderColorHex: "#db426b",
                                              tempHoverBgColorOpacity: 1,
                                              text: "SUBMIT"
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
                            width: 100,
                            bgColorPalette: "color6",
                            bgColorHex: "",
                            bgColorOpacity: 1,
                            mobilePaddingRight: 10,
                            mobilePaddingLeft: 10,
                            paddingType: "grouped",
                            padding: 90,
                            paddingTop: 90,
                            paddingRight: 90,
                            paddingBottom: 90,
                            paddingLeft: 90
                          }
                        }
                      ]
                    }
                  }
                ],
                bgImageWidth: 1920,
                bgImageHeight: 1000,
                bgImageSrc: "5d72b1b5e6224a523f45dfacbbe9d859.jpg",
                bgColorPalette: "color8",
                bgColorHex: "#ffffff",
                bgColorOpacity: 0.40000000000000002220446049250313080847263336181640625,
                tempBgColorOpacity: 0.40000000000000002220446049250313080847263336181640625,
                padding: 100,
                paddingTop: 100,
                paddingBottom: 100,
                containerSize: 65,
                bgPositionX: 50,
                bgPositionY: 50,
                tempMobileBgColorOpacity: 1,
                bgPopulation: ""
              }
            }
          ]
        }
      },
      {
        type: "Section",
        blockId: "Bogdan011Light",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                bgColorHex: "",
                bgColorOpacity: 1,
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
                              '<h2 class="brz-text-lg-center brz-tp-heading2 brz-mb-lg-0"><span class="brz-cp-color2">View our&nbsp;</span><strong class="brz-cp-color2">Clinic\'s Location</strong><span class="brz-cp-color2"> on a map</span></h2>'
                          }
                        }
                      ],
                      marginBottom: 0,
                      paddingType: "ungrouped",
                      paddingRight: 50,
                      marginTop: 0,
                      paddingLeft: 50
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
                              '<p class="brz-tp-paragraph brz-text-lg-center"><span class="brz-cp-color7">Address:&nbsp;</span><strong class="brz-cp-color7">Broome Str. 325</strong><span class="brz-cp-color7">, 10000 Melbourne, AU</span></p>'
                          }
                        }
                      ],
                      marginTop: 0
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
                              '<p class="brz-text-lg-center brz-tp-paragraph"><span class="brz-cp-color7">Phone:&nbsp;</span><strong class="brz-cp-color7">01 22 345 67 89</strong><span class="brz-cp-color7"> - Fax:&nbsp;</span><strong class="brz-cp-color7">01 23 456 78 90</strong></p>'
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
                            _styles: ["button"],
                            iconName: "",
                            iconType: "",
                            paddingRL: 0,
                            paddingRight: 0,
                            paddingLeft: 0,
                            borderWidth: 0,
                            borderColorPalette: "",
                            mobilePaddingRL: 0,
                            mobilePaddingRight: 0,
                            mobilePaddingLeft: 0,
                            text: "wellness@cliniccenter.co.au",
                            tempBorderColorPalette: "",
                            bgColorHex: "#12bdd0",
                            bgColorOpacity: 0,
                            hoverBorderColorHex: "#12bdd0",
                            borderRadiusType: "",
                            fillType: "default",
                            hoverBgColorOpacity: 0,
                            colorPalette: "color3",
                            hoverColorPalette: "color5",
                            size: "small",
                            fontSize: 11,
                            paddingTB: 11,
                            paddingTop: 11,
                            paddingBottom: 11,
                            tempPaddingTB: 11,
                            tempPaddingTop: 11,
                            tempPaddingBottom: 11,
                            fontStyle: "paragraph",
                            mobileFontStyle: "paragraph",
                            linkExternalBlank: "off",
                            linkExternal: "#"
                          }
                        }
                      ],
                      marginTop: 0,
                      marginBottom: 0
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
                            height: 600
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
                            height: 30
                          }
                        }
                      ],
                      showOnMobile: "off"
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
                                  _styles: ["wrapper", "wrapper--richText"],
                                  items: [
                                    {
                                      type: "RichText",
                                      value: {
                                        _styles: ["richText"],
                                        text:
                                          '<p class="brz-tp-paragraph brz-text-lg-right"><strong class="brz-cp-color1">GET HERE BY TRAIN</strong></p>'
                                      }
                                    }
                                  ],
                                  marginBottom: 0
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
                                          '<p class="brz-tp-paragraph brz-text-lg-right"><span class="brz-cp-color7">Intercity links to all major cities. Frequent services to Edinburgh (50 minutes) and London (5 hours). There are two city-centre terminals, Glasgow Queen Street and Glasgow Central (served by Buchanan St and St Enoch subway stations respectively).</span></p>'
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            paddingLeft: 90,
                            paddingRight: 25
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
                                          '<p class="brz-tp-paragraph brz-text-lg-left"><strong>DRIVE HERE BY CAR / BUS</strong></p>'
                                      }
                                    }
                                  ],
                                  marginBottom: 0
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
                                          '<p class="brz-tp-paragraph brz-text-lg-left"><span class="brz-cp-color7">From Carlisle, Newcastle and the south, exit M74 on to the M73, joining the M8 at the Old Monkland junction. M8 exits for the University are J18 if travelling from the south, Edinburgh and the north and J19 if coming from Glasgow Airport and the west.</span></p>'
                                      }
                                    }
                                  ]
                                }
                              }
                            ],
                            paddingRight: 90,
                            paddingLeft: 25
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
                            height: 30
                          }
                        }
                      ],
                      showOnMobile: "off"
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
                            _styles: ["button"],
                            fontSize: 13,
                            fontFamily: "raleway",
                            letterSpacing: 0,
                            fontWeight: 600,
                            iconName: "",
                            iconType: "",
                            borderRadiusType: "custom",
                            tempBorderRadiusType: "custom",
                            borderColorOpacity: 1,
                            hoverBorderColorOpacity: 1,
                            borderRadius: 0,
                            tempBorderRadius: 0,
                            bgColorPalette: "color1",
                            tempBgColorPalette: "color1",
                            borderColorPalette: "color1",
                            tempBorderColorPalette: "color1",
                            hoverBgColorHex: "#12bdd0",
                            hoverBgColorOpacity: 1,
                            hoverBorderColorHex: "#393c41",
                            tempHoverBgColorOpacity: 1,
                            text: "VIEW ON GOOGLE MAP",
                            linkExternal: "#",
                            linkExternalBlank: "off"
                          }
                        }
                      ]
                    }
                  }
                ],
                paddingTop: 90,
                paddingBottom: 90,
                bgColorPalette: "color6",
                padding: 90
              }
            }
          ]
        }
      }
    ]
  }
};
