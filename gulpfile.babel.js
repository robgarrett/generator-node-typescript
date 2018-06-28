"use strict";

import path from "path";
import gulp from "gulp";
import clean from "gulp-clean";
import babel from "gulp-babel";
import eslint from "gulp-eslint";
import sourcemaps from "gulp-sourcemaps";

var paths = {
    scripts: {
        src: "src/**/*.js",
        dest: "generators",
        templates: "generator/templates"
    }
};

// ** Clean ** /
gulp.task("clean", () => {
    return gulp.src([
        paths.scripts.dest + "/**/*.js",
        paths.scripts.dest + "/**/*.js.map",
        "!" + paths.scripts.templates
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
        .pipe(sourcemaps.write(path.join(__dirname, paths.scripts.dest)))
        .pipe(gulp.dest(paths.scripts.dest))
));

gulp.task("default", gulp.series("build"));

