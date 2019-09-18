module.exports = {
id: "Gabi035Light",

thumbnailWidth: 600,
thumbnailHeight: 287,
title: "Gabi035Light",

keywords: "forms, contact",
cat: [0, 11, 15],
type: 0,

resolve: {
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
                    bgColorHex: "#ffffff",
                    bgColorOpacity: 1,
                    items: [
                        {
                            type: "Wrapper",
                            value: {
                                _styles: [
                                    "wrapper",
                                    "wrapper--richText"
                                ],
                                marginBottom: 0,
                                items: [
                                    {
                                        type: "RichText",
                                        value: {
                                            _styles: [
                                                "richText"
                                            ],
                                            text: "<h3 class=\"brz-tp-abovetitle brz-text-lg-center\"><span class=\"brz-cp-color3\" style=\"background-color: transparent;\">CONTACT US</span></h3>"
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
                                            text: "<h2 class=\"brz-text-lg-center brz-tp-heading2\"><span class=\"brz-cp-color2\" style=\"opacity: 1;\">Get In Touch</span></h2>"
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
                                            height: 20,
                                            mobileHeight: 20
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
                                    "wrapper--iconText"
                                ],
                                items: [
                                    {
                                        type: "Form",
                                        value: {
                                            _styles: [
                                                "form"
                                            ],
                                            items: [
                                                {
                                                    type: "FormFields",
                                                    value: {
                                                        items: [
                                                            {
                                                                type: "FormField",
                                                                value: {
                                                                    type: "Text",
                                                                    label: "Name",
                                                                    required: false,
                                                                    options: [
                                                                        "Option 1",
                                                                        "Option 2"
                                                                    ],
                                                                    width: 50,
                                                                    mobileWidth: 50
                                                                }
                                                            },
                                                            {
                                                                type: "FormField",
                                                                value: {
                                                                    label: "Email",
                                                                    required: false,
                                                                    options: [
                                                                        "Option 1",
                                                                        "Option 2"
                                                                    ],
                                                                    width: 50,
                                                                    mobileWidth: 50,
                                                                    type: "Email"
                                                                }
                                                            },
                                                            {
                                                                type: "FormField",
                                                                value: {
                                                                    type: "Select",
                                                                    label: "Project",
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
                                                                    options: [
                                                                        "Option 1",
                                                                        "Option 2"
                                                                    ],
                                                                    height: 140,
                                                                    mobileHeight: 140
                                                                }
                                                            }
                                                        ],
                                                        fontStyle: "paragraph",
                                                        fontWeight: 300,
                                                        lineHeight: 1.6999999999999999555910790149937383830547332763671875,
                                                        mobileFontStyle: "paragraph",
                                                        mobileFontSize: 15,
                                                        mobileLineHeight: 1.600000000000000088817841970012523233890533447265625,
                                                        bgColorPalette: "color8",
                                                        colorPalette: "color7",
                                                        borderColorPalette: "color7",
                                                        borderColorHex: "#73777f",
                                                        borderColorOpacity: 0.200000000000000011102230246251565404236316680908203125
                                                    }
                                                },
                                                {
                                                    type: "Button",
                                                    value: {
                                                        _styles: [
                                                            "button",
                                                            "submit"
                                                        ],
                                                        iconName: "",
                                                        iconType: "",
                                                        hoverBgColorOpacity: 1,
                                                        tempHoverBgColorOpacity: 1,
                                                        hoverBgColorHex: "#142850",
                                                        hoverBorderColorOpacity: 1,
                                                        hoverBorderColorHex: "#142850",
                                                        text: "SEND MESSAGE",
                                                        bgColorPalette: "color2",
                                                        tempBgColorPalette: "color2",
                                                        borderColorPalette: "color2",
                                                        tempBorderColorPalette: "color2"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    mobileBgColorHex: "#ffffff",
                    mobileBgColorOpacity: 1,
                    containerSize: 60
                }
            }
        ]
    }
}
};