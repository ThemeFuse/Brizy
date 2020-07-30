import { t } from "visual/utils/i18n";

export default {
  id: "table",
  title: t("Table"),
  icon: "nc-table-element",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--table"],
      items: [
        {
          type: "Table",
          value: {
            _styles: ["table"],
            items: [
              {
                type: "TableHead",
                value: {
                  items: [
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Models",
                              items: []
                            }
                          },
                          {
                            type: "TableAside",
                            value: {
                              labelText: "iPhone X",
                              items: []
                            }
                          },
                          {
                            type: "TableAside",
                            value: {
                              labelText: "iPhone 8",
                              items: []
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                type: "TableBody",
                value: {
                  items: [
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Camera",
                              name: "camera-18",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "12MP Dual Camera",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "12MP Dual Camera",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Display",
                              name: "phone",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text:
                                            "5.8-inch ( diagonal ) all-screen OLED",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text:
                                            "4.7-inch ( diagonal ) widescreen LCD",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Front Camera",
                              name: "focus",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "TrueDepth camera",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "FaceTime HD camera",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Internal storage",
                              name: "disk-2",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "64GB",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "64GB",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Power and Battery",
                              name: "battery-83",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text:
                                            "Built-in rechargeable lithium‑ion battery",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text:
                                            "Built-in rechargeable lithium‑ion battery",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Processor",
                              name: "ram",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "hexa-core",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "hexa-core",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "RAM",
                              name: "archive",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "3GB",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "2GB",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Screen Resolution",
                              name: "fullscreen-double-74",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "5.65 inches",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "5.45 inches",
                                          _styles: ["richText"]
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
                    },
                    {
                      type: "TableRow",
                      value: {
                        items: [
                          {
                            type: "TableAside",
                            value: {
                              labelText: "Wireless Technologies",
                              name: "bluetooth",
                              type: "outline",
                              items: []
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "Bluetooth, WiFi Hotspot",
                                          _styles: ["richText"]
                                        }
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          },
                          {
                            type: "TableCol",
                            value: {
                              items: [
                                {
                                  type: "Wrapper",
                                  value: {
                                    _styles: ["wrapper", "wrapper--richText"],
                                    items: [
                                      {
                                        type: "RichText",
                                        value: {
                                          text: "WiFi Hotspot",
                                          _styles: ["richText"]
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
        }
      ]
    }
  }
};
