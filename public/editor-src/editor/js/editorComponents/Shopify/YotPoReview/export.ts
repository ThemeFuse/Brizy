import { decodeFromString } from "visual/utils/string";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  const setScript = (str: string) => {
    const head = document.head;
    const script = document.createElement("script");
    script.id = "yotPo-review";
    script.type = "text/javascript";
    script.async = true;
    script.src = `//staticw2.yotpo.com/${str}/widget.js`;
    head.append(script);
  };

  try {
    const yotpo = node.querySelector(".brz-yotpo-review");
    const child = yotpo?.firstChild as HTMLElement | null;

    if (child?.classList.contains("bottomLine")) {
      const appKey = child.getAttribute("data-appkey");

      const appkey =
        appKey && appKey.length !== 0 ? decodeFromString<string>(appKey) : "";
      setScript(appkey);
    }
  } catch (error) {
    console.error(error);
  }
}
