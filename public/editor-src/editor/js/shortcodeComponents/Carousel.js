const { t } = global.Brizy;

export default {
  id: "carousel",
  title: t("Carousel"),
  icon: "nc-carousel",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--carousel"],
      items: [
        {
          type: "Carousel",
          value: {
            _styles: ["carousel"],
            items: [
              {
                type: "Column",
                value: {
                  _styles: ["column", "column--carousel"],
                  items: [
                    {
                      type: "Wrapper",
                      value: {
                        _styles: ["wrapper", "wrapper--image"],
                        items: [
                          {
                            type: "Image",
                            value: {
                              _styles: ["image"]
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
                              _styles: ["richText", "richText--carousel"]
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
              },
              {
                type: "Column",
                value: {
                  _styles: ["column", "column--carousel"],
                  items: [
                    {
                      type: "Wrapper",
                      value: {
                        _styles: ["wrapper", "wrapper--image"],
                        items: [
                          {
                            type: "Image",
                            value: {
                              _styles: ["image"]
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
                              _styles: ["richText", "richText--carousel"]
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
              },
              {
                type: "Column",
                value: {
                  _styles: ["column", "column--carousel"],
                  items: [
                    {
                      type: "Wrapper",
                      value: {
                        _styles: ["wrapper", "wrapper--image"],
                        items: [
                          {
                            type: "Image",
                            value: {
                              _styles: ["image"]
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
                              _styles: ["richText", "richText--carousel"]
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
              },
              {
                type: "Column",
                value: {
                  _styles: ["column", "column--carousel"],
                  items: [
                    {
                      type: "Wrapper",
                      value: {
                        _styles: ["wrapper", "wrapper--image"],
                        items: [
                          {
                            type: "Image",
                            value: {
                              _styles: ["image"]
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
                              _styles: ["richText", "richText--carousel"]
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
        }
      ]
    }
  }
};
