import * as path from "path";
import * as webpack from "webpack";

export default {
  mode: "production",
  devtool: "source-map",
  entry: {
    // __dirname is app/lib.
    vendor: path.resolve(__dirname, "../src/vendor.ts"),
    main: path.resolve(__dirname, "../src/index.ts"),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  target: "web",
  // Production webpack is not used via middleware,
  // so we generate the files needed in dist folder.
  output: {
    publicPath: "/",
    path: path.join(__dirname, "../dist"),
    filename: "[name].[chunkhash].js",
  },
  plugins: [
    // Separate CSS for production.
    new (require("extract-text-webpack-plugin"))("[name].[chunkhash].css"),
    // Use Cache Busting for file updates.
    new (require("webpack-md5-hash"))(),
    // Create source maps with our bundle.
    new webpack.SourceMapDevToolPlugin({}),
    // Process HTML.
    new (require("html-webpack-plugin"))({
      template: path.resolve(__dirname, "../src/index.html"),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
  module: {
    rules: [
      // Use ts-loader to transpile TS when called from express.
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
      },
      // Use css loaders for embedded css.
      {
        test: /\.css$/,
        use: (require("extract-text-webpack-plugin")).extract(
          {
            fallback: "style-loader",
            use: ["css-loader"],
          }),
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
    ],
  },
};

