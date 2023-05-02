module.exports = {
  id: "CollegeAbout",
  thumbnailWidth: 680,
  thumbnailHeight: 1750,
  title: "About", 
  keywords: "about, about us, history, team, stories, college, Education, Teaching, School",
  cat: [0, 6],
  pro: true,
  resolve: { blocks:[
    {
        type: "Section",
        value: {
            _styles: [
                "section"
            ],
            items: [
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<h1 class=\"brz-text-xs-center brz-tp-heading1 brz-text-lg-center\"><strong class=\"brz-cp-color8\"><em>About Us</em></strong></h1>"
                                            }
                                        }
                                    ],
                                    marginBottom: 0,
                                    marginBottomSuffix: "px",
                                    margin: 0,
                                    animationName: "fadeInDown",
                                    tempAnimationName: "fadeInDown",
                                    animationDelay: 0
                                }
                            },
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<p class=\"brz-tp-subtitle brz-text-lg-center brz-text-xs-center\"><span class=\"brz-cp-color8\">WHY WE ARE RATED #1 COLLEGE IN THE STATE</span></p>"
                                            }
                                        }
                                    ],
                                    marginTop: 0,
                                    marginTopSuffix: "px",
                                    margin: 0,
                                    animationName: "fadeInUp",
                                    tempAnimationName: "fadeInUp",
                                    animationDelay: 0
                                }
                            }
                        ],
                        bgImageWidth: 1920,
                        bgImageHeight: 800,
                        bgImageSrc: "0fdef07f8da82f7bd9f6f4ff34535d26.jpg",
                        bgPositionX: 50,
                        bgPositionY: 50,
                        bgColorOpacity: 0.8,
                        tempBgColorOpacity: 0.8,
                        tempMobileBgColorOpacity: 1,
                        paddingType: "ungrouped",
                        paddingTop: 75,
                        paddingBottom: 75,
                        padding: 75,
                        bgColorPalette: "color3",
                        bgColorHex: "#099e6b"
                    }
                },
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<p class=\"brz-tp-heading1 brz-text-lg-right\"><span class=\"brz-cp-color8\">Live as if you were to die tomorrow.&nbsp;</span><strong class=\"brz-cp-color8\"><em>Learn</em></strong><span class=\"brz-cp-color8\"> as if you were to live forever.</span></p>"
                                            }
                                        }
                                    ],
                                    paddingType: "ungrouped",
                                    paddingLeft: 200,
                                    paddingLeftSuffix: "px",
                                    padding: 0
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 20
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: "Cloneable",
                                value: {
                                    _styles: [
                                        "wrapper-clone",
                                        "wrapper-clone--button"
                                    ],
                                    items: [
                                        {
                                            type: "Button",
                                            value: {
                                                _styles: [
                                                    "button"
                                                ],
                                                text: "LEARN MORE",
                                                fillType: "outline",
                                                tempFillType: "outline",
                                                paddingRL: 44,
                                                paddingRight: 44,
                                                paddingLeft: 44,
                                                paddingTB: 19,
                                                paddingTop: 19,
                                                paddingBottom: 19,
                                                borderRadiusType: "square",
                                                borderRadius: 2,
                                                borderWidth: 2,
                                                borderColorOpacity: 1,
                                                borderColorPalette: "color8",
                                                bgColorOpacity: 0,
                                                bgColorPalette: "",
                                                hoverBgColorOpacity: 1,
                                                hoverBorderColorOpacity: 0,
                                                mobilePaddingRL: 26,
                                                mobilePaddingRight: 26,
                                                mobilePaddingLeft: 26,
                                                tempBorderColorPalette: "color8",
                                                size: "large",
                                                mobileSize: "small",
                                                fontSize: 13,
                                                tempPaddingTB: 19,
                                                tempPaddingTop: 19,
                                                tempPaddingBottom: 19,
                                                tempPaddingRL: 44,
                                                tempPaddingRight: 44,
                                                tempPaddingLeft: 44,
                                                mobilePaddingTop: 11,
                                                mobilePaddingBottom: 11,
                                                iconName: "",
                                                iconType: "",
                                                fontStyle: "button",
                                                mobileFontStyle: "button",
                                                hoverBgColorPalette: "color8",
                                                hoverBorderColorPalette: "color3",
                                                tempHoverBorderColorPalette: "color3",
                                                hoverColorPalette: "color2",
                                                hoverColorOpacity: 1,
                                                hoverBgColorHex: "#ffffff",
                                                tempHoverBgColorOpacity: 1,
                                                tempHoverBgColorPalette: "color3",
                                                hoverBorderColorHex: "#239ddb"
                                            }
                                        }
                                    ],
                                    horizontalAlign: "right"
                                }
                            }
                        ],
                        bgImageWidth: 1920,
                        bgImageHeight: 700,
                        bgImageSrc: "61d77bfe1b5136a9385fd964f9dd8286.jpg",
                        bgPositionX: 50,
                        bgPositionY: 50,
                        bgColorOpacity: 0.8,
                        tempBgColorOpacity: 0.8,
                        tempMobileBgColorOpacity: 1,
                        paddingType: "ungrouped",
                        paddingTop: 140,
                        paddingBottom: 143,
                        padding: 75,
                        bgColorPalette: "color3",
                        bgColorHex: "#099e6b"
                    }
                },
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<p class=\"brz-tp-heading1 brz-text-lg-center\"><span class=\"brz-cp-color8\">Try to&nbsp;</span><strong class=\"brz-cp-color8\"><em>learn something</em></strong><span class=\"brz-cp-color8\"> about everything and everything about something.</span></p>"
                                            }
                                        }
                                    ],
                                    paddingType: "ungrouped",
                                    paddingLeft: 0,
                                    paddingLeftSuffix: "px",
                                    padding: 0
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 20
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: "Cloneable",
                                value: {
                                    _styles: [
                                        "wrapper-clone",
                                        "wrapper-clone--button"
                                    ],
                                    items: [
                                        {
                                            type: "Button",
                                            value: {
                                                _styles: [
                                                    "button"
                                                ],
                                                text: "LEARN MORE",
                                                fillType: "outline",
                                                tempFillType: "outline",
                                                paddingRL: 44,
                                                paddingRight: 44,
                                                paddingLeft: 44,
                                                paddingTB: 19,
                                                paddingTop: 19,
                                                paddingBottom: 19,
                                                borderRadiusType: "square",
                                                borderRadius: 2,
                                                borderWidth: 2,
                                                borderColorOpacity: 1,
                                                borderColorPalette: "color8",
                                                bgColorOpacity: 0,
                                                bgColorPalette: "",
                                                hoverBgColorOpacity: 1,
                                                hoverBorderColorOpacity: 0,
                                                mobilePaddingRL: 26,
                                                mobilePaddingRight: 26,
                                                mobilePaddingLeft: 26,
                                                tempBorderColorPalette: "color8",
                                                size: "large",
                                                mobileSize: "small",
                                                fontSize: 13,
                                                tempPaddingTB: 19,
                                                tempPaddingTop: 19,
                                                tempPaddingBottom: 19,
                                                tempPaddingRL: 44,
                                                tempPaddingRight: 44,
                                                tempPaddingLeft: 44,
                                                mobilePaddingTop: 11,
                                                mobilePaddingBottom: 11,
                                                iconName: "",
                                                iconType: "",
                                                fontStyle: "button",
                                                mobileFontStyle: "button",
                                                hoverBgColorPalette: "color8",
                                                hoverBorderColorPalette: "color3",
                                                tempHoverBorderColorPalette: "color3",
                                                hoverColorPalette: "color2",
                                                hoverColorOpacity: 1,
                                                hoverBgColorHex: "#ffffff",
                                                tempHoverBgColorOpacity: 1,
                                                tempHoverBgColorPalette: "color3",
                                                hoverBorderColorHex: "#239ddb"
                                            }
                                        }
                                    ],
                                    horizontalAlign: "center"
                                }
                            }
                        ],
                        bgImageWidth: 1920,
                        bgImageHeight: 700,
                        bgImageSrc: "d391149bb422630a6fcc95eabfa496e8.jpg",
                        bgPositionX: 50,
                        bgPositionY: 50,
                        bgColorOpacity: 0.8,
                        tempBgColorOpacity: 0.8,
                        tempMobileBgColorOpacity: 1,
                        paddingType: "ungrouped",
                        paddingTop: 140,
                        paddingBottom: 143,
                        padding: 75,
                        bgColorPalette: "color3",
                        bgColorHex: "#099e6b"
                    }
                },
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<p class=\"brz-tp-heading1 brz-text-lg-left\"><strong class=\"brz-cp-color8\"><em>One book</em></strong><span class=\"brz-cp-color8\">, one pen, one child, and one teacher can change the world.</span></p>"
                                            }
                                        }
                                    ],
                                    paddingType: "ungrouped",
                                    paddingLeft: 0,
                                    paddingLeftSuffix: "px",
                                    padding: 0,
                                    paddingRight: 200,
                                    paddingRightSuffix: "px"
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 20
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: "Cloneable",
                                value: {
                                    _styles: [
                                        "wrapper-clone",
                                        "wrapper-clone--button"
                                    ],
                                    items: [
                                        {
                                            type: "Button",
                                            value: {
                                                _styles: [
                                                    "button"
                                                ],
                                                text: "LEARN MORE",
                                                fillType: "outline",
                                                tempFillType: "outline",
                                                paddingRL: 44,
                                                paddingRight: 44,
                                                paddingLeft: 44,
                                                paddingTB: 19,
                                                paddingTop: 19,
                                                paddingBottom: 19,
                                                borderRadiusType: "square",
                                                borderRadius: 2,
                                                borderWidth: 2,
                                                borderColorOpacity: 1,
                                                borderColorPalette: "color8",
                                                bgColorOpacity: 0,
                                                bgColorPalette: "",
                                                hoverBgColorOpacity: 1,
                                                hoverBorderColorOpacity: 0,
                                                mobilePaddingRL: 26,
                                                mobilePaddingRight: 26,
                                                mobilePaddingLeft: 26,
                                                tempBorderColorPalette: "color8",
                                                size: "large",
                                                mobileSize: "small",
                                                fontSize: 13,
                                                tempPaddingTB: 19,
                                                tempPaddingTop: 19,
                                                tempPaddingBottom: 19,
                                                tempPaddingRL: 44,
                                                tempPaddingRight: 44,
                                                tempPaddingLeft: 44,
                                                mobilePaddingTop: 11,
                                                mobilePaddingBottom: 11,
                                                iconName: "",
                                                iconType: "",
                                                fontStyle: "button",
                                                mobileFontStyle: "button",
                                                hoverBgColorPalette: "color8",
                                                hoverBorderColorPalette: "color3",
                                                tempHoverBorderColorPalette: "color3",
                                                hoverColorPalette: "color2",
                                                hoverColorOpacity: 1,
                                                hoverBgColorHex: "#ffffff",
                                                tempHoverBgColorOpacity: 1,
                                                tempHoverBgColorPalette: "color3",
                                                hoverBorderColorHex: "#239ddb"
                                            }
                                        }
                                    ],
                                    horizontalAlign: "left"
                                }
                            }
                        ],
                        bgImageWidth: 1920,
                        bgImageHeight: 700,
                        bgImageSrc: "3665280fdf21827db3cb3109202a6fd4.jpg",
                        bgPositionX: 50,
                        bgPositionY: 50,
                        bgColorOpacity: 0.8,
                        tempBgColorOpacity: 0.8,
                        tempMobileBgColorOpacity: 1,
                        paddingType: "ungrouped",
                        paddingTop: 140,
                        paddingBottom: 143,
                        padding: 75,
                        bgColorPalette: "color3",
                        bgColorHex: "#099e6b"
                    }
                }
            ],
            slider: "off",
            sliderAutoPlay: "on",
            sliderAutoPlaySpeed: 5,
            sliderDotsColorPalette: "color6",
            sliderDotsColorOpacity: 1,
            sliderArrowsColorPalette: "color6",
            sliderArrowsColorOpacity: 1,
            _thumbnailSrc: 472619,
            _thumbnailWidth: 600,
            _thumbnailHeight: 95,
            _thumbnailTime: 1575279465323
        },
        blockId: "Blank000Light"
    },
    {
        type: "Section",
        value: {
            _styles: [
                "section"
            ],
            items: [
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<h3 class=\"brz-text-xs-center brz-text-lg-center brz-tp-heading3\"><span class=\"brz-cp-color2\">Voted best college 3rd year in a row</span></h3>"
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 20
                                            }
                                        }
                                    ],
                                    showOnMobile: "off"
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
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-text-lg-right brz-tp-paragraph brz-text-xs-center\"><span class=\"brz-cp-color7\">Vivamus hendrerit arcu sed erat molestie vehi cula. Sed auct neque eu tellus rhoncus ut eleifend nibh portitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non ve natis nisl tempor. Suspendisse dictum feugiat nisl ut dapi aus iaculis porttitor posuere. Praesent id metus massa, u blandit.</span></p>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ],
                                                paddingLeft: 100,
                                                paddingLeftSuffix: "px",
                                                padding: 15
                                            }
                                        },
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-text-lg-left brz-tp-paragraph brz-text-xs-center\"><span class=\"brz-cp-color7\">In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis aliquet egestas purus in bla ndit. Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra.</span></p>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ],
                                                paddingRight: 100,
                                                paddingRightSuffix: "px",
                                                padding: 15
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 20
                                            }
                                        }
                                    ],
                                    showOnMobile: "off"
                                }
                            },
                            {
                                type: "Cloneable",
                                value: {
                                    _styles: [
                                        "wrapper-clone",
                                        "wrapper-clone--button"
                                    ],
                                    items: [
                                        {
                                            type: "Button",
                                            value: {
                                                _styles: [
                                                    "button"
                                                ],
                                                text: "READ MORE",
                                                iconName: "",
                                                iconType: "",
                                                size: "small",
                                                mobileSize: "small",
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
                                                borderRadius: 2,
                                                borderWidth: 2,
                                                mobilePaddingTop: 11,
                                                mobilePaddingRight: 26,
                                                mobilePaddingBottom: 11,
                                                mobilePaddingLeft: 26,
                                                bgColorPalette: "color4",
                                                tempBgColorPalette: "color4",
                                                bgColorOpacity: 0,
                                                borderRadiusType: "square",
                                                fillType: "outline",
                                                borderColorPalette: "color5",
                                                tempBorderColorPalette: "color5",
                                                hoverBgColorOpacity: 1,
                                                colorPalette: "color5",
                                                colorOpacity: 1,
                                                bgColorHex: "#e39e1d",
                                                tempBgColorOpacity: 1,
                                                borderColorHex: "#e39e1d",
                                                borderColorOpacity: 1,
                                                hoverBorderColorHex: "#e39e1d",
                                                hoverBorderColorOpacity: 0,
                                                hoverBgColorPalette: "color5",
                                                hoverBorderColorPalette: "color3",
                                                tempHoverBorderColorPalette: "color3",
                                                hoverBgColorHex: "#e39e1d",
                                                tempHoverBgColorOpacity: 1,
                                                tempHoverBgColorPalette: "color3",
                                                linkExternalBlank: "off",
                                                linkExternal: "#"
                                            }
                                        }
                                    ],
                                    mobileHorizontalAlign: "center"
                                }
                            }
                        ],
                        paddingType: "ungrouped",
                        paddingTop: 100,
                        paddingBottom: 100,
                        padding: 75
                    }
                }
            ],
            _thumbnailSrc: 472621,
            _thumbnailWidth: 600,
            _thumbnailHeight: 175,
            _thumbnailTime: 1575279469111
        },
        blockId: "Blank000Light"
    },
    {
        type: "Section",
        value: {
            _styles: [
                "section"
            ],
            items: [
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
                        items: [
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
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h4 class=\"brz-tp-heading4\"><span class=\"brz-cp-color8\">Modern Facilities</span></h4>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
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
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--richText"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "RichText",
                                                                    value: {
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-paragraph\"><span style=\"opacity: 1;\" class=\"brz-cp-color6\">Proin pellentesque lacus tempor dui placerat, sed sodales nisl eleifend. Nullam vel neque in nibh tempus rhoncus. Nulla feugiat varius ligula. Curabitur tempus at magna et tincidunt. Suspen disse rutrum sem sit amet porta tincid mattis, velit eget mollis maximus.</span></p>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
                                                                        height: 10
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: "Cloneable",
                                                        value: {
                                                            _styles: [
                                                                "wrapper-clone",
                                                                "wrapper-clone--button"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Button",
                                                                    value: {
                                                                        _styles: [
                                                                            "button"
                                                                        ],
                                                                        text: "LEARN MORE",
                                                                        iconName: "",
                                                                        iconType: "",
                                                                        size: "small",
                                                                        mobileSize: "small",
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
                                                                        borderRadius: 2,
                                                                        borderWidth: 2,
                                                                        mobilePaddingTop: 11,
                                                                        mobilePaddingRight: 26,
                                                                        mobilePaddingBottom: 11,
                                                                        mobilePaddingLeft: 26,
                                                                        bgColorHex: "#099e6b",
                                                                        bgColorOpacity: 0,
                                                                        bgColorPalette: "color3",
                                                                        tempBgColorPalette: "color3",
                                                                        tempBgColorOpacity: 1,
                                                                        borderRadiusType: "square",
                                                                        fillType: "outline",
                                                                        borderColorHex: "#099e6b",
                                                                        borderColorPalette: "color6",
                                                                        tempBorderColorPalette: "color6",
                                                                        borderColorOpacity: 1,
                                                                        hoverBgColorOpacity: 1,
                                                                        hoverBorderColorHex: "#099e6b",
                                                                        hoverBorderColorOpacity: 0,
                                                                        colorPalette: "color6",
                                                                        colorOpacity: 1,
                                                                        hoverBgColorPalette: "color8",
                                                                        hoverBorderColorPalette: "color3",
                                                                        tempHoverBorderColorPalette: "color3",
                                                                        hoverBgColorHex: "#ffffff",
                                                                        tempHoverBgColorOpacity: 1,
                                                                        tempHoverBgColorPalette: "color3",
                                                                        hoverColorPalette: "color7",
                                                                        hoverColorOpacity: 1,
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left"
                                                        }
                                                    }
                                                ],
                                                width: 33.3,
                                                paddingRight: 35,
                                                paddingRightSuffix: "px",
                                                padding: 15
                                            }
                                        },
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h4 class=\"brz-tp-heading4\"><span class=\"brz-cp-color8\">Teaching methods</span></h4>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
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
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--richText"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "RichText",
                                                                    value: {
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-paragraph\"><span class=\"brz-cp-color6\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In condime ntum facilisis porta. Sed nec diam eu diam mattis viverra. Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris.</span></p>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
                                                                        height: 10
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        type: "Cloneable",
                                                        value: {
                                                            _styles: [
                                                                "wrapper-clone",
                                                                "wrapper-clone--button"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Button",
                                                                    value: {
                                                                        _styles: [
                                                                            "button"
                                                                        ],
                                                                        text: "LEARN MORE",
                                                                        iconName: "",
                                                                        iconType: "",
                                                                        size: "small",
                                                                        mobileSize: "small",
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
                                                                        borderRadius: 2,
                                                                        borderWidth: 2,
                                                                        mobilePaddingTop: 11,
                                                                        mobilePaddingRight: 26,
                                                                        mobilePaddingBottom: 11,
                                                                        mobilePaddingLeft: 26,
                                                                        bgColorHex: "#099e6b",
                                                                        bgColorOpacity: 0,
                                                                        bgColorPalette: "color3",
                                                                        tempBgColorPalette: "color3",
                                                                        tempBgColorOpacity: 1,
                                                                        borderRadiusType: "square",
                                                                        fillType: "outline",
                                                                        borderColorHex: "#099e6b",
                                                                        borderColorPalette: "color6",
                                                                        tempBorderColorPalette: "color6",
                                                                        borderColorOpacity: 1,
                                                                        hoverBgColorOpacity: 1,
                                                                        hoverBorderColorHex: "#099e6b",
                                                                        hoverBorderColorOpacity: 0,
                                                                        colorPalette: "color6",
                                                                        colorOpacity: 1,
                                                                        hoverBgColorPalette: "color8",
                                                                        hoverBorderColorPalette: "color3",
                                                                        tempHoverBorderColorPalette: "color3",
                                                                        hoverBgColorHex: "#ffffff",
                                                                        tempHoverBgColorOpacity: 1,
                                                                        tempHoverBgColorPalette: "color3",
                                                                        hoverColorPalette: "color7",
                                                                        hoverColorOpacity: 1,
                                                                        linkExternalBlank: "off",
                                                                        linkExternal: ""
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left"
                                                        }
                                                    }
                                                ],
                                                width: 33.3,
                                                paddingRight: 15,
                                                paddingRightSuffix: "px",
                                                padding: 15,
                                                paddingLeft: 35,
                                                paddingLeftSuffix: "px"
                                            }
                                        },
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h4 class=\"brz-tp-heading4\"><span class=\"brz-cp-color8\">Faculties</span></h4>"
                                                                    }
                                                                }
                                                            ],
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
                                                                        height: 20
                                                                    }
                                                                }
                                                            ],
                                                            showOnMobile: "off"
                                                        }
                                                    },
                                                    {
                                                        type: "Cloneable",
                                                        value: {
                                                            _styles: [
                                                                "wrapper-clone",
                                                                "wrapper-clone--button"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Button",
                                                                    value: {
                                                                        _styles: [
                                                                            "button"
                                                                        ],
                                                                        fillType: "default",
                                                                        tempFillType: "filled",
                                                                        paddingRL: 0,
                                                                        paddingRight: 0,
                                                                        paddingLeft: 0,
                                                                        paddingTB: 11,
                                                                        paddingTop: 11,
                                                                        paddingBottom: 11,
                                                                        borderRadiusType: "",
                                                                        borderRadius: 2,
                                                                        borderWidth: 0,
                                                                        borderColorOpacity: 0,
                                                                        borderColorPalette: "",
                                                                        bgColorOpacity: 0,
                                                                        bgColorPalette: "color6",
                                                                        hoverBgColorOpacity: 0,
                                                                        hoverBorderColorOpacity: 0,
                                                                        mobilePaddingRL: 0,
                                                                        mobilePaddingRight: 0,
                                                                        mobilePaddingLeft: 0,
                                                                        text: "Architecture",
                                                                        fontStyle: "paragraph",
                                                                        mobileFontStyle: "paragraph",
                                                                        tempBgColorPalette: "color6",
                                                                        tempBorderColorPalette: "",
                                                                        bgColorHex: "#9f9a95",
                                                                        tempBgColorOpacity: 1,
                                                                        borderColorHex: "#239ddb",
                                                                        hoverBorderColorHex: "#9f9a95",
                                                                        colorPalette: "color6",
                                                                        colorOpacity: 1,
                                                                        size: "small",
                                                                        mobileSize: "small",
                                                                        fontSize: 11,
                                                                        tempPaddingTB: 11,
                                                                        tempPaddingTop: 11,
                                                                        tempPaddingBottom: 11,
                                                                        tempPaddingRL: 42,
                                                                        tempPaddingRight: 42,
                                                                        tempPaddingLeft: 42,
                                                                        mobilePaddingTop: 11,
                                                                        mobilePaddingBottom: 11,
                                                                        iconName: "double-right",
                                                                        iconType: "outline",
                                                                        iconSize: "custom",
                                                                        iconCustomSize: 15,
                                                                        iconSpacing: 10,
                                                                        linkExternalBlank: "off",
                                                                        linkExternal: "#"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: -15,
                                                            marginBottomSuffix: "px",
                                                            mobileMarginTop: 0,
                                                            mobileMarginTopSuffix: "px",
                                                            mobileMargin: 0,
                                                            mobileMarginBottom: 0,
                                                            mobileMarginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Cloneable",
                                                        value: {
                                                            _styles: [
                                                                "wrapper-clone",
                                                                "wrapper-clone--button"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Button",
                                                                    value: {
                                                                        _styles: [
                                                                            "button"
                                                                        ],
                                                                        fillType: "default",
                                                                        tempFillType: "filled",
                                                                        paddingRL: 0,
                                                                        paddingRight: 0,
                                                                        paddingLeft: 0,
                                                                        paddingTB: 11,
                                                                        paddingTop: 11,
                                                                        paddingBottom: 11,
                                                                        borderRadiusType: "",
                                                                        borderRadius: 2,
                                                                        borderWidth: 0,
                                                                        borderColorOpacity: 0,
                                                                        borderColorPalette: "",
                                                                        bgColorOpacity: 0,
                                                                        bgColorPalette: "color6",
                                                                        hoverBgColorOpacity: 0,
                                                                        hoverBorderColorOpacity: 0,
                                                                        mobilePaddingRL: 0,
                                                                        mobilePaddingRight: 0,
                                                                        mobilePaddingLeft: 0,
                                                                        text: "Electrical Engineering",
                                                                        fontStyle: "paragraph",
                                                                        mobileFontStyle: "paragraph",
                                                                        tempBgColorPalette: "color6",
                                                                        tempBorderColorPalette: "",
                                                                        bgColorHex: "#9f9a95",
                                                                        tempBgColorOpacity: 1,
                                                                        borderColorHex: "#239ddb",
                                                                        hoverBorderColorHex: "#9f9a95",
                                                                        colorPalette: "color6",
                                                                        colorOpacity: 1,
                                                                        size: "small",
                                                                        mobileSize: "small",
                                                                        fontSize: 11,
                                                                        tempPaddingTB: 11,
                                                                        tempPaddingTop: 11,
                                                                        tempPaddingBottom: 11,
                                                                        tempPaddingRL: 42,
                                                                        tempPaddingRight: 42,
                                                                        tempPaddingLeft: 42,
                                                                        mobilePaddingTop: 11,
                                                                        mobilePaddingBottom: 11,
                                                                        iconName: "double-right",
                                                                        iconType: "outline",
                                                                        iconSize: "custom",
                                                                        iconCustomSize: 15,
                                                                        iconSpacing: 10,
                                                                        linkExternalBlank: "off",
                                                                        linkExternal: "#"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: -15,
                                                            marginBottomSuffix: "px",
                                                            mobileMarginTop: 0,
                                                            mobileMarginTopSuffix: "px",
                                                            mobileMargin: 0,
                                                            mobileMarginBottom: 0,
                                                            mobileMarginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Cloneable",
                                                        value: {
                                                            _styles: [
                                                                "wrapper-clone",
                                                                "wrapper-clone--button"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Button",
                                                                    value: {
                                                                        _styles: [
                                                                            "button"
                                                                        ],
                                                                        fillType: "default",
                                                                        tempFillType: "filled",
                                                                        paddingRL: 0,
                                                                        paddingRight: 0,
                                                                        paddingLeft: 0,
                                                                        paddingTB: 11,
                                                                        paddingTop: 11,
                                                                        paddingBottom: 11,
                                                                        borderRadiusType: "",
                                                                        borderRadius: 2,
                                                                        borderWidth: 0,
                                                                        borderColorOpacity: 0,
                                                                        borderColorPalette: "",
                                                                        bgColorOpacity: 0,
                                                                        bgColorPalette: "color6",
                                                                        hoverBgColorOpacity: 0,
                                                                        hoverBorderColorOpacity: 0,
                                                                        mobilePaddingRL: 0,
                                                                        mobilePaddingRight: 0,
                                                                        mobilePaddingLeft: 0,
                                                                        text: "Chemistry",
                                                                        fontStyle: "paragraph",
                                                                        mobileFontStyle: "paragraph",
                                                                        tempBgColorPalette: "color6",
                                                                        tempBorderColorPalette: "",
                                                                        bgColorHex: "#9f9a95",
                                                                        tempBgColorOpacity: 1,
                                                                        borderColorHex: "#239ddb",
                                                                        hoverBorderColorHex: "#9f9a95",
                                                                        colorPalette: "color6",
                                                                        colorOpacity: 1,
                                                                        size: "small",
                                                                        mobileSize: "small",
                                                                        fontSize: 11,
                                                                        tempPaddingTB: 11,
                                                                        tempPaddingTop: 11,
                                                                        tempPaddingBottom: 11,
                                                                        tempPaddingRL: 42,
                                                                        tempPaddingRight: 42,
                                                                        tempPaddingLeft: 42,
                                                                        mobilePaddingTop: 11,
                                                                        mobilePaddingBottom: 11,
                                                                        iconName: "double-right",
                                                                        iconType: "outline",
                                                                        iconSize: "custom",
                                                                        iconCustomSize: 15,
                                                                        iconSpacing: 10,
                                                                        linkExternalBlank: "off",
                                                                        linkExternal: "#"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: -15,
                                                            marginBottomSuffix: "px",
                                                            mobileMarginTop: 0,
                                                            mobileMarginTopSuffix: "px",
                                                            mobileMargin: 0,
                                                            mobileMarginBottom: 0,
                                                            mobileMarginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Cloneable",
                                                        value: {
                                                            _styles: [
                                                                "wrapper-clone",
                                                                "wrapper-clone--button"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Button",
                                                                    value: {
                                                                        _styles: [
                                                                            "button"
                                                                        ],
                                                                        fillType: "default",
                                                                        tempFillType: "filled",
                                                                        paddingRL: 0,
                                                                        paddingRight: 0,
                                                                        paddingLeft: 0,
                                                                        paddingTB: 11,
                                                                        paddingTop: 11,
                                                                        paddingBottom: 11,
                                                                        borderRadiusType: "",
                                                                        borderRadius: 2,
                                                                        borderWidth: 0,
                                                                        borderColorOpacity: 0,
                                                                        borderColorPalette: "",
                                                                        bgColorOpacity: 0,
                                                                        bgColorPalette: "color6",
                                                                        hoverBgColorOpacity: 0,
                                                                        hoverBorderColorOpacity: 0,
                                                                        mobilePaddingRL: 0,
                                                                        mobilePaddingRight: 0,
                                                                        mobilePaddingLeft: 0,
                                                                        text: "Business & Economics",
                                                                        fontStyle: "paragraph",
                                                                        mobileFontStyle: "paragraph",
                                                                        tempBgColorPalette: "color6",
                                                                        tempBorderColorPalette: "",
                                                                        bgColorHex: "#9f9a95",
                                                                        tempBgColorOpacity: 1,
                                                                        borderColorHex: "#239ddb",
                                                                        hoverBorderColorHex: "#9f9a95",
                                                                        colorPalette: "color6",
                                                                        colorOpacity: 1,
                                                                        size: "small",
                                                                        mobileSize: "small",
                                                                        fontSize: 11,
                                                                        tempPaddingTB: 11,
                                                                        tempPaddingTop: 11,
                                                                        tempPaddingBottom: 11,
                                                                        tempPaddingRL: 42,
                                                                        tempPaddingRight: 42,
                                                                        tempPaddingLeft: 42,
                                                                        mobilePaddingTop: 11,
                                                                        mobilePaddingBottom: 11,
                                                                        iconName: "double-right",
                                                                        iconType: "outline",
                                                                        iconSize: "custom",
                                                                        iconCustomSize: 15,
                                                                        iconSpacing: 10,
                                                                        linkExternalBlank: "off",
                                                                        linkExternal: "#"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: -15,
                                                            marginBottomSuffix: "px",
                                                            mobileMarginTop: 0,
                                                            mobileMarginTopSuffix: "px",
                                                            mobileMargin: 0,
                                                            mobileMarginBottom: 0,
                                                            mobileMarginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Cloneable",
                                                        value: {
                                                            _styles: [
                                                                "wrapper-clone",
                                                                "wrapper-clone--button"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Button",
                                                                    value: {
                                                                        _styles: [
                                                                            "button"
                                                                        ],
                                                                        fillType: "default",
                                                                        tempFillType: "filled",
                                                                        paddingRL: 0,
                                                                        paddingRight: 0,
                                                                        paddingLeft: 0,
                                                                        paddingTB: 11,
                                                                        paddingTop: 11,
                                                                        paddingBottom: 11,
                                                                        borderRadiusType: "",
                                                                        borderRadius: 2,
                                                                        borderWidth: 0,
                                                                        borderColorOpacity: 0,
                                                                        borderColorPalette: "",
                                                                        bgColorOpacity: 0,
                                                                        bgColorPalette: "color6",
                                                                        hoverBgColorOpacity: 0,
                                                                        hoverBorderColorOpacity: 0,
                                                                        mobilePaddingRL: 0,
                                                                        mobilePaddingRight: 0,
                                                                        mobilePaddingLeft: 0,
                                                                        text: "Computer Science",
                                                                        fontStyle: "paragraph",
                                                                        mobileFontStyle: "paragraph",
                                                                        tempBgColorPalette: "color6",
                                                                        tempBorderColorPalette: "",
                                                                        bgColorHex: "#9f9a95",
                                                                        tempBgColorOpacity: 1,
                                                                        borderColorHex: "#239ddb",
                                                                        hoverBorderColorHex: "#9f9a95",
                                                                        colorPalette: "color6",
                                                                        colorOpacity: 1,
                                                                        size: "small",
                                                                        mobileSize: "small",
                                                                        fontSize: 11,
                                                                        tempPaddingTB: 11,
                                                                        tempPaddingTop: 11,
                                                                        tempPaddingBottom: 11,
                                                                        tempPaddingRL: 42,
                                                                        tempPaddingRight: 42,
                                                                        tempPaddingLeft: 42,
                                                                        mobilePaddingTop: 11,
                                                                        mobilePaddingBottom: 11,
                                                                        iconName: "double-right",
                                                                        iconType: "outline",
                                                                        iconSize: "custom",
                                                                        iconCustomSize: 15,
                                                                        iconSpacing: 10,
                                                                        linkExternalBlank: "off",
                                                                        linkExternal: "#"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: -15,
                                                            marginBottomSuffix: "px",
                                                            mobileMarginTop: 0,
                                                            mobileMarginTopSuffix: "px",
                                                            mobileMargin: 0,
                                                            mobileMarginBottom: 0,
                                                            mobileMarginBottomSuffix: "px"
                                                        }
                                                    }
                                                ],
                                                width: 33.4,
                                                paddingRight: 0,
                                                paddingRightSuffix: "px",
                                                padding: 15,
                                                paddingLeft: 80,
                                                paddingLeftSuffix: "px"
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        bgColorPalette: "color2",
                        bgColorHex: "",
                        bgColorOpacity: 1
                    }
                }
            ],
            _thumbnailSrc: 472622,
            _thumbnailWidth: 600,
            _thumbnailHeight: 162,
            _thumbnailTime: 1575279473106
        },
        blockId: "Blank000Light"
    },
    {
        type: "Section",
        value: {
            _styles: [
                "section"
            ],
            items: [
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<h2 class=\"brz-text-xs-center brz-tp-heading2 brz-text-lg-center\"><span class=\"brz-cp-color2\">Our Teachers</span></h2>"
                                            }
                                        }
                                    ]
                                }
                            },
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<p class=\"brz-text-lg-center brz-tp-heading6 brz-text-xs-center\"><em class=\"brz-cp-color7\">Proin pellentesque lacus tempor dui placerat, sed sodales nisl eleifend.</em></p>"
                                            }
                                        }
                                    ],
                                    marginTop: 0,
                                    marginTopSuffix: "px",
                                    margin: 0
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 20
                                            }
                                        }
                                    ],
                                    showOnMobile: "off"
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
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "image"
                                                                        ],
                                                                        imageWidth: 600,
                                                                        imageHeight: 600,
                                                                        imageSrc: "0617e52fe29d3572a20641768fe4c117.jpg",
                                                                        height: 100,
                                                                        positionX: 50,
                                                                        positionY: 50,
                                                                        imagePopulation: ""
                                                                    }
                                                                }
                                                            ],
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
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
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--richText"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "RichText",
                                                                    value: {
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h5 class=\"brz-tp-heading5\"><strong class=\"brz-cp-color2\">Delmar Meszaros</strong></h5>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px",
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-paragraph\"><em class=\"brz-cp-color3\">Dean, School of Law</em></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-abovetitle\"><span class=\"brz-cp-color7\">Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis ali quet egestas purus inblan dit. Rubit vulputate, ligula niascel erisque tempor, lacus orante.</span></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-fb-simple",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-twitter",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-instagram",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
                                                                        height: 40
                                                                    }
                                                                }
                                                            ],
                                                            showOnMobile: "off"
                                                        }
                                                    }
                                                ],
                                                bgColorPalette: "color8",
                                                bgColorHex: "",
                                                bgColorOpacity: 1,
                                                mobilePaddingRight: 10,
                                                mobilePaddingLeft: 10,
                                                margin: 15,
                                                marginSuffix: "px",
                                                marginTop: 15,
                                                marginRight: 15,
                                                marginBottom: 15,
                                                marginLeft: 15,
                                                paddingType: "grouped",
                                                padding: 0,
                                                paddingSuffix: "px",
                                                paddingTop: 0,
                                                paddingRight: 0,
                                                paddingBottom: 0,
                                                paddingLeft: 0,
                                                width: 25
                                            }
                                        },
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "image"
                                                                        ],
                                                                        imageWidth: 600,
                                                                        imageHeight: 600,
                                                                        imageSrc: "d759978d60eaf55fb1481cbfd5173da5.jpg",
                                                                        height: 100,
                                                                        positionX: 50,
                                                                        positionY: 50,
                                                                        imagePopulation: ""
                                                                    }
                                                                }
                                                            ],
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
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
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--richText"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "RichText",
                                                                    value: {
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h5 class=\"brz-tp-heading5\"><strong class=\"brz-cp-color2\">Clare Grabos</strong></h5>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px",
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-paragraph\"><em class=\"brz-cp-color3\">Dean, School of Design</em></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-abovetitle\"><span class=\"brz-cp-color7\">Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenae. Sed molestie augue sit lore ipsum etiam at risus et justo.</span></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-fb-simple",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-twitter",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-instagram",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
                                                                        height: 40
                                                                    }
                                                                }
                                                            ],
                                                            showOnMobile: "off"
                                                        }
                                                    }
                                                ],
                                                bgColorPalette: "color8",
                                                bgColorHex: "",
                                                bgColorOpacity: 1,
                                                mobilePaddingRight: 10,
                                                mobilePaddingLeft: 10,
                                                margin: 15,
                                                marginSuffix: "px",
                                                marginTop: 15,
                                                marginRight: 15,
                                                marginBottom: 15,
                                                marginLeft: 15,
                                                paddingType: "grouped",
                                                padding: 0,
                                                paddingSuffix: "px",
                                                paddingTop: 0,
                                                paddingRight: 0,
                                                paddingBottom: 0,
                                                paddingLeft: 0,
                                                width: 25
                                            }
                                        },
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "image"
                                                                        ],
                                                                        imageWidth: 600,
                                                                        imageHeight: 600,
                                                                        imageSrc: "f2f3141491d13dbd5af5fbd568bbee54.jpg",
                                                                        height: 100,
                                                                        positionX: 50,
                                                                        positionY: 50,
                                                                        imagePopulation: ""
                                                                    }
                                                                }
                                                            ],
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
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
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--richText"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "RichText",
                                                                    value: {
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h5 class=\"brz-tp-heading5\"><strong class=\"brz-cp-color2\">Sinjay Appiah</strong></h5>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px",
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-paragraph\"><em class=\"brz-cp-color3\">Head of University Library</em></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-abovetitle\"><span class=\"brz-cp-color7\">Nulla at nulla justo, eget luctus tortor. Nulla facilisi. Duis ali quet egestas purus inblan dit. Rubit vulputate, ligula niascel erisque tempor, lacus orante.</span></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-fb-simple",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-twitter",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-instagram",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
                                                                        height: 40
                                                                    }
                                                                }
                                                            ],
                                                            showOnMobile: "off"
                                                        }
                                                    }
                                                ],
                                                bgColorPalette: "color8",
                                                bgColorHex: "",
                                                bgColorOpacity: 1,
                                                mobilePaddingRight: 10,
                                                mobilePaddingLeft: 10,
                                                margin: 15,
                                                marginSuffix: "px",
                                                marginTop: 15,
                                                marginRight: 15,
                                                marginBottom: 15,
                                                marginLeft: 15,
                                                paddingType: "grouped",
                                                padding: 0,
                                                paddingSuffix: "px",
                                                paddingTop: 0,
                                                paddingRight: 0,
                                                paddingBottom: 0,
                                                paddingLeft: 0,
                                                width: 25
                                            }
                                        },
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "image"
                                                                        ],
                                                                        imageWidth: 600,
                                                                        imageHeight: 600,
                                                                        imageSrc: "9c91fd01112a9756bacdcfdc1e9309ec.jpg",
                                                                        height: 100,
                                                                        positionX: 50,
                                                                        positionY: 50,
                                                                        imagePopulation: ""
                                                                    }
                                                                }
                                                            ],
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0,
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
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
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--richText"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "RichText",
                                                                    value: {
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h5 class=\"brz-tp-heading5\"><strong class=\"brz-cp-color2\">Deloria Merlani</strong></h5>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px",
                                                            marginBottom: 0,
                                                            marginBottomSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-paragraph\"><em class=\"brz-cp-color3\">Dean, School of Architecture</em></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-abovetitle\"><span class=\"brz-cp-color7\">Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper.</span></p>"
                                                                    }
                                                                }
                                                            ],
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-fb-simple",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-twitter",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                },
                                                                {
                                                                    type: "Icon",
                                                                    value: {
                                                                        _styles: [
                                                                            "icon"
                                                                        ],
                                                                        name: "logo-instagram",
                                                                        type: "glyph",
                                                                        size: "custom",
                                                                        customSize: 18,
                                                                        borderRadius: 0,
                                                                        colorPalette: "color5",
                                                                        colorOpacity: 1,
                                                                        hoverColorHex: "#f3c100",
                                                                        hoverColorOpacity: 0.6,
                                                                        hoverColorPalette: "color5",
                                                                        linkExternal: "#",
                                                                        linkExternalBlank: "off"
                                                                    }
                                                                }
                                                            ],
                                                            horizontalAlign: "left",
                                                            paddingType: "ungrouped",
                                                            paddingLeft: 30,
                                                            paddingLeftSuffix: "px",
                                                            padding: 0,
                                                            paddingRight: 30,
                                                            paddingRightSuffix: "px"
                                                        }
                                                    },
                                                    {
                                                        type: "Wrapper",
                                                        value: {
                                                            _styles: [
                                                                "wrapper",
                                                                "wrapper--spacer"
                                                            ],
                                                            items: [
                                                                {
                                                                    type: "Spacer",
                                                                    value: {
                                                                        _styles: [
                                                                            "spacer"
                                                                        ],
                                                                        height: 40
                                                                    }
                                                                }
                                                            ],
                                                            showOnMobile: "off"
                                                        }
                                                    }
                                                ],
                                                bgColorPalette: "color8",
                                                bgColorHex: "",
                                                bgColorOpacity: 1,
                                                mobilePaddingRight: 10,
                                                mobilePaddingLeft: 10,
                                                margin: 15,
                                                marginSuffix: "px",
                                                marginTop: 15,
                                                marginRight: 15,
                                                marginBottom: 15,
                                                marginLeft: 15,
                                                paddingType: "grouped",
                                                padding: 0,
                                                paddingSuffix: "px",
                                                paddingTop: 0,
                                                paddingRight: 0,
                                                paddingBottom: 0,
                                                paddingLeft: 0,
                                                width: 25
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        paddingType: "ungrouped",
                        paddingTop: 80,
                        paddingBottom: 91,
                        padding: 75,
                        bgColorPalette: "color6",
                        bgColorHex: "#9f9a95",
                        bgColorOpacity: 0.18,
                        tempBgColorOpacity: 0.18
                    }
                }
            ],
            _thumbnailSrc: 472624,
            _thumbnailWidth: 600,
            _thumbnailHeight: 307,
            _thumbnailTime: 1575279478540
        },
        blockId: "Blank000Light"
    },
    {
        type: "Section",
        value: {
            _styles: [
                "section"
            ],
            items: [
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<h2 class=\"brz-text-xs-center brz-text-lg-center brz-tp-heading2\"><span class=\"brz-cp-color2\">Student Stories</span></h2>"
                                            }
                                        }
                                    ]
                                }
                            },
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<p class=\"brz-tp-heading6 brz-text-lg-center brz-text-xs-center\"><em class=\"brz-cp-color7\">Don\u2019t take our word for it, listen to some of our students</em></p>"
                                            }
                                        }
                                    ],
                                    marginTop: 0,
                                    marginTopSuffix: "px",
                                    margin: 0
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ]
                                            }
                                        }
                                    ],
                                    showOnMobile: "off"
                                }
                            },
                            {
                                type: "Row",
                                value: {
                                    _styles: [
                                        "row"
                                    ],
                                    items: [
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "image"
                                                                        ],
                                                                        imageWidth: 800,
                                                                        imageHeight: 530,
                                                                        imageSrc: "1b727df01e662bee82ef27194db48d46.jpg",
                                                                        height: 151,
                                                                        positionX: 50,
                                                                        positionY: 50,
                                                                        mobileHeight: 100,
                                                                        imagePopulation: ""
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
                                                paddingType: "ungrouped",
                                                padding: 0,
                                                paddingSuffix: "px",
                                                paddingTop: 0,
                                                paddingRight: 20,
                                                paddingBottom: 0,
                                                paddingLeft: 0,
                                                paddingRightSuffix: "px",
                                                paddingLeftSuffix: "px",
                                                width: 45.6
                                            }
                                        },
                                        {
                                            type: "Column",
                                            value: {
                                                _styles: [
                                                    "column"
                                                ],
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<h2 class=\"brz-tp-heading2\"><strong class=\"brz-cp-color2\"><em>Anna:</em></strong><span class=\"brz-cp-color2\"> \u201cI have never thought I\u2019d ever like it in college. I loved it!\"</span></h2>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-subtitle\"><span class=\"brz-cp-color5\">ANNA MARTINOTTI</span></p>"
                                                                    }
                                                                }
                                                            ],
                                                            marginTop: 0,
                                                            marginTopSuffix: "px",
                                                            margin: 0
                                                        }
                                                    },
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
                                                                        _styles: [
                                                                            "richText"
                                                                        ],
                                                                        text: "<p class=\"brz-tp-paragraph\"><span class=\"brz-cp-color2\">Some classes can be easy, while others feel as if they've been created with the sole single purpose of torturing the minds of college students in this very demanding classroom. Lorem ipsum dolor sit amet, consectetur adipiscing elit vivamus luctus urna.</span></p>"
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ],
                                                width: 54.4,
                                                paddingLeft: 50,
                                                paddingLeftSuffix: "px",
                                                padding: 15,
                                                verticalAlign: "center"
                                            }
                                        }
                                    ],
                                    bgColorPalette: "color6",
                                    bgColorHex: "#9f9a95",
                                    bgColorOpacity: 0.15,
                                    mobilePaddingRight: 10,
                                    mobilePaddingLeft: 10,
                                    tempBgColorOpacity: 0.15,
                                    borderRadius: 0,
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    padding: 85,
                                    paddingSuffix: "px",
                                    paddingTop: 85,
                                    paddingRight: 85,
                                    paddingBottom: 85,
                                    paddingLeft: 85
                                }
                            }
                        ],
                        paddingType: "ungrouped",
                        paddingTop: 100,
                        paddingBottom: 140,
                        padding: 75,
                        containerSize: 100
                    }
                }
            ],
            _thumbnailSrc: 472625,
            _thumbnailWidth: 600,
            _thumbnailHeight: 329,
            _thumbnailTime: 1575279483344
        },
        blockId: "Blank000Light"
    },
    {
        type: "Section",
        blockId: "Blank000Light",
        value: {
            _styles: [
                "section"
            ],
            items: [
                {
                    type: "SectionItem",
                    value: {
                        _styles: [
                            "section-item"
                        ],
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
                                                _styles: [
                                                    "image"
                                                ],
                                                imageWidth: 1200,
                                                imageHeight: 1200,
                                                imageSrc: "9ae37c07d57e47f6aab6404f46be1b90.jpg",
                                                height: 100,
                                                positionX: 50,
                                                positionY: 50,
                                                resize: 15,
                                                borderRadiusType: "custom",
                                                borderRadius: 88,
                                                tempBorderRadius: 88
                                            }
                                        }
                                    ],
                                    mobileHorizontalAlign: "center"
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 10
                                            }
                                        }
                                    ]
                                }
                            },
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<h6 class=\"brz-text-xs-center brz-tp-heading6 brz-text-lg-center\"><em class=\"brz-cp-color8\">\u201cClass aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed molestie augue sit amet leo consequat posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia turae\u201d</em></h6>"
                                            }
                                        }
                                    ],
                                    paddingType: "ungrouped",
                                    paddingRight: 200,
                                    paddingRightSuffix: "px",
                                    padding: 0,
                                    paddingLeft: 200,
                                    paddingLeftSuffix: "px"
                                }
                            },
                            {
                                type: "Wrapper",
                                value: {
                                    _styles: [
                                        "wrapper",
                                        "wrapper--spacer"
                                    ],
                                    items: [
                                        {
                                            type: "Spacer",
                                            value: {
                                                _styles: [
                                                    "spacer"
                                                ],
                                                height: 30
                                            }
                                        }
                                    ]
                                }
                            },
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
                                                _styles: [
                                                    "richText"
                                                ],
                                                text: "<p class=\"brz-text-lg-center brz-tp-paragraph brz-text-xs-center\"><strong class=\"brz-cp-color2\">CHICAGO SUN TIME</strong></p>"
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        bgImageWidth: 1920,
                        bgImageHeight: 900,
                        bgImageSrc: "183f0f4092868ba6dae3c235608d319f.jpg",
                        bgPositionX: 50,
                        bgPositionY: 50,
                        bgColorOpacity: 0.85,
                        tempBgColorOpacity: 0.85,
                        tempMobileBgColorOpacity: 1,
                        bgColorPalette: "color3",
                        bgColorHex: "#099e6b",
                        paddingType: "ungrouped",
                        paddingTop: 100,
                        paddingBottom: 90,
                        padding: 75
                    }
                }
            ],
            _thumbnailSrc: 472626,
            _thumbnailWidth: 600,
            _thumbnailHeight: 191,
            _thumbnailTime: 1575279487715
        }
    }
]}
};