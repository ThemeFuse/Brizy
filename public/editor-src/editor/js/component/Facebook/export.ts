import { makeAttr } from "visual/utils/i18n/attribute";

function loadFacebookSDK(lang: string, appId: string): void {
  const scriptId = "facebook-jssdk";

  if (document.getElementById(scriptId)) {
    return;
  }

  const fbRoot = document.createElement("div");
  const fbScript = document.createElement("script");
  const firstScript = document.getElementsByTagName("script")[0];
  const sdkSrc = `https://connect.facebook.net/${lang}/sdk.js#xfbml=1&version=v3.1&appId=${appId}`;

  fbRoot.className = "fb-root";
  document.body.appendChild(fbRoot);

  fbScript.id = scriptId;
  fbScript.src = sdkSrc;
  fbScript.setAttribute(makeAttr("consent"), "marketing");
  firstScript.parentNode?.insertBefore(fbScript, firstScript);
}

export default function (node: HTMLElement): void {
  const facebookElement = node.querySelector(".brz-facebook");
  const fbRoot = node.querySelector(".fb-root");

  if (facebookElement && !fbRoot) {
    const lang = facebookElement.getAttribute("data-lang") ?? "en";
    const appId = facebookElement.getAttribute("appid") ?? "";
    const instagramEmbed = node.querySelector(".brz-instagram-feed");

    if (instagramEmbed) {
      // Wait for Instagram to be ready before loading Facebook SDK, otherwise the instagram feed will not be displayed
      window.Brz.on("instagram.ready", () => {
        loadFacebookSDK(lang, appId);
      });
    } else {
      loadFacebookSDK(lang, appId);
    }
  }
}
