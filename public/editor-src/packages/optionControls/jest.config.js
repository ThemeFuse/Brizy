module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", //Default: 'node' https://github.com/testing-library/react-testing-library/issues/422#issuecomment-518007141
  moduleDirectories: ["node_modules", "jest-utils", __dirname],
  setupFilesAfterEnv: ["<rootDir>/jest-utils/setupTests.ts"],
  testTimeout: 10000
};
