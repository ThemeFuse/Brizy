import { ComponentExport } from "visual/types";

export const ministryBrandsComponentsManifest: Record<string, ComponentExport> =
  {
    ministryBrandsSermonLayout: {
      selector: ".brz-sermonLayout",
      export: () =>
        import("./MinistryBrandsSermonLayout/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsSermonList: {
      selector: ".brz-sermonList",
      export: () =>
        import("./MinistryBrandsSermonList/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsSermonDetail: {
      selector: ".brz-sermonDetail",
      export: () =>
        import("./MinistryBrandsSermonDetail/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsSermonFeatured: {
      selector: ".brz-sermonFeatured",
      export: () =>
        import("./MinistryBrandsSermonFeatured/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsStaffFeatured: {
      selector: ".brz-staffFeatured",
      export: () =>
        import("./MinistryBrandsStaffFeatured/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsStaffList: {
      selector: ".brz-staffList",
      export: () =>
        import("./MinistryBrandsStaffList/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsStaffLayout: {
      selector: ".brz-staffLayout",
      export: () =>
        import("./MinistryBrandsStaffLayout/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsStaffDetail: {
      selector: ".brz-staffDetail",
      export: () =>
        import("./MinistryBrandsStaffDetail/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsArticleLayout: {
      selector: ".brz-articleLayout",
      export: () =>
        import("./MinistryBrandsArticleLayout/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsArticleList: {
      selector: ".brz-articleList",
      export: () =>
        import("./MinistryBrandsArticleList/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsArticleDetail: {
      selector: ".brz-articleDetail",
      export: () =>
        import("./MinistryBrandsArticleDetail/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsArticleFeatured: {
      selector: ".brz-articleFeatured",
      export: () =>
        import("./MinistryBrandsArticleFeatured/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsEventLayout: {
      selector: ".brz-eventLayout",
      export: () =>
        import("./MinistryBrandsEventLayout/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsEventDetail: {
      selector: ".brz-eventDetail",
      export: () =>
        import("./MinistryBrandsEventDetail/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsEventCalendar: {
      selector: ".brz-eventCalendar .brz-eventCalendar-layout",
      export: () =>
        import("./MinistryBrandsEventCalendar/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsGroupLayout: {
      selector: ".brz-groupLayout",
      export: () =>
        import("./MinistryBrandsGroupLayout/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsGroupDetail: {
      selector: ".brz-groupDetail",
      export: () =>
        import("./MinistryBrandsGroupDetail/export").then((m) => ({
          default: m.fn
        }))
    },

    ministryBrandsGroupSlider: {
      selector: ".brz-groupSlider-swiper-wrapper",
      export: () => import("./MinistryBrandsGroupSlider/export")
    }
  };
