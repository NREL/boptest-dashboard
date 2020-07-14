const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin");

module.exports = {
  entry: "./index.ts",
  target: "node",
  output: {
    path: path.resolve(__dirname, "../build/server"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ["npm run run:dev"],
    }),
  ],
};
