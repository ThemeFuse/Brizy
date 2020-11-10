import { traverse as objectTraverse } from "visual/utils/object/traverse";

/*
Should be used here

const [
  project,
  currentPage,
  globalBlocks,
  blocksThumbnailSizes
] = importState(
  await Promise.all([
    getProject(),
    getCurrentPage(),
    getGlobalBlocks(),
    fetch(assetUrl("thumbs/blocksThumbnailSizes.json")).then(r => r.json())
  ]),
  userState
);
*/
export default function importState([myProject, myPage], state) {
  const project = state.project;
  const currentPage = state.page;
  const globalBlocks = state.globalBlocks;
  const blocksThumbnailSizes = state.blocksThumbnailSizes;

  const userProjectId = project.id;
  const userPageId = currentPage.id;

  const traverseCb = (key, value, obj) => {
    if (value === userProjectId) {
      obj[key] = myProject.id;
    } else if (value === userPageId) {
      obj[key] = myPage.id;
    } else if (key === "_thumbnailSrc") {
      delete obj[key];
    }
  };

  objectTraverse(project, traverseCb);
  objectTraverse(currentPage, traverseCb);
  objectTraverse(globalBlocks, traverseCb);

  return [project, currentPage, globalBlocks, blocksThumbnailSizes];
}
