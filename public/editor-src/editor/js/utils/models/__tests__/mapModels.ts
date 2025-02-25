import { pick } from "es-toolkit";
import { produce } from "immer";
import { Block } from "visual/types/Block";
import { mapModels } from "../";

describe("Testing 'mapModels' function", () => {
  const deepPatch = (model: Block): Block => {
    switch (model.type) {
      case "Column": {
        return {
          ...model,
          value: {
            ...model.value,
            align: "center"
          }
        };
      }
      case "Button": {
        return {
          ...model,
          value: {
            ...model.value,
            text: "Button updated"
          }
        };
      }
      default: {
        return model;
      }
    }
  };
  const testPatch = (model: Block): Block => ({
    ...model,
    value: {
      ...model.value,
      test: "test"
    }
  });
  const cleanValuePatch = (model: Block): Block => ({
    ...model,
    value: {}
  });
  const buttonPatch = (model: Block): Block => {
    if (model.type === "Button") {
      return {
        ...model,
        value: {
          ...model.value,
          text: "Button updated",
          bgColor: "red"
        }
      };
    }

    return model;
  };
  const menuPatch = (model: Block): Block => {
    if (model.type === "SectionMegaMenu") {
      return produce(model, (draft) => {
        draft.value.items.push({ type: "Button", value: { text: "button" } });
      });
    }

    if (model.value.menuSelected === "471a84e6df843550812ccb7d1d329dbc") {
      return produce(model, (draft) => {
        draft.value.fontFamily = "lato";
      });
    }

    return model;
  };
  const excludeKeys = (model: Block): Block => ({
    ...model,
    value: pick(model.value, ["id", "title"])
  });

  it.each([
    [
      {
        type: "Column",
        value: {
          align: "left",
          items: [
            {
              type: "Button",
              value: { text: "Button" }
            }
          ]
        }
      },
      {
        type: "Column",
        value: {
          align: "center",
          items: [
            {
              type: "Button",
              value: { text: "Button updated" }
            }
          ]
        }
      },
      deepPatch
    ],
    [
      {
        type: "Menu",
        value: { color: "#ffffff" }
      },
      {
        type: "Menu",
        value: { color: "#ffffff", test: "test" }
      },
      testPatch
    ],
    [
      {
        type: "Menu",
        value: {
          items: [
            {
              type: "Wrapper",
              value: { fontSize: 21 }
            }
          ]
        }
      },
      {
        type: "Menu",
        value: {
          test: "test",
          items: [
            {
              type: "Wrapper",
              value: { fontSize: 21, test: "test" }
            }
          ]
        }
      },
      testPatch
    ],
    [
      {
        type: "Menu",
        value: {
          items: [
            {
              type: "Wrapper",
              value: { fontSize: 21 }
            }
          ]
        }
      },
      {
        type: "Menu",
        value: {}
      },
      cleanValuePatch
    ],
    [
      {
        type: "Menu",
        value: {
          items: [
            {
              type: "MegaMenu",
              value: {
                items: [
                  {
                    type: "Button",
                    value: {
                      color: "red",
                      text: "Button",
                      items: [
                        {
                          type: "Popup",
                          value: {
                            items: [
                              {
                                type: "Button",
                                value: {
                                  color: "red",
                                  text: "Button"
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
              type: "Button",
              value: {
                color: "red",
                text: "Button"
              }
            }
          ]
        }
      },
      {
        type: "Menu",
        value: {
          items: [
            {
              type: "MegaMenu",
              value: {
                items: [
                  {
                    type: "Button",
                    value: {
                      color: "red",
                      bgColor: "red",
                      text: "Button updated",
                      items: [
                        {
                          type: "Popup",
                          value: {
                            items: [
                              {
                                type: "Button",
                                value: {
                                  color: "red",
                                  text: "Button updated",
                                  bgColor: "red"
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
              type: "Button",
              value: {
                color: "red",
                text: "Button updated",
                bgColor: "red"
              }
            }
          ]
        }
      },
      buttonPatch
    ],
    [
      {
        items: [
          {
            type: "Section",
            value: {
              items: [
                {
                  type: "SectionItem",
                  value: {
                    items: [
                      {
                        type: "Wrapper",
                        value: {
                          items: [
                            {
                              type: "Menu",
                              value: {
                                menuSelected:
                                  "471a84e6df843550812ccb7d1d329dbc",
                                fontFamily: "montserrat",
                                symbols: {
                                  "14aaef0f55887818a727f931661ad481": {
                                    megaMenuItems: [
                                      {
                                        type: "SectionMegaMenu",
                                        value: {
                                          items: [
                                            {
                                              type: "Wrapper",
                                              value: {
                                                items: [
                                                  {
                                                    type: "RichText",
                                                    value: {}
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
      },
      {
        items: [
          {
            type: "Section",
            value: {
              items: [
                {
                  type: "SectionItem",
                  value: {
                    items: [
                      {
                        type: "Wrapper",
                        value: {
                          items: [
                            {
                              type: "Menu",
                              value: {
                                menuSelected:
                                  "471a84e6df843550812ccb7d1d329dbc",
                                fontFamily: "lato",
                                symbols: {
                                  "14aaef0f55887818a727f931661ad481": {
                                    megaMenuItems: [
                                      {
                                        type: "SectionMegaMenu",
                                        value: {
                                          items: [
                                            {
                                              type: "Wrapper",
                                              value: {
                                                items: [
                                                  {
                                                    type: "RichText",
                                                    value: {}
                                                  }
                                                ]
                                              }
                                            },
                                            {
                                              type: "Button",
                                              value: { text: "button" }
                                            }
                                          ]
                                        }
                                      }
                                    ]
                                  }
                                }
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
      },
      menuPatch
    ],
    [
      {
        type: "Column",
        value: {
          id: "some id",
          title: "some title",
          description: "some desc",
          uid: "some uid"
        }
      },
      {
        type: "Column",
        value: {
          id: "some id",
          title: "some title"
        }
      },
      excludeKeys
    ]
  ])(".expect(%#)", (v, expected, cb) => {
    const toBe = mapModels(cb, v);
    expect(toBe).toStrictEqual(expected);
  });
});
