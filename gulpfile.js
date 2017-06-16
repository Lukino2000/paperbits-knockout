const gulp = require("gulp");
const typescript = require("typescript");
const typescriptCompiler = require("gulp-typescript");
const merge = require("merge2");


function handleError(error) {
    console.error("ERROR");
    console.error(error.toString());
    this.emit("end");
}

gulp.task("typescript", function () {
    var typescriptProject = typescriptCompiler.createProject("tsconfig.json", {
        typescript: typescript,
        declaration: true
    });

    var tsResult = typescriptProject
        .src()
        .pipe(typescriptProject())

    return merge([
        tsResult.dts.pipe(gulp.dest("./dist")),
        tsResult.js.pipe(gulp.dest("./dist"))
    ]);
});

gulp.task("templates", function () {
    return gulp.src(["src/**/*.html"])
        .pipe(gulp.dest("dist/"));
});

gulp.task("build", ["typescript", "templates"]);

gulp.task("watch", function () {
    gulp.watch(["src/**/*.scss"], ["styles"]).on("error", handleError);
    gulp.watch(["src/**/*.ts"], ["typescript"]).on("error", handleError);
    gulp.watch(["src/**/*.html"], ["templates"]).on("error", handleError);
    gulp.watch(["src/themes/paperbits/**/*.*"], []).on("error", handleError);
});

gulp.task("default", ["build", "watch"]);
