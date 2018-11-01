import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarGallery",
      type: "popover",
      icon: "nc-gallery",
      title: t("Gallery"),
      position: 80,
      options: [
        {
          id: "gridColumn",
          label: t("Columns"),
          type: "slider",
          slider: {
            min: 1,
            max: 6
          },
          input: {
            show: true,
            max: 6
          },
          value: {
            value: v.gridColumn
          },
          onChange: ({ value: gridColumn }) => ({ gridColumn })
        },
        {
          id: "spacing",
          label: t("Spacing"),
          type: "slider",
          slider: {
            min: 0,
            max: 20
          },
          input: {
            show: true,
            min: 0,
            max: 20
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: v.spacing
          },
          onChange: ({ value: spacing }) => ({ spacing })
        },
        {
          id: "lightBox",
          label: t("LightBox"),
          type: "switch",
          value: v.lightBox
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "tabletToolbarGallery",
      type: "popover",
      icon: "nc-gallery",
      title: t("Gallery"),
      position: 80,
      options: [
        {
          id: "tabletGridColumn",
          label: t("Columns"),
          type: "slider",
          slider: {
            min: 1,
            max: 6
          },
          input: {
            show: true,
            max: 6
          },
          value: {
            value: v.tabletGridColumn
          },
          onChange: ({ value: tabletGridColumn }) => ({ tabletGridColumn })
        },
        {
          id: "tabletSpacing",
          label: t("Spacing"),
          type: "slider",
          slider: {
            min: 0,
            max: 20
          },
          input: {
            show: true,
            min: 0,
            max: 20
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: tabletSyncOnChange(v, "spacing")
          },
          onChange: ({ value: tabletSpacing }) => ({ tabletSpacing })
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarGallery",
      type: "popover",
      icon: "nc-gallery",
      title: t("Gallery"),
      position: 80,
      options: [
        {
          id: "mobileGridColumn",
          label: t("Columns"),
          type: "slider",
          slider: {
            min: 1,
            max: 3
          },
          input: {
            show: true,
            max: 3
          },
          value: {
            value: v.mobileGridColumn
          },
          onChange: ({ value: mobileGridColumn }) => ({ mobileGridColumn })
        },
        {
          id: "mobileSpacing",
          label: t("Spacing"),
          type: "slider",
          slider: {
            min: 0,
            max: 20
          },
          input: {
            show: true,
            min: 0,
            max: 20
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "px",
                value: "px"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "spacing")
          },
          onChange: ({ value: mobileSpacing }) => ({ mobileSpacing })
        }
      ]
    }
  ];
}
