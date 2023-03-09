import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { mergeOptions } from "../mergeOptions";

describe("Testing 'mergeOptions' function", () => {
  test("merge options from grid-dev", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "grid-dev",
        columns: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
        type: "grid-dev",
        columns: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
        type: "grid-dev",
        columns: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
  test("merge options from tabs-dev", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "tabs-dev",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
        type: "tabs-dev",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
        type: "tabs-dev",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
  test("merge options from sidebarTabs-dev", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "sidebarTabs-dev",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
        type: "sidebarTabs-dev",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
        type: "sidebarTabs-dev",
        tabs: [
          {
            id: "col1",
            options: [
              {
                id: "o1",
                type: "textarea-dev",
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
  test("merge options from group-dev", () => {
    const i1: ToolbarItemType[] = [
      {
        id: "test",
        type: "group-dev",
        options: [
          {
            id: "o1",
            type: "textarea-dev",
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
        type: "group-dev",
        options: [
          {
            id: "o1",
            type: "textarea-dev",
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
        type: "group-dev",
        options: [
          {
            id: "o1",
            type: "textarea-dev",
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
