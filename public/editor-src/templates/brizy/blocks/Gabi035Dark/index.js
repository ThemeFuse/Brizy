export default {
id: "Gabi035Dark",
thumbnailSrc: require("./Preview.jpg"),
thumbnailWidth: 600,
thumbnailHeight: 287,
title: "Gabi035Dark", 

keywords: "forms, contact",
cat: [0, 11, 16],
type: 1,
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
                    bgColorHex: "#191b21",
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
                                            text: "<h2 class=\"brz-tp-heading2 brz-text-lg-center\"><span style=\"opacity: 1;\" class=\"brz-cp-color8\">Get In Touch</span></h2>"
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
                                                                    label: "Name",
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
                                                                    label: "Email",
                                                                    required: false,
                                                                    options: [
                                                                        "Option 1",
                                                                        "Option 2"
                                                                    ],
                                                                    width: 50,
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
                                                                    height: 140
                                                                }
                                                            }
                                                        ],
                                                        fontStyle: "paragraph",
                                                        fontWeight: 300,
                                                        lineHeight: 1.7,
                                                        mobileFontStyle: "paragraph",
                                                        mobileFontSize: 15,
                                                        mobileLineHeight: 1.6,
                                                        bgColorPalette: "color2",
                                                        bgColorHex: "#142850",
                                                        bgColorOpacity: 0.1,
                                                        borderColorPalette: "color7",
                                                        borderColorHex: "#73777f",
                                                        borderColorOpacity: 0.4,
                                                        colorPalette: "color7",
                                                        colorOpacity: 1
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
                                                        hoverBorderColorHex: "#142850",
                                                        text: "SEND MESSAGE",
                                                        hoverBgColorPalette: "color8",
                                                        hoverBorderColorPalette: "color8",
                                                        tempHoverBorderColorPalette: "color8",
                                                        hoverColorPalette: "color1"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    containerSize: 60
                }
            }
        ]
    }
}
};