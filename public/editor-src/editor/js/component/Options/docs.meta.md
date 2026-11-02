### `backgroundColor-dev`

| Name               | Type      | Description ( takes true or false values and lets you know when: ) |
|--------------------|-----------|--------------------------------------------------------------------|
| `isDisabled`        | `boolean` | Option is disabled                                                 |
| `isSolid`          | `boolean` | Is used solid color                                                |
| `isGradient`       | `boolean` | Is used gradient color                                             |
| `isLinearGradient` | `boolean` | Is used linear gradient color                                      |
| `isRadialGradient` | `boolean` | Is used radial gradient color                                      |

### `corners-dev`

| Name          | Type      | Description ( takes true or false values and lets you know when: ) |
|---------------|-----------|--------------------------------------------------------------------|
| `isGrouped`   | `boolean` | Option value type is grouped                                       |
| `isUngrouped` | `boolean` | Option value type is ungrouped                                     |

### `boxShadow-dev`

| Name         | Type      | Description ( takes true or false values and lets you know when: ) |
|--------------|-----------|--------------------------------------------------------------------|
| `isEmpty`    | `boolean` | All values is 0                                                    |
| `isDisabled` | `boolean` | Option is disabled                                                 |
| `isInset`    | `boolean` | Box shadow type is inset                                           |

### `border-dev`

| Name                 | Type      | Description ( takes true or false values and lets you know when: ) |
|----------------------|-----------|--------------------------------------------------------------------|
| `isEmpty`            | `boolean` | All values is 0                                                    |
| `isNoEmptyGrouped`   | `boolean` | Width type is grouped and all values is bigger than 0              |
| `isNoEmptyUngrouped` | `boolean` | Width type is ungrouped and any value is bigger than 0             |

### `margin-dev`

| Name                 | Type      | Description ( takes true or false values and lets you know when: ) |
|----------------------|-----------|--------------------------------------------------------------------|
| `isEmpty`            | `boolean` | All values is 0                                                    |
| `isNoEmptyGrouped`   | `boolean` | All values are equal to each other and bigger than 0               |
| `isNoEmptyUngrouped` | `boolean` | Any value is not 0                                                 |

### `padding-dev`

| Name                 | Type      | Description ( takes true or false values and lets you know when: ) |
|----------------------|-----------|--------------------------------------------------------------------|
| `isEmpty`            | `boolean` | All values is 0                                                    |
| `isNoEmptyGrouped`   | `boolean` | All values are equal to each other and bigger than 0               |

### `textShadow-dev`

| Name      | Type      | Description ( takes true or false values and lets you know when: ) |
|-----------|-----------|--------------------------------------------------------------------|
| `isEmpty` | `boolean` | Opacity is 0                                                       |
