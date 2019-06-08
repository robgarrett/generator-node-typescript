"use strict";

import path from "path";
import gulp from "gulp";
import tsc from "gulp-typescript";
import tslint from "gulp-tslint";
import clean from "gulp-clean";
import rename from "gulp-rename";
import mocha from "gulp-mocha";
import sourcemaps from "gulp-sourcemaps";
import nodemon from "gulp-nodemon";

// Development unless told otherwise.
process.env.NODE_ENV = "development";

// Running node instance.
var node;

var paths = {
  tscripts: {
    // All source files, including unit tests.
    srcFiles: [
      "src/**/*.ts",
    ],
    destDir: "lib",
    appDir: "lib/app",
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
gulp.task("preprocess", function doPreProcessWork(done) {
  return gulp.src("src/app/config-sample.ts").
    pipe(rename("config.ts")).
    pipe(gulp.dest("src/app", { overwrite: false }))
});
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
gulp.task("build", gulp.series("clean", "lint", "preprocess", "compile:typescript"));

// ** Run **
gulp.task("doRun", function doRunWork(done) {
  // Launch service (using nodemon to monitor).
  var called = false;
  // Use nodemon to run express app.
  // Restart our service whenever code changes.
  return nodemon({
    script: path.resolve(paths.tscripts.appDir, "index.js"),
    ignore: ["node_modules/"],
    // Source files to watch that'll cause reload.
    watch: ["src"],
    // Extensions to watch.
    ext: "ts",
    // Tasks to run on file changes.
    tasks: function (changedFiles) {
      if (changedFiles !== undefined) {
        changedFiles.forEach(element => {
          console.log(`File ${element} changed`);
        });
      }
      return ["compile:typescript"];
    }
  }).on("start", function () {
    // Avoid nodemon being started multiple times.
    if (!called) {
      called = true;
      // Wait for the main load to complete.
      setTimeout(function () {
        done();
      }, 2000);
    }
  }).on("restart", function () {
    setTimeout(function () {
      // When nodemon restarts the service.
      done();
    }, 2000);
  });
});

// ** Watching **
gulp.task("watch", function doWatchWork() {
  // If src files change, recompile them.
  return gulp.watch(paths.tscripts.srcFiles, gulp.series("compile:typescript"));
});

// ** Unit Tests ** //
gulp.task("run-tests", function doTestsWork() {
  return gulp.src(paths.tscripts.destDir + "/*.test.js", { read: false }).
    pipe(mocha({
      reporter: 'spec'
    }));
});
gulp.task("test", gulp.series("build", "run-tests"));

// ** Default ** //
gulp.task("run", gulp.series("build", "doRun"));
gulp.task("default", gulp.series("build", "doRun"));
