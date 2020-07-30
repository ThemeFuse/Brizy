// since react does not allow constructions such as
// <div {{brz_dc_someDynamicContent}}>
// we work around it by making react return
// <div data-brz-dcatts="{{brz_dc_someDynamicContent}}">
// and then we replace
// data-brz-dcatts="{{brz_dc_someDynamicContent}}" with
// {{brz_dc_someDynamicContent}}
// that will ultimately be replaced by something like
// att1="val1" att2="val2" ...
export default function dynamicContent(html) {
  const r = /data-brz-dcatts=(["'])(.*?)\1/g;

  return html.replace(r, "$2");
}
