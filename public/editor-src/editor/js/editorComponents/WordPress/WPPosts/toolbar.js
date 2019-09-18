import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementWPPostsType,
  toolbarElementWPPostsNumber,
  toolbarElementWPPostsCategory,
  toolbarElementWPPostsAuthor,
  toolbarElementWPPostsInclude,
  toolbarElementWPPostsExclude,
  toolbarElementWPPostsStatus,
  toolbarElementWPPostsMetaKey,
  toolbarElementWPPostsMetaValue,
  toolbarElementWPPostsOrderBy,
  toolbarElementWPPostsOrder,
  toolbarSizeWidthWidthPercent,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: defaultValueKey({ key: "toolbarWPPosts", device, state: "normal" }),
      type: "popover",
      icon: "nc-wp-shortcode",
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "WPPostsTabs",
          type: "tabs",
          tabs: [
            {
              id: "queryTab",
              label: t("Query"),
              options: [
                toolbarElementWPPostsType({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsNumber({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsCategory({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsAuthor({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsInclude({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsExclude({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsStatus({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsMetaKey({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsMetaValue({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            },
            {
              id: "layoutTab",
              label: "Layout",
              options: [
                toolbarElementWPPostsOrderBy({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                toolbarElementWPPostsOrder({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: defaultValueKey({ key: "toolbarSettings", device, state: "normal" }),
      type: "popover",
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({
          v,
          device,
          state: "normal"
        }),
        {
          id: defaultValueKey({
            key: "advancedSettings",
            device,
            state: "normal"
          }),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              devices: "desktop",
              align: "start",
              tabs: [
                {
                  id: defaultValueKey({
                    key: "moreSettingsAdvanced",
                    device,
                    state: "normal"
                  }),
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    toolbarCustomCSS({
                      v,
                      device,
                      state: "normal",
                      devices: "desktop"
                    })
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
