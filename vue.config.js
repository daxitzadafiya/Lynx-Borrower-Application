const path = require("path");
const fs = require("fs-extra");

class CopyFilesPlugin {
  constructor(options) {
    this.options = options;
    this.hasCopied = false;
  }

  async apply(compiler) {
    compiler.hooks.beforeRun.tapPromise("CopyFilesPlugin", async () => {
      if (!this.hasCopied) {
        await this.copyFiles();
        this.hasCopied = true;
      }
    });

    compiler.hooks.watchRun.tapPromise("CopyFilesPlugin", async () => {
      if (!this.hasCopied) {
        await this.copyFiles();
        this.hasCopied = true;
      }
    });
  }

  async copyFiles() {
    // Define source and destination directories for styles
    const stylesSrcPath = path.resolve(__dirname, this.options.styles.from);
    const stylesDestPath = path.resolve(__dirname, this.options.styles.to);

    // Ensure destination directories exist
    await fs.ensureDir(stylesDestPath);

    // Copy styles
    await fs.copy(stylesSrcPath, stylesDestPath);
    console.log(`Copied styles from ${stylesSrcPath} to ${stylesDestPath}`);
  }
}

module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.resolve.alias.set("@", path.resolve(__dirname, "src"));
  },
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new CopyFilesPlugin({
        styles: {
          from: `branding/${process.env.MODE}/styles`,
          to: "src/assets/styles"
        }
      })
    ]
  }
};
