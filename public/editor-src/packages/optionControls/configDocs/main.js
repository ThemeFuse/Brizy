const path = require("path");
const tailwindConfigPath = path.resolve(__dirname, "tailwind.config.js");

module.exports = {
  stories: ["../**/docs/*stories.@(md|mdx)", "../**/docs/*.@(js|jsx|ts|tsx)"],
  staticDirs: [
    { from: "../assets", to: "/assets" },
    { from: "../style", to: "/style" }
  ],
  features: {
    modernInlineRender: true
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "storybook-addon-sass-postcss",
      options: {
        loadSassAfterPostCSS: true,
        postcssLoaderOptions: {
          postcssOptions: {
            plugins: [require("tailwindcss")(tailwindConfigPath)]
          }
        }
      }
    }
  ],
  framework: "@storybook/react"
};
