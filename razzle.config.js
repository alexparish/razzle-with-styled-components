const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  modify(config, { target, dev }) {
    const appConfig = config;

    if (target === "web" && process.argv.includes("--stats")) {
      appConfig.plugins.push(new BundleAnalyzerPlugin());
    }

    return appConfig;
  }
};
