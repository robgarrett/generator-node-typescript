import * as express from "express";
import * as path from "path";
import * as webpack from "webpack";
import * as webpackMiddleware from "webpack-dev-middleware";
import config from "./webpack.config.dev";

const port = 3000;
const app = express();
const compiler = webpack(config);

// Use web pack compiler to bundle.
app.use(webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.listen(port, function(err) {
  if (err) { console.log(err); }
});
