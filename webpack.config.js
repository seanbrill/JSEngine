const path = require("path");
const fs = require("fs");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const config = require("./JSEngine.config.json");

module.exports = {
  mode: config["webpack-env"],
  entry: {
    //path to index file for website, app, or game.
    //for the included demo we are packing all the modules for our demo
    ["./" + config["output-file"]]: path.resolve(__dirname, config["input-file"]),
    ["./Engine/bin/JSEngine"]: path.resolve(__dirname, "minify_source.js"),
  },
  output: {
    clean: true,
    assetModuleFilename: "./[name][ext]",
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, config["webpack-dev-server-dir"]),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(ico|png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      //files
      {
        test: /\.(glb|gltf)$/i,
        loader: "file-loader",
        options: {
          publicPath: "./",
          name: "[name].[ext]",
        },
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: config["main-html-template-title"],
      filename: config["main-html-template-filename"],
      template: config["main-html-template"],
    }),
    ...BundleHtmlTemplates(),
    config["enable-bundle-analysis"] ? new BundleAnalyzerPlugin() : void null,
  ],
};

function BundleHtmlTemplates() {
  const templateDir = path.resolve(__dirname, config["ui-templates"]);
  const files = fs.readdirSync(templateDir).filter((file) => path.extname(file) === ".html");
  return files.map((file) => {
    return new HTMLWebpackPlugin({
      filename: file,
      template: path.join(templateDir, file),
    });
  });
}