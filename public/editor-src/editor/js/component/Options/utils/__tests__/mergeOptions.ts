import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { mergeOptions } from "../mergeOptions";

describe("Testing 'mergeOptions' function", () => {
  test("merge options from grid", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "grid",
        columns: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                config: {
                  size: "short",
                  lines: 10
                }
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];
    const i2: ToolbarItemType[] = [
      {
        id: "test",
        type: "grid",
        columns: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                disabled: true
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  max: 100,
                  spinner: true
                }
              },
              {
                id: "o3",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];
    const r: ToolbarItemType[] = [
      {
        id: "test",
        type: "grid",
        columns: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                disabled: true,
                config: {
                  size: "short",
                  lines: 10
                }
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              },
              {
                id: "o3",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];

    expect(mergeOptions(i1, i2)).toStrictEqual(r);
  });
  test("merge options from tabs", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "tabs",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                config: {
                  size: "short",
                  lines: 10
                }
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];
    const i2: ToolbarItemType[] = [
      {
        id: "test",
        type: "tabs",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                disabled: true
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  max: 100,
                  spinner: true
                }
              },
              {
                id: "o3",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];
    const r: ToolbarItemType[] = [
      {
        id: "test",
        type: "tabs",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                disabled: true,
                config: {
                  size: "short",
                  lines: 10
                }
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              },
              {
                id: "o3",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];

    expect(mergeOptions(i1, i2)).toStrictEqual(r);
  });
  test("merge options from sidebarTabs", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "sidebarTabs",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                config: {
                  size: "short",
                  lines: 10
                }
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];
    const i2: ToolbarItemType[] = [
      {
        id: "test",
        type: "sidebarTabs",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                disabled: true
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  max: 100,
                  spinner: true
                }
              },
              {
                id: "o3",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];
    const r: ToolbarItemType[] = [
      {
        id: "test",
        type: "sidebarTabs",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea",
                disabled: true,
                config: {
                  size: "short",
                  lines: 10
                }
              }
            ]
          },
          {
            id: "col2",
            options: [
              {
                id: "o2",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              },
              {
                id: "o3",
                type: "number-dev",
                config: {
                  min: 10,
                  spinner: false
                }
              }
            ]
          }
        ]
      }
    ];

    expect(mergeOptions(i1, i2)).toStrictEqual(r);
  });
  test("merge options from group", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "group",
        options: [
          {
            id: "o1",
            type: "textarea",
            config: {
              size: "short",
              lines: 10
            }
          },
          {
            id: "o2",
            type: "number-dev",
            config: {
              min: 10,
              spinner: false
            }
          }
        ]
      }
    ];
    const i2: ToolbarItemType[] = [
      {
        id: "test",
        type: "group",
        options: [
          {
            id: "o1",
            type: "textarea",
            disabled: true
          },
          {
            id: "o2",
            type: "number-dev",
            config: {
              min: 10,
              max: 100,
              spinner: true
            }
          },
          {
            id: "o3",
            type: "number-dev",
            config: {
              min: 10,
              spinner: false
            }
          }
        ]
      }
    ];
    const r: ToolbarItemType[] = [
      {
        id: "test",
        type: "group",
        options: [
          {
            id: "o1",
            type: "textarea",
            disabled: true,
            config: {
              size: "short",
              lines: 10
            }
          },
          {
            id: "o2",
            type: "number-dev",
            config: {
              min: 10,
              spinner: false
            }
          },
          {
            id: "o3",
            type: "number-dev",
            config: {
              min: 10,
              spinner: false
            }
          }
        ]
      }
    ];

    expect(mergeOptions(i1, i2)).toStrictEqual(r);
  });
});
