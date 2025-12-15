import { checkValue, checkValue2 } from "visual/utils/checkValue";
import { Color, Columns, Network, TargetUrl, View } from "./types";

export const getNetworkInfo = (network: Network) => {
  switch (network) {
    case Network.Facebook:
      return {
        iconName: "facebook",
        iconType: "fa",
        labelText: "Facebook",
        networkUrl: "https://www.facebook.com/sharer/sharer.php?u=",
        colorBgText: "#314d89",
        colorBgIcon: "#3B5990"
      };
    case Network.Twitter:
      return {
        iconName: "logo-twitter",
        iconType: "glyph",
        labelText: "Twitter",
        networkUrl: "https://twitter.com/share?url=",
        colorBgText: "#1794e1",
        colorBgIcon: "#1da1f0"
      };
    case Network.Linkedin:
      return {
        iconName: "logo-linkedin",
        iconType: "glyph",
        labelText: "Linkedin",
        networkUrl: "https://www.linkedin.com/feed/?shareActive=true&text=",
        colorBgText: "#016daa",
        colorBgIcon: "#0077b5"
      };
    case Network.Pinterest:
      return {
        iconName: "logo-pinterest",
        iconType: "glyph",
        labelText: "Pinterest",
        networkUrl: "https://pinterest.com/pin/create/button/?url=",
        colorBgText: "#a50517",
        colorBgIcon: "#bd081c"
      };
    case Network.Reddit:
      return {
        iconName: "logo-reddit",
        iconType: "glyph",
        labelText: "Reddit",
        networkUrl: "https://reddit.com/submit/?url=",
        colorBgText: "#e13d00",
        colorBgIcon: "#ff4500"
      };
    case Network.VK:
      return {
        iconName: "logo-vk",
        iconType: "glyph",
        labelText: "VK",
        networkUrl: "https://vk.com/share.php?url=",
        colorBgText: "#405e82",
        colorBgIcon: "#45668e"
      };
    case Network.OK:
      return {
        iconName: "odnoklassniki-square",
        iconType: "fa",
        labelText: "OK",
        networkUrl: "https://connect.ok.ru/offer?url=",
        colorBgText: "#e16918",
        colorBgIcon: "#f4731c"
      };
    case Network.Tumblr:
      return {
        iconName: "logo-tumblr",
        iconType: "glyph",
        labelText: "Tumblr",
        networkUrl: "https://tumblr.com/widgets/share/tool?canonicalUrl=",
        colorBgText: "#2f3e51",
        colorBgIcon: "#35465c"
      };
    case Network.Skype:
      return {
        iconName: "logo-skype",
        iconType: "glyph",
        labelText: "Skype",
        networkUrl: "https://web.skype.com/share?url=",
        colorBgText: "#00a4e1",
        colorBgIcon: "#00aff0"
      };
    case Network.Telegram:
      return {
        iconName: "telegram",
        iconType: "fa",
        labelText: "Telegram",
        networkUrl: "https://t.me/share/url?url=",
        colorBgText: "#299ad1",
        colorBgIcon: "#2ca5e0"
      };
    case Network.Pocket:
      return {
        iconName: "get-pocket",
        iconType: "fa",
        labelText: "Pocket",
        networkUrl: "https://getpocket.com/edit?url=",
        colorBgText: "#ec374e",
        colorBgIcon: "#fe4961"
      };
    case Network.XING:
      return {
        iconName: "xing-square",
        iconType: "fa",
        labelText: "XING",
        networkUrl: "https://www.xing.com/spi/shares/new?url=",
        colorBgText: "#015253",
        colorBgIcon: "#026466"
      };
    case Network.WhatsApp:
      return {
        iconName: "logo-whatsapp",
        iconType: "glyph",
        labelText: "WhatsApp",
        networkUrl: "https://wa.me/?text=",
        colorBgText: "#26c863",
        colorBgIcon: "#25d366"
      };
    case Network.Email:
      return {
        iconName: "email-85",
        iconType: "glyph",
        labelText: "Email",
        networkUrl: "https://mail.google.com/mail/u/0/?view=cm&to&su=",
        colorBgText: "#df4336",
        colorBgIcon: "#f14638"
      };
  }
};

export const getNetworkType = checkValue2<Network>(Network);
export const getView = checkValue2<View>(View);
export const getColor = checkValue2<Color>(Color);
export const getTargetUrl = checkValue2<TargetUrl>(TargetUrl);

export const getColumns = checkValue<Columns>([
  "auto",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6"
]);
