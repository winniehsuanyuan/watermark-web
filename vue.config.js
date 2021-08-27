module.exports = {
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/watermark-web/"
      : "/",
  chainWebpack(config) {
    config.module.rule("svg").uses.clear();
    config.module
      .rule("svg")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => ({ ...options, limit: 4096 }));
  },
};
