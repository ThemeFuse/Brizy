# API Client for Editor

## Requirements

- node >= 16
- npm >= 7

## Installation

Run `npm install` inside root folder.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\

#### `npm run build`

Builds the app for development to the `dist` folder.\
Same as `npm start` without watch mode

#### `npm run build:prod`

Builds the app for production to the `dist` folder.

### Config
```ts
export interface __BRZ_PLUGIN_ENV__ {
  hash: string;
  url: string;
  editorVersion: string;
  actions: {
    getMediaUid: string;
    mediaResizeUrl: string;
  };
}
```
