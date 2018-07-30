export default function addGlamorCSS($head, glamorCSS) {
  $head.append(`<style>${glamorCSS}</style>`);
}
