import * as express from "express";

const port = 3000;
const app = express();

// Default Route.
app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.listen(port, function(err) {
  if (err) { console.log(err); }
});
