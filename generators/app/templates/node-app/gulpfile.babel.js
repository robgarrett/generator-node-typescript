"use strict";

import path from "path";
import gulp from "gulp";
import tsc from "gulp-typescript";
import { exec } from "child_process";
import tslint from "gulp-tslint";
import clean from "gulp-clean";
import rename from "gulp-rename";
import mocha from "gulp-mocha";
import nodemon from "gulp-nodemon";
import sourcemaps from "gulp-sourcemaps";
import webpackStream from "webpack-stream";

// Development unless told otherwise.
process.env.NODE_ENV = "development";

// Running node instance.
var node;

var paths = {
  tscripts: {
    // All source files, including unit tests.
    srcFiles: ["src/**/*.ts"],
    testSrcFiles: ["src/**/*.test.ts"],
    destDir: "lib",
    packageDir: "dist",
  }
};

// ** Clean ** /
gulp.task("clean", function doCleanWork() {
  return gulp.src([
    paths.tscripts.destDir,
    paths.tscripts.packageDir
  ], { read: false, allowEmpty: true }).pipe(clean());
});

// ** Linting ** //
gulp.task("lint", function doLintWork() {
  return gulp.src(paths.tscripts.srcFiles)
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report());
});

// ** Compilation ** //
gulp.task("preprocess", function doPreProcessWork() {
  return gulp.src("src/app/config-sample.ts").
    pipe(rename("config.ts")).
    pipe(gulp.dest("src/app", { overwrite: false }))
});
gulp.task("compile:typescript", function doCompileWork() {
  // Use webpack to translate TS files into JS.
  process.env.NODE_ENV = "development";
  const config = require("./webpack.config.dev");
  // Call web pack.
  return webpackStream(config).
    pipe(gulp.dest(path.resolve(paths.tscripts.destDir, "app")));
});
gulp.task("compile:tests", function doCompileWork() {
  var project = tsc.createProject("tsconfig.json", { declaration: true });
  var built = gulp.src(paths.tscripts.testSrcFiles)
    .pipe(sourcemaps.init())
    .pipe(project());
  return built.js
    .pipe(sourcemaps.mapSources(function (sourcePath) {
      // Make sure the source path is correct.
      return '../' + sourcePath;
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.tscripts.destDir));
});
gulp.task("build", gulp.series("clean", "lint", "preprocess", "compile:typescript"));

// ** Serve **
gulp.task("serveSrc", function doServeSrcWork(done) {
  // Launch express (using nodemon to monitor).
  var called = false;
  // Use nodemon to run express app.
  // Restart our server whenever code changes.
  return nodemon({
    script: path.resolve(paths.tscripts.destDir, "app", "index.js"),
    ignore: ["node_modules/"],
    // Source files to watch that'll cause reload.
    watch: ["src"],
    // Environment variables.
    env: { "DEBUG": "express:router" },
    // Extensions to watch.
    ext: "ts html css",
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
      // Do something here when nodemon restarts.
      done();
    }, 2000);
  });
});

// ** Watching **
gulp.task("watch", function doWatchWork() {
  // If src files change, recompile them.
  return gulp.watch(paths.tscripts.srcFiles, gulp.series("compile:typescript"));
});

// ** Packaging **
gulp.task("package", gulp.series("clean", "lint", "preprocess", function doPackageWork(done) {
  // Call web pack to package distribution build.
  process.env.NODE_ENV = "production";
  const config = require("./webpack.config.prod");
  // Call Webpack.
  return webpackStream(config).
    pipe(gulp.dest(path.resolve(paths.tscripts.packageDir, "app")));
}));

// ** Production Serve **
gulp.task("serve:dist", gulp.series("package", function doProdServeWork(done) {
  exec("node " + path.resolve(paths.tscripts.packageDir, "app", "index.js"));
  done();
}));

// ** Unit Tests ** //
gulp.task("run-tests", function doTestsWork() {
  return gulp.src(paths.tscripts.destDir + "/test/*.test.js", { read: false }).
    pipe(mocha({
      reporter: 'spec'
    }));
});
gulp.task("test", gulp.series("clean", "lint", "preprocess", "compile:tests", "run-tests"));

// ** Default ** //
gulp.task("serve", gulp.series("build", "serveSrc"));
gulp.task("default", gulp.series(
  "clean", "lint", "preprocess", "compile:typescript",
  "compile:tests", "run-tests", "serveSrc"));
