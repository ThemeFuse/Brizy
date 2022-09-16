import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Prop as WPPropConfig } from "visual/global/Config/types/configs/WP";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import {
  AllRule,
  BlockTypeRule,
  CollectionItemRule,
  CollectionTypeRule,
  DataCommon as PageCommon,
  GlobalBlock,
  Page,
  PageCollection,
  PageCustomer,
  Rule
} from "visual/types";
import { NoEmptyString } from "visual/utils/string/NoEmptyString";
import { CUSTOMER_TYPE, PAGES_GROUP_ID } from "../blocksConditions";
import { canUseConditionInPage, pageSplitRules } from "../getAllowedGBIds";

export const urlsCommon = {
  about: "",
  api: "",
  assets: "",
  customFile: "",
  editorFonts: "",
  image: "",
  pagePreview: "",
  preview: "",
  site: "",
  support: "",
  templateFonts: "",
  upgradeToPro: "",
  editorIcons: ""
};

export const projectCommon = {
  heartBeatInterval: 1,
  status: {
    locked: false,
    lockedBy: false
  }
};

export const configCommon: ConfigCommon = {
  branding: {
    name: "brizy"
  },
  editorVersion: "1",
  mode: "",
  taxonomies: [],
  postTypesTaxs: [],
  imageSizes: [],

  server: {
    maxUploadFileSize: 40
  }
};

interface Resolve {
  level1: undefined | Rule;
  level2: undefined | Rule;
  level3: undefined | Rule;
}

export const configWp: WPPropConfig = {
  page: "",
  templates: [],
  postType: "",
  postTypes: [],
  postLoopSources: [],
  hasSidebars: false,
  plugins: {},
  api: {
    url: "",
    hash: "",

    getProject: "",
    setProject: "",

    getPage: "",
    updatePage: "",

    getGlobalBlockList: "",
    createGlobalBlock: "",
    updateGlobalBlock: "",
    updateGlobalBlocks: "",

    createSavedBlock: "",
    deleteSavedBlock: "",
    getSavedBlockList: "",
    getSavedBlockByUid: "",
    downloadBlocks: "",

    createLayout: "",
    getLayoutList: "",
    getLayoutByUid: "",
    deleteLayout: "",
    uploadBlocks: "",
    downloadLayouts: "",

    getPostObjects: "",
    rulePostsGroupList: "",
    getMediaUid: "",
    setFeaturedImage: "",
    setFeaturedImageFocalPoint: "",
    removeFeaturedImage: "",
    getSidebars: "",
    shortcodeContent: "",
    getMenus: "",
    getFonts: "",
    getAttachmentUid: "",
    getRuleGroupList: ""
  },
  ruleMatches: [],
  availableRoles: [],
  availableTranslations: [],
  postAuthor: 0,
  postTerms: [],
  postTermParents: []
};

const pageCommon: PageCommon = {
  id: "1",
  status: "publish",
  dataVersion: 1,
  data: {
    items: [
      {
        type: "Section",
        value: {},
        blockId: ""
      }
    ]
  }
};

const page: Page = pageCommon;

const pageCollection: PageCollection = {
  ...pageCommon,
  id: "1",
  collectionType: {
    id: "collectionItem/1",
    title: "title"
  },
  fields: [],
  slug: "",
  title: ""
};

const pageCustomer: PageCustomer = {
  ...pageCommon,
  groups: [{ id: "role-1", name: "admin" }],
  title: ""
};

// @ts-expect-error: the TARGET is added from webpack, here we are hardcoded
const currentTarget = global.TARGET;

describe("testing WP getAllowedGBIds", () => {
  const allRule: AllRule = {
    type: BlockTypeRule.include
  };

  const typeRule: CollectionTypeRule = {
    type: BlockTypeRule.include,
    appliedFor: PAGES_GROUP_ID,
    entityType: "page" as NoEmptyString
  };

  const itemRule: CollectionItemRule = {
    mode: "specific",
    type: BlockTypeRule.include,
    appliedFor: PAGES_GROUP_ID,
    entityType: "page",
    entityValues: ["1"]
  };

  beforeAll(() => {
    // @ts-expect-error: the TARGET is added from webpack, here we are hardcoded
    global.TARGET = "WP";
    const baseTerm = {
      count: 0,
      filter: "",
      name: "",
      parent: 0,
      slug: "",
      term_group: 0,
      term_taxonomy_id: 0,
      description: ""
    };
    Config.init({
      ...configCommon,
      user: {
        isAuthorized: false,
        role: "admin",
        isGuest: false,
        allowScripts: false
      },
      urls: {
        ...urlsCommon,
        assetsExternal: "",
        backToDashboard: "",
        blockThumbnails: "",
        changeTemplate: "",
        dashboardNavMenu: "",
        pluginSettings: "",
        templateIcons: "",
        templateThumbnails: ""
      },
      project: {
        ...projectCommon,
        id: ""
      },
      dynamicContent: {
        [DCTypes.image]: [],
        [DCTypes.link]: [],
        [DCTypes.richText]: []
      },
      wp: {
        ...configWp,
        page: "1",
        postAuthor: 1,
        postTermParents: [
          {
            ...baseTerm,
            taxonomy: "category",
            term_id: 1
          },
          {
            ...baseTerm,
            taxonomy: "post_tag",
            term_id: 2
          }
        ],
        postTerms: [
          {
            ...baseTerm,
            taxonomy: "category",
            term_id: 1
          },
          {
            ...baseTerm,
            taxonomy: "post_tag",
            term_id: 2
          },
          {
            ...baseTerm,
            taxonomy: "post_tag",
            term_id: 3
          },
          {
            ...baseTerm,
            taxonomy: "post_tag",
            term_id: 4
          }
        ],
        ruleMatches: [
          {
            type: 1,
            group: PAGES_GROUP_ID,
            entityType: "page",
            values: []
          }
        ]
      }
    });
  });

  afterAll(() => {
    // @ts-expect-error: the TARGET is added from webpack, here we are hardcoded
    global.TARGET = currentTarget;
  });

  test.each<[Rule[], Page, Resolve]>([
    [[], page, { level1: undefined, level2: undefined, level3: undefined }],
    [
      [allRule, typeRule, itemRule],
      page,
      {
        level1: itemRule,
        level2: typeRule,
        level3: allRule
      }
    ],
    [
      [allRule, typeRule, itemRule],
      { ...page, id: "2" },
      {
        level1: undefined,
        level2: typeRule,
        level3: allRule
      }
    ],
    [
      [
        { ...typeRule, entityType: "blog" },
        { ...itemRule, entityValues: ["2"] }
      ],
      page,
      {
        level1: undefined,
        level2: undefined,
        level3: undefined
      }
    ],
    [
      [
        { ...typeRule, entityType: "blog" },
        { ...itemRule, entityValues: ["2"] }
      ],
      page,
      {
        level1: undefined,
        level2: undefined,
        level3: undefined
      }
    ]
  ])("pageSplitRules nr %#", (rules, page, resolve) => {
    expect(pageSplitRules(rules, page)).toStrictEqual(resolve);
  });

  test.each<[GlobalBlock, Page, boolean]>([
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [itemRule],
        position: null,
        meta: {
          type: "popup",
          extraFontStyles: []
        }
      },
      page,
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [typeRule],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [allRule],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [{ ...itemRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [{ ...typeRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [{ ...allRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [itemRule],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      { ...page, id: "2" },
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [allRule, { ...itemRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [itemRule, { ...typeRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],

    //#region Author
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["author|"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["author|1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["author|2"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],

    //#endregion

    //#region In

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["in|category"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["in|category|1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["in|category|10"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["in|fake_category"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["in|fake_category|1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],

    //#endregion

    //#region Child
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["child|post_tag"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["child|post_tag|2"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      true
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["child|post_tag|10"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["child|post_fake"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ],

    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityValues: ["child|post_fake|2"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      page,
      false
    ]

    //#endregion
  ])("canUseConditionInPage nr %#", (globalBlock, page, resolve) => {
    expect(canUseConditionInPage(globalBlock, page)).toBe(resolve);
  });
});

describe("testing Cloud getAllowedGBIds", () => {
  const allRule: AllRule = {
    type: BlockTypeRule.include
  };

  const typeRule: CollectionTypeRule = {
    type: BlockTypeRule.include,
    appliedFor: PAGES_GROUP_ID,
    entityType: "collectionItem/1" as NoEmptyString
  };

  const itemRule: CollectionItemRule = {
    mode: "specific",
    type: BlockTypeRule.include,
    appliedFor: PAGES_GROUP_ID,
    entityType: "collectionItem/1",
    entityValues: ["1"]
  };

  beforeAll(() => {
    // @ts-expect-error: the IS_CLOUD is added from webpack, here we are hardcoded
    global.TARGET = "cloud";
    Config.init({
      ...configCommon,
      //@ts-expect-error: implicit set cms
      platform: "cms",
      user: {
        isAuthorized: false,
        role: "admin",
        isGuest: false,
        allowScripts: false
      },
      cms: {
        adminUrl: "",
        apiUrl: "",
        blogId: "",
        supportLinks: {
          customCss: undefined,
          codeInject: undefined,
          webhooks: undefined,
          redirects: undefined,
          acf: undefined,
          users: undefined,
          orders: undefined,
          discount: undefined
        },
        customerEditorUrl: "",
        customerPreviewUrl: "",
        collectionPreviewUrl: "",
        translationsApiUrl: "",
        notificationsApiUrl: ""
      },
      urls: {
        ...urlsCommon,
        assetsExternal: "",
        backToDashboard: "",
        blockThumbnails: "",
        changeTemplate: "",
        dashboardNavMenu: "",
        pluginSettings: "",
        templateIcons: "",
        templateThumbnails: ""
      },
      project: {
        ...projectCommon,
        id: 1,
        apiVersion: 2,
        protectedPagePassword: ""
      },
      dynamicContent: {
        [DCTypes.image]: [],
        [DCTypes.link]: [],
        [DCTypes.richText]: []
      }
    });
  });

  //#region pageSplitRules

  test.each<[Rule[], Page, Resolve]>([
    [
      [],
      pageCollection,
      { level1: undefined, level2: undefined, level3: undefined }
    ],
    [
      [allRule, typeRule, itemRule],
      pageCollection,
      {
        level1: itemRule,
        level2: typeRule,
        level3: allRule
      }
    ],
    [
      [allRule, typeRule, itemRule],
      { ...pageCollection, id: "2" },
      {
        level1: undefined,
        level2: typeRule,
        level3: allRule
      }
    ],
    [
      [
        { ...typeRule, entityType: "blog" },
        { ...itemRule, entityValues: ["2"] }
      ],
      pageCollection,
      {
        level1: undefined,
        level2: undefined,
        level3: undefined
      }
    ],
    [
      [
        { ...typeRule, entityType: "blog" },
        { ...itemRule, entityValues: ["2"] }
      ],
      pageCollection,
      {
        level1: undefined,
        level2: undefined,
        level3: undefined
      }
    ]
  ])("pageSplitRules nr %#", (rules, page, resolve) => {
    expect(pageSplitRules(rules, page)).toStrictEqual(resolve);
  });

  //#endregion

  //#region canUseConditionInPage

  test.each<[GlobalBlock, Page, boolean]>([
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [itemRule],
        position: null,
        meta: {
          type: "popup",
          extraFontStyles: []
        }
      },
      pageCollection,
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [typeRule],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [allRule],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [{ ...itemRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [{ ...typeRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [{ ...allRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [itemRule],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      { ...pageCollection, id: "2" },
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [allRule, { ...itemRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [itemRule, { ...typeRule, type: BlockTypeRule.exclude }],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCollection,
      true
    ],

    // Specific case in CollectionItem: rules with reference and multiReference
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityType: "my-id-1",
            entityValues: ["field_type_id1:collection_item-id1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      {
        ...pageCollection,
        fields: [
          {
            __typename: "CollectionItemFieldReference",
            id: "1",
            type: {
              __typename: "CollectionTypeFieldText",
              id: "field_type_id1",
              slug: "",
              collectionType: {
                __typename: "CollectionType",
                id: "my-id-1",
                title: ""
              }
            },
            referenceValues: {
              __typename: "CollectionItemFieldReferenceValues",
              collectionItem: {
                __typename: "CollectionItemReference",
                id: "collection_item-id1"
              }
            }
          }
        ]
      },
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityType: "my-id-1",
            entityValues: ["filedMultiRefId1:my-ref-id-1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      {
        ...pageCollection,
        fields: [
          {
            __typename: "CollectionItemFieldMultiReference",
            id: "1",
            type: {
              __typename: "CollectionTypeFieldText",
              id: "filedMultiRefId1",
              slug: "",
              collectionType: {
                __typename: "CollectionType",
                id: "my-id-1",
                title: ""
              }
            },
            multiReferenceValues: {
              __typename: "CollectionItemFieldMultiReferenceValues",
              collectionItems: [
                {
                  __typename: "CollectionItemReference",
                  id: "my-ref-id-1"
                }
              ]
            }
          }
        ]
      },
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityType: "my-id-1",
            entityValues: ["filedMultiRefId1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      {
        ...pageCollection,
        fields: [
          {
            __typename: "CollectionItemFieldMultiReference",
            id: "1",
            type: {
              __typename: "CollectionTypeFieldText",
              id: "filedMultiRefId1",
              slug: "",
              collectionType: {
                __typename: "CollectionType",
                id: "my-id-1",
                title: ""
              }
            },
            multiReferenceValues: {
              __typename: "CollectionItemFieldMultiReferenceValues",
              collectionItems: [
                {
                  __typename: "CollectionItemReference",
                  id: "my-ref-id-1"
                }
              ]
            }
          }
        ]
      },
      true
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityType: "my-id-1",
            entityValues: ["filedMultiRefId1:my-ref-id-2"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      {
        ...pageCollection,
        fields: [
          {
            __typename: "CollectionItemFieldMultiReference",
            id: "1",
            type: {
              __typename: "CollectionTypeFieldText",
              id: "filedMultiRefId1",
              slug: "",
              collectionType: {
                __typename: "CollectionType",
                id: "my-id-1",
                title: ""
              }
            },
            multiReferenceValues: {
              __typename: "CollectionItemFieldMultiReferenceValues",
              collectionItems: [
                {
                  __typename: "CollectionItemReference",
                  id: "my-ref-id-1"
                }
              ]
            }
          }
        ]
      },
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityType: "my-id-1",
            entityValues: ["filedMultiRefId1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      {
        ...pageCollection,
        fields: [
          {
            __typename: "CollectionItemFieldMultiReference",
            id: "1",
            type: {
              __typename: "CollectionTypeFieldText",
              id: "filedMultiRefId2",
              slug: "",
              collectionType: {
                __typename: "CollectionType",
                id: "my-id-1",
                title: ""
              }
            },
            multiReferenceValues: {
              __typename: "CollectionItemFieldMultiReferenceValues",
              collectionItems: [
                {
                  __typename: "CollectionItemReference",
                  id: "my-ref-id-1"
                }
              ]
            }
          }
        ]
      },
      false
    ],
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            mode: "reference",
            entityType: "my-id-2",
            entityValues: ["filedMultiRefId2"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      {
        ...pageCollection,
        fields: [
          {
            __typename: "CollectionItemFieldMultiReference",
            id: "1",
            type: {
              __typename: "CollectionTypeFieldText",
              id: "filedMultiRefId2",
              slug: "",
              collectionType: {
                __typename: "CollectionType",
                id: "my-id-1",
                title: ""
              }
            },
            multiReferenceValues: {
              __typename: "CollectionItemFieldMultiReferenceValues",
              collectionItems: [
                {
                  __typename: "CollectionItemReference",
                  id: "my-ref-id-1"
                }
              ]
            }
          }
        ]
      },
      false
    ],

    // Specific case in CustomerPage: rules with group
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            entityType: CUSTOMER_TYPE,
            entityValues: ["role-1"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCustomer,
      true
    ],

    // Specific case in CustomerPage: rules with group
    [
      {
        data: {
          blockId: "b1",
          type: "Section",
          value: {}
        },
        status: "publish",
        rules: [
          {
            ...itemRule,
            entityType: CUSTOMER_TYPE,
            entityValues: ["role-2"]
          }
        ],
        position: null,
        meta: {
          type: "normal",
          extraFontStyles: []
        }
      },
      pageCustomer,
      false
    ]
  ])("canUseConditionInPage nr %#", (globalBlock, page, resolve) => {
    expect(canUseConditionInPage(globalBlock, page)).toBe(resolve);
  });

  //#endregion
});
