export function getItems() {
  return [
    {
      id: "list",
      type: "toggle",
      devices: "desktop",
      disabled: true
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      options: [
        {
          id: "grid",
          type: "grid",
          disabled: true
        }
      ]
    }
  ];
}
