export default function($node) {
  const disqusBlock = $node.find("#disqus_thread");

  if (disqusBlock.length) {
    const shortname = disqusBlock.attr("data-shortname");
    const url = disqusBlock.attr("data-url");
    const identifier = disqusBlock.attr("data-identifier");

    // global was added since this variable does not work differently
    global.disqus_config = function() {
      this.page.url = url;
      this.page.identifier = identifier;
    };

    (function() {
      let d = document,
        s = d.createElement("script");
      s.src = `https://${shortname}.disqus.com/embed.js`;
      s.setAttribute("data-timestamp", +new Date());
      (d.head || d.body).appendChild(s);
    })();
  }
}
