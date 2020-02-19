export default function() {
  let disqusBlock = document.getElementById("disqus_thread");

  if (disqusBlock) {
    let shortname = disqusBlock.getAttribute("data-shortname");
    let url = disqusBlock.getAttribute("data-url");
    let identifier = disqusBlock.getAttribute("data-identifier");

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
