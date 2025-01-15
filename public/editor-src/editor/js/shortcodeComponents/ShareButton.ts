import { Network } from "visual/editorComponents/ShareButton/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "shareButton",
    title: t("Share Button"),
    icon: "nc-share-2",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--shareButton"],
        items: [
          {
            type: ElementTypes.ShareButton,
            value: {
              _styles: ["shareButton"],
              items: [
                {
                  type: ElementTypes.ShareButtonItem,
                  value: {
                    network: Network.Facebook,
                    labelText: "Facebook",
                    iconType: "glyph",
                    iconName: "logo-facebook"
                  }
                },
                {
                  type: ElementTypes.ShareButtonItem,
                  value: {
                    network: Network.Twitter,
                    labelText: "Twitter",
                    iconType: "glyph",
                    iconName: "logo-twitter"
                  }
                },
                {
                  type: ElementTypes.ShareButtonItem,
                  value: {
                    network: Network.Linkedin,
                    labelText: "Linkedin",
                    iconType: "glyph",
                    iconName: "logo-linkedin"
                  }
                }
              ]
            }
          }
        ]
      }
    }
  };
}
