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

#### `npm run test`

Launches the test runner.\

#### `npm run build`

Builds the app for development to the `build` folder.\
Same as `npm start` without watch mode

#### `npm run translation`

Generate texts.php file with all translation

> The texts persist only if is production build, in development mode the texts is missing

#### `npm run build:prod`

Builds the app for production to the `build` folder.
Generate texts.php file with all translations

### Config
```ts
export interface __BRZ_PLUGIN_ENV__ {
  hash: string;
  editorVersion: string;
  url: string;
  pageId: string;
  l10n?: Record<string, string>;
  actions: {
    getMediaUid: string;
    getAttachmentUid: string;
    setProject: string;
    updatePage: string;
    updateRules: string;
  
    getSavedBlockList: string;
    getSavedBlockByUid: string;
    createSavedBlock: string;
    updateSavedBlock: string;
    deleteSavedBlock: string;
    uploadBlocks: string;
  
    createLayout: string;
    getLayoutList: string;
    getLayoutByUid: string;
    updateLayout: string;
    deleteLayout: string;
    createBlockScreenshot: string
    updateBlockScreenshot: string
  };
  api: {
    mediaResizeUrl: string;
    customFileUrl: string;
  };
}
```
