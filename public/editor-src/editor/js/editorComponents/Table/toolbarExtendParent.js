import { getIn, setIn, addLast } from "timm";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { setIds } from "visual/utils/models";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";

const TableRow = {
  type: "TableRow",
  value: {
    items: []
  }
};

const TableCol = {
  type: "TableCol",
  value: {
    items: []
  }
};

const TableColHead = {
  type: "TableAside",
  value: {
    labelText: "H 1",
    items: []
  }
};

const TableAside = {
  type: "TableAside",
  value: {
    labelText: "A 1",
    items: []
  }
};

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ key, v, device });

  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-table-element"
      },
      title: t("Table"),
      position: 60,
      options: [
        {
          id: "tableHead",
          label: t("Head"),
          type: "switch-dev",
          devices: "desktop"
        },
        {
          id: "tableAside",
          label: t("Sidebar"),
          type: "switch-dev",
          devices: "desktop"
        },
        {
          id: "rows",
          label: t("Rows"),
          type: "slider",
          devices: "desktop",
          slider: {
            min: 1,
            max: 10
          },
          input: {
            show: true
          },
          value: {
            value: v.rows
          },
          onChange: ({ value }) => {
            const [tableHead, tableBody] = v.items;
            const rowBody = getIn(tableBody, ["value", "items"]);

            if (rowBody && rowBody.length < value) {
              const _colBody = Array(v.columns).fill(TableCol);
              const newRow = setIn(
                TableRow,
                ["value", "items"],
                [TableAside, ..._colBody]
              );
              const _rowBody = setIds(
                Array(value - rowBody.length).fill(newRow)
              );
              const newTableRows = addLast(
                getIn(tableBody, ["value", "items"]),
                _rowBody
              );
              const newTable = setIn(
                tableBody,
                ["value", "items"],
                newTableRows
              );

              return {
                items: [tableHead, newTable],
                rows: value
              };
            }

            return {
              rows: value
            };
          }
        },
        {
          id: "columns",
          label: t("Columns"),
          type: "slider",
          devices: "desktop",
          slider: {
            min: 1,
            max: 10
          },
          input: {
            show: true
          },
          value: {
            value: v.columns
          },
          onChange: ({ value }) => {
            const [tableHead, tableBody] = v.items;
            const rowBody = getIn(tableBody, ["value", "items"]);
            const rowHead = getIn(tableHead, ["value", "items"]);
            const needAddNewCol = getIn(rowBody, [0, "value", "items"]);
            const needAddNewColHead = getIn(rowHead, [0, "value", "items"]);

            if (needAddNewCol && needAddNewCol.length - 1 < value) {
              const nRowBody = rowBody.reduce((acc, curr) => {
                const colBody = setIds(
                  Array(value - (needAddNewCol.length - 1)).fill(TableCol)
                );
                const tableRow = setIn(
                  curr,
                  ["value", "items"],
                  addLast(curr.value.items, colBody)
                );

                acc.push(tableRow);

                return acc;
              }, []);
              const nHeadCols = setIds(
                Array(value - (needAddNewColHead.length - 1)).fill(TableColHead)
              );
              const nRowHead = setIn(
                rowHead,
                [0, "value", "items"],
                addLast(rowHead[0].value.items, nHeadCols)
              );
              const nTableBody = setIn(tableBody, ["value", "items"], nRowBody);
              const nTableHead = setIn(tableHead, ["value", "items"], nRowHead);

              return {
                items: [nTableHead, nTableBody],
                columns: value
              };
            }

            return {
              columns: value
            };
          }
        },
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        icon: {
          style: {
            backgroundColor:
              v.bgColorOpacity > 0
                ? hexToRgba(bgColorHex, v.bgColorOpacity)
                : hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev"
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    }
  ];
}
