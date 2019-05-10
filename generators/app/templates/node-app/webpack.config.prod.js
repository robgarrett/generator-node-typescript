"use strict";

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    index: path.resolve(__dirname, "src/app/index.ts"),
  },
  externals: [ nodeExternals() ],
  target: "node",
  output: {
    publicPath: "/",
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
  ],
  module: {
    rules: [
      // Use ts-loader to transpile TS.
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
      },
    ],
  }
};
