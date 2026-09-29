// Markup fixtures shaped like what `component/Background/Background.tsx` renders and the compiler
// writes into a published page. Inline sizes are mandatory: jsdom resolves no stylesheet, so a
// container without them measures 0 and every assertion below would be vacuous.

interface ParallaxSection {
  height: number;
}

export const parallaxHtml = ({ height }: ParallaxSection): string =>
  `<div class="brz-section">
     <div class="brz-bg" style="height:${height}px">
       <div class="brz-bg-image brz-bg-image-parallax"></div>
     </div>
     <div class="brz-section__content"><div class="brz-probe"></div></div>
   </div>`;

export const parallaxSectionsHtml = (sections: ParallaxSection[]): string =>
  sections.map(parallaxHtml).join("");

type BgVideoMedia = "iframe" | "video" | "none";

interface BgVideo {
  type: string | undefined;
  loop: string | undefined;
  start: string | undefined;
  width: number;
  height: number;
  media: BgVideoMedia;
}

const mediaHtml = (media: BgVideoMedia): string => {
  switch (media) {
    case "iframe":
      return `<iframe class="brz-iframe brz-bg-video__cover" title="background-video"></iframe>`;
    case "video":
      return `<video class="brz-bg-video-custom brz-bg-video__cover"></video>`;
    case "none":
      return "";
  }
};

const attr = (name: string, value: string | undefined): string =>
  value === undefined ? "" : ` ${name}="${value}"`;

export const bgVideoHtml = ({
  type,
  loop,
  start,
  width,
  height,
  media
}: BgVideo): string =>
  `<div class="brz-section">
     <div class="brz-bg">
       <div class="brz-bg-video"${attr("data-type", type)}${attr(
         "data-loop",
         loop
       )}${attr("data-start", start)} style="width:${width}px;height:${height}px">
         ${mediaHtml(media)}
       </div>
     </div>
   </div>`;
