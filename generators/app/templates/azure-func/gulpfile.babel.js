"use strict";

import gulp from "gulp";
import debug from "gulp-debug";
import jeditor from "gulp-json-editor";
import tsc from "gulp-typescript";
import tslint from "gulp-tslint";
import clean from "gulp-clean";
import mocha from "gulp-mocha";
import sourcemaps from "gulp-sourcemaps";

// Development unless told otherwise.
process.env.NODE_ENV = "development";

// Running node instance.
var node;

var paths = {
  tscripts: {
    // All source files.
    srcFiles: ["**/*.ts", "!node_modules/**/*"],
    funcJson: ["**/function.json", "!node_modules/**/*"],
    destDir: "dist",
  }
};

// ** Clean ** /
gulp.task("clean", function doCleanWork() {
  return gulp.src([
    paths.tscripts.destDir
  ], { read: false, allowEmpty: true }).pipe(clean());
});

// ** Linting ** //
gulp.task("lint", function doLintWork() {
  return gulp.src(paths.tscripts.srcFiles)
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report());
});

// ** Compilation ** //
gulp.task("compile:typescript", function doCompileWork() {
  var project = tsc.createProject("tsconfig.json", { declaration: true });
  var built = gulp.src(paths.tscripts.srcFiles)
    .pipe(sourcemaps.init())
    .pipe(project());
  return built.js
    // Write inline source maps.
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.tscripts.destDir));
});
gulp.task("postCompile", function doPostCompileWork() {
  // Copy and update the function.json file.
  return gulp.src(paths.tscripts.funcJson).
    pipe(debug()).
    pipe(jeditor(function (json) {
      json.scriptFile = "./index.js";
      // Iterate the bindings.
      json.bindings.forEach(function (binding, index) {
        if (binding.authLevel !== null) {
          binding.authLevel = "anonymous";
        }
      });
      return json;
    })).
    pipe(gulp.dest(paths.tscripts.destDir));
});
gulp.task("build", gulp.series("clean", "lint", "compile:typescript", "postCompile"));

// ** Unit Tests ** //
gulp.task("run-tests", function doTestsWork() {
  return gulp.src(paths.tscripts.destDir + "/**/*.test.js", { read: false }).
    pipe(mocha({
      reporter: 'spec'
    }));
});
gulp.task("test", gulp.series("build", "run-tests"));

// ** Run ** //
gulp.task("start", gulp.series("build", function doRunWork() {

}));

// ** Default ** //
gulp.task("default", gulp.series("build"));
