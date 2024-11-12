export const onOffToBool = (v: "on" | "off"): boolean => {
  switch (v) {
    case "off":
      return false;
    case "on":
      return true;
  }
};
