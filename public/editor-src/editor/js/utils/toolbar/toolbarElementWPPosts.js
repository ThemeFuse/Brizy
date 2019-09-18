import { t } from "visual/utils/i18n";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function toolbarElementWPPostsType({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "postType", device, state }),
    label: t("Post Type"),
    type: "select",
    devices,
    choices: [
      { title: t("Post"), value: "post" },
      { title: t("Page"), value: "page" }
    ],
    value: defaultValueValue({ v, key: "postType", device, state })
  };
}

export function toolbarElementWPPostsNumber({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "numberPosts", device, state }),
    label: t("Number of posts"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "numberPosts",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "numberPosts", device, state })]: value
    })
  };
}

export function toolbarElementWPPostsCategory({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "category", device, state }),
    label: t("Category"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "category",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "category", device, state })]: value
    })
  };
}

export function toolbarElementWPPostsAuthor({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "author", device, state }),
    label: t("Author"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "author",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "author", device, state })]: value
    })
  };
}

export function toolbarElementWPPostsInclude({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "include", device, state }),
    label: t("Include"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "include",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "include", device, state })]: value
    })
  };
}

export function toolbarElementWPPostsExclude({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "exclude", device, state }),
    label: t("Exclude"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "exclude",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "exclude", device, state })]: value
    })
  };
}

export function toolbarElementWPPostsStatus({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "postStatus", device, state }),
    label: "Status",
    type: "select",
    devices,
    choices: [
      { title: t("Publish"), value: "publish" },
      { title: t("Future"), value: "future" },
      { title: t("Draft"), value: "draft" },
      { title: t("Pending"), value: "pending" },
      { title: t("Private"), value: "private" },
      { title: t("Trash"), value: "trash" },
      { title: t("Auto-Draft"), value: "auto-draft" },
      { title: t("Inherit"), value: "inherit" }
    ],
    value: defaultValueValue({ v, key: "postStatus", device, state })
  };
}

export function toolbarElementWPPostsMetaKey({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "metaKey", device, state }),
    label: t("Meta Key"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "metaKey",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "metaKey", device, state })]: value
    })
  };
}

export function toolbarElementWPPostsMetaValue({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "metaValue", device, state }),
    label: t("Meta Value"),
    type: "input",
    devices,
    value: {
      value: defaultValueValue({
        v,
        key: "metaValue",
        device,
        state
      })
    },
    onChange: ({ value }) => ({
      [defaultValueKey({ v, key: "metaValue", device, state })]: value
    })
  };
}

export function toolbarElementWPPostsOrderBy({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "orderBy", device, state }),
    label: t("Order By"),
    type: "select",
    devices,
    choices: [
      { title: t("None"), value: "none" },
      { title: t("ID"), value: "ID" },
      { title: t("Author"), value: "author" },
      { title: t("Date"), value: "date" },
      { title: t("Modified"), value: "modified" },
      { title: t("Parent"), value: "parent" },
      { title: t("Random"), value: "rand" },
      { title: t("Comment Count"), value: "comment_count" },
      { title: t("Menu order"), value: "menu_order" }
    ],
    value: defaultValueValue({ v, key: "orderBy", device, state })
  };
}

export function toolbarElementWPPostsOrder({
  v,
  device,
  devices = "all",
  state
}) {
  return {
    id: defaultValueKey({ key: "order", device, state }),
    label: t("Order"),
    type: "select",
    devices,
    choices: [
      {
        title: t("Asc"),
        value: "ASC"
      },
      {
        title: t("Desc"),
        value: "DESC"
      }
    ],
    value: defaultValueValue({ v, key: "order", device, state })
  };
}
