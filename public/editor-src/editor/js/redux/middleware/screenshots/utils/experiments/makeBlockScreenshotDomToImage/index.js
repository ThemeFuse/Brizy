import { preloadImage } from "visual/utils/image";
import domToImage from "./domToImage";
import { getAllPossibleFonts, makeGoogleFontsUrl } from "visual/utils/fonts";

export const makeBlockScreenshot = block => {
  const node = document.querySelector(`#${block.value._id}`);

  return domToImage
    .toJpeg(node, {
      HZ: node =>
        Promise.resolve(node)
          .then(removeUnwantedElements)
          .then(removeUnwantedAttributes)
          .then(transformPictureToImg)
    })
    .then(preloadImage);

  // .then(inlineExternalSVG),

  //   formatExternalFontsUrls: styleUrls => {
  //     const families = parseFontFamilies(elem);
  //     const allPossibleFonts = getAllPossibleFonts(families);

  //     if (allPossibleFonts) {
  //       const newFontUrl = makeGoogleFontsUrl(allPossibleFonts.map(({ id }) => id));
  //       const filteredUrls = styleUrls.filter(
  //         ({ id }) => id !== "google-fonts"
  //       );

  //       return [...filteredUrls, { href: newFontUrl }];
  //     }

  //     return styleUrls;
  //   }
  // })
  // .then(preloadImage);
};

function parseFontFamilies(elem) {
  const families = new Set();
  $(`[class*="brz-ff-"]`).each(function() {
    const className = $(this).attr("class");
    const match = className.match(/brz-ff-([^\s]+)/);

    families.add(match[1]);
  });

  const r = /--fontFamily:([^;]+);/g;
  let match;
  while ((match = r.exec(elem.innerHTML))) {
    families.add(match[1].replace(/\s+|!\s*important/g, ""));
  }

  return [...families];
}

function removeUnwantedElements(node) {
  const toRemoveSelector = [
    ".brz-ed-collapsible",
    ".brz-ed-draggable",
    ".brz-ed-border__inner-1",
    ".brz-ed-border__inner-2",
    ".brz-ed-container-plus",
    ".brz-ed-container-trigger",
    ".brz-ed-toolbar",
    ".brz-ed-column__toolbar",
    ".brz-ed-wrapper__toolbar",
    ".brz-form__select-list"
  ].join(",");

  node.querySelectorAll(toRemoveSelector).forEach(node => node.remove());

  return node;
}

function removeUnwantedAttributes(node) {
  const toRemoveAttributes = ["id", "class", "data-href"];

  toRemoveAttributes.forEach(attribute => {
    node
      .querySelectorAll(`[${attribute}]`)
      .forEach(node => node.removeAttribute(attribute));
  });

  return node;
}

function transformPictureToImg(node) {
  node.querySelectorAll("picture").forEach(picture => {
    picture.find("source").remove();
    picture.find("img").removeAttribute("srcset");
  });

  return node;
}

function inlineExternalSVG(node) {
  const svg = node.getElementsByTagName("svg");

  return Promise.all(
    Array.from(svg).reduce((acc, svg) => {
      const use = svg.getElementsByTagName("use")[0];
      if (!use) {
        return acc;
      }

      const xlinkHref = use.getAttribute("xlink:href");
      if (!xlinkHref) {
        return acc;
      }

      acc.push(
        fetch(xlinkHref)
          .then(response => response.text())
          .then(svgHTML => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = svgHTML;

            const symbolElem = wrapper.getElementsByTagName("symbol");
            if (symbolElem.length) {
              const [, id] = xlinkHref.split("#") || [];
              const elemHtml = wrapper.querySelector(`#${id}`).innerHTML;
              wrapper.firstChild.style.display = "block";
              wrapper.firstChild.innerHTML = elemHtml;
            }

            const inlinedSVG = wrapper.firstChild;
            inlinedSVG.style.width = svg.style.width;
            inlinedSVG.style.height = svg.style.height;
            inlinedSVG.style.margin = svg.style.margin;

            svg.outerHTML = inlinedSVG.outerHTML;
          })
      );

      return acc;
    }, [])
  ).then(() => node);
}
