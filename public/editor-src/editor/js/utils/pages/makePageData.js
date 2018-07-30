import { PAGE_TYPE_INTERNAL } from "./pageTypes";

export default function makePageData(data) {
  return Object.assign(
    {
      title: "",
      description: "",
      data: "",
      index: false,
      type: PAGE_TYPE_INTERNAL,
      url: ""
    },
    data
  );
}
