"use strict";

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    index: path.resolve(__dirname, "src/app/index.ts"),
  },
  externals: [ nodeExternals() ],
  target: "node",
  output: {
    path: path.join(__dirname, "lib", "app"),
    filename: "[name].js",
  },
  plugins: [
  ],
  node: {
    console: false
  },
  module: {
    rules: [
      // Use ts-loader to transpile TS.
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
      },
    ],
  },
};
