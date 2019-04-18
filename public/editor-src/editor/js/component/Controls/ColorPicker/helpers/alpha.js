export const calculateChange = (e, contentWindow, props, container) => {
  e.preventDefault();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const x = typeof e.pageX === "number" ? e.pageX : e.touches[0].pageX;
  const y = typeof e.pageY === "number" ? e.pageY : e.touches[0].pageY;
  const left =
    x - (container.getBoundingClientRect().left + contentWindow.pageXOffset);
  const top =
    y - (container.getBoundingClientRect().top + contentWindow.pageYOffset);

  if (props.direction === "vertical") {
    let a;
    if (top < 0) {
      a = 0;
    } else if (top > containerHeight) {
      a = 1;
    } else {
      a = Math.round(top * 100 / containerHeight) / 100;
    }

    if (props.hsl.a !== a) {
      return {
        h: props.hsl.h,
        s: props.hsl.s,
        l: props.hsl.l,
        a,
        source: "rgb"
      };
    }
  } else {
    let a;
    if (left < 0) {
      a = 0;
    } else if (left > containerWidth) {
      a = 1;
    } else {
      a = Math.round(left * 100 / containerWidth) / 100;
    }

    if (props.a !== a) {
      return {
        h: props.hsl.h,
        s: props.hsl.s,
        l: props.hsl.l,
        a,
        source: "rgb"
      };
    }
  }
  return null;
};
