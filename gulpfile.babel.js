"use strict";

import gulp from "gulp";
import clean from "gulp-clean";
import babel from "gulp-babel";
import eslint from "gulp-eslint";
import flatten from "gulp-flatten";
import sourcemaps from "gulp-sourcemaps";

var paths = {
    scripts: {
        src: "app/src/**/*.js",
        dest: "app/lib",
    }
};

// ** Clean ** /
gulp.task("clean", () => {
    return gulp.src([
        paths.scripts.dest + "/*.js",
        paths.scripts.dest + "/*.js.map"
    ], { read: false, allowEmpty: true }).pipe(clean());
});

// ** Linting ** //
gulp.task("lint", () => {
    return gulp.src([
        paths.scripts.src,
        "!node_modules/**"
    ]).pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// ** Building **
gulp.task("build", gulp.series("clean", "lint", () =>
    gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['env'] }))
        .pipe(sourcemaps.write(paths.scripts.dest))
        .pipe(flatten())
        .pipe(gulp.dest(paths.scripts.dest))
));

gulp.task("default", gulp.series("build"));

