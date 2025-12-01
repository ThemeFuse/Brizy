import loadable from "@loadable/component";
import { LoadableLoading } from "visual/component/LoadableLoading";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const ministryBrandsLazyComponents = {
  MinistryBrandsGroupLayout: {
    id: ElementTypes.MinistryBrandsGroupLayout,
    component: loadable(() => import("./MinistryBrandsGroupLayout"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsGroupLayout }) =>
        MinistryBrandsGroupLayout
    })
  },
  MinistryBrandsGroupSlider: {
    id: ElementTypes.MinistryBrandsGroupSlider,
    component: loadable(() => import("./MinistryBrandsGroupSlider"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsGroupSlider }) =>
        MinistryBrandsGroupSlider
    })
  },
  MinistryBrandsEventLayout: {
    id: ElementTypes.MinistryBrandsEventLayout,
    component: loadable(() => import("./MinistryBrandsEventLayout"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsEventLayout }) =>
        MinistryBrandsEventLayout
    })
  },
  MinistryBrandsEventCalendar: {
    id: ElementTypes.MinistryBrandsEventCalendar,
    component: loadable(() => import("./MinistryBrandsEventCalendar"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsEventCalendar }) =>
        MinistryBrandsEventCalendar
    })
  },
  MinistryBrandsSermonLayout: {
    id: ElementTypes.MinistryBrandsSermonLayout,
    component: loadable(() => import("./MinistryBrandsSermonLayout"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsSermonLayout }) =>
        MinistryBrandsSermonLayout
    })
  },
  MinistryBrandsSermonList: {
    id: ElementTypes.MinistryBrandsSermonList,
    component: loadable(() => import("./MinistryBrandsSermonList"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsSermonList }) =>
        MinistryBrandsSermonList
    })
  },
  MinistryBrandsSermonFeatured: {
    id: ElementTypes.MinistryBrandsSermonFeatured,
    component: loadable(() => import("./MinistryBrandsSermonFeatured"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsSermonFeatured }) =>
        MinistryBrandsSermonFeatured
    })
  },
  MinistryBrandsSermonDetail: {
    id: ElementTypes.MinistryBrandsSermonDetail,
    component: loadable(() => import("./MinistryBrandsSermonDetail"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsSermonDetail }) =>
        MinistryBrandsSermonDetail
    })
  },
  MinistryBrandsGroupList: {
    id: ElementTypes.MinistryBrandsGroupList,
    component: loadable(() => import("./MinistryBrandsGroupList"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsGroupList }) => MinistryBrandsGroupList
    })
  },
  MinistryBrandsGroupDetail: {
    id: ElementTypes.MinistryBrandsGroupDetail,
    component: loadable(() => import("./MinistryBrandsGroupDetail"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsGroupDetail }) =>
        MinistryBrandsGroupDetail
    })
  },
  MinistryBrandsEventFeatured: {
    id: ElementTypes.MinistryBrandsEventFeatured,
    component: loadable(() => import("./MinistryBrandsEventFeatured"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsEventFeatured }) =>
        MinistryBrandsEventFeatured
    })
  },
  MinistryBrandsGroupFeatured: {
    id: ElementTypes.MinistryBrandsGroupFeatured,
    component: loadable(() => import("./MinistryBrandsGroupFeatured"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsGroupFeatured }) =>
        MinistryBrandsGroupFeatured
    })
  },
  MinistryBrandsEventList: {
    id: ElementTypes.MinistryBrandsEventList,
    component: loadable(() => import("./MinistryBrandsEventList"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsEventList }) => MinistryBrandsEventList
    })
  },
  MinistryBrandsFormWidget: {
    id: ElementTypes.MinistryBrandsFormWidget,
    component: loadable(() => import("./MinistryBrandsFormWidget"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsFormWidget }) =>
        MinistryBrandsFormWidget
    })
  },
  MinistryBrandsStaffLayout: {
    id: ElementTypes.MinistryBrandsStaffLayout,
    component: loadable(() => import("./MinistryBrandsStaffLayout"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsStaffLayout }) =>
        MinistryBrandsStaffLayout
    })
  },
  MinistryBrandsEventDetail: {
    id: ElementTypes.MinistryBrandsEventDetail,
    component: loadable(() => import("./MinistryBrandsEventDetail"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsEventDetail }) =>
        MinistryBrandsEventDetail
    })
  },
  MinistryBrandsStaffList: {
    id: ElementTypes.MinistryBrandsStaffList,
    component: loadable(() => import("./MinistryBrandsStaffList"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsStaffList }) => MinistryBrandsStaffList
    })
  },
  MinistryBrandsPrayerWidget: {
    id: ElementTypes.MinistryBrandsPrayerWidget,
    component: loadable(() => import("./MinistryBrandsPrayerWidget"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsPrayerWidget }) =>
        MinistryBrandsPrayerWidget
    })
  },
  MinistryBrandsStaffFeatured: {
    id: ElementTypes.MinistryBrandsStaffFeatured,
    component: loadable(() => import("./MinistryBrandsStaffFeatured"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsStaffFeatured }) =>
        MinistryBrandsStaffFeatured
    })
  },
  MinistryBrandsArticleLayout: {
    id: ElementTypes.MinistryBrandsArticleLayout,
    component: loadable(() => import("./MinistryBrandsArticleLayout"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsArticleLayout }) =>
        MinistryBrandsArticleLayout
    })
  },
  MinistryBrandsStaffDetail: {
    id: ElementTypes.MinistryBrandsStaffDetail,
    component: loadable(() => import("./MinistryBrandsStaffDetail"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsStaffDetail }) =>
        MinistryBrandsStaffDetail
    })
  },
  MinistryBrandsArticleList: {
    id: ElementTypes.MinistryBrandsArticleList,
    component: loadable(() => import("./MinistryBrandsArticleList"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsArticleList }) =>
        MinistryBrandsArticleList
    })
  },
  MinistryBrandsArticleDetail: {
    id: ElementTypes.MinistryBrandsArticleDetail,
    component: loadable(() => import("./MinistryBrandsArticleDetail"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsArticleDetail }) =>
        MinistryBrandsArticleDetail
    })
  },
  MinistryBrandsArticleFeatured: {
    id: ElementTypes.MinistryBrandsArticleFeatured,
    component: loadable(() => import("./MinistryBrandsArticleFeatured"), {
      fallback: LoadableLoading,
      resolveComponent: ({ MinistryBrandsArticleFeatured }) =>
        MinistryBrandsArticleFeatured
    })
  }
};
