import { makeAttr } from "visual/utils/i18n/attribute";

export default function ($node) {
  const disqusBlock = $node.find("#disqus_thread");

  if (disqusBlock.length) {
    const shortname = disqusBlock.attr(makeAttr("shortname"));
    const url = disqusBlock.attr(makeAttr("url"));
    const identifier = disqusBlock.attr(makeAttr("identifier"));

    // global was added since this variable does not work differently
    global.disqus_config = function () {
      this.page.url = url;
      this.page.identifier = identifier;
    };

    (function () {
      let d = document,
        s = d.createElement("script");
      s.src = `https://${shortname}.disqus.com/embed.js`;
      s.setAttribute(makeAttr("timestamp"), +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }
}
