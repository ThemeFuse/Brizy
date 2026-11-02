import { makeAttr } from "visual/utils/i18n/attribute";
export default function (node) {
  const disqusBlock = node.querySelector("#disqus_thread");

  if (disqusBlock) {
    const shortname = disqusBlock.getAttribute("data-shortname") ?? undefined;
    const url = disqusBlock.getAttribute("data-url") ?? undefined;
    const identifier = disqusBlock.getAttribute("data-identifier") ?? undefined;

    // global was added since this variable does not work differently
    global.disqus_config = function () {
      this.page.url = url;
      this.page.identifier = identifier;
    };

    (() => {
      const d = document,
        s = d.createElement("script");
      s.src = `https://${shortname}.disqus.com/embed.js`;
      s.setAttribute("data-timestamp", Date.now());
      s.setAttribute(makeAttr("consent"), "marketing");
      (d.head || d.body).appendChild(s);
    })();
  }
}
