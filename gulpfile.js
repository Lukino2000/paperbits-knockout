const gulp = require("gulp");
const sass = require("gulp-sass");
const inlineImage = require("sass-inline-image");
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const filter = require("gulp-filter");
const typescript = require("typescript");
const typescriptCompiler = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const buffer = require("vinyl-buffer");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const merge = require("merge2");


function handleError(error) {
    console.error("ERROR");
    console.error(error.toString());
    this.emit("end");
}

function sassFunctions(options) {
    options = options || {};
    options.base = options.base || process.cwd();

    const fs = require("fs");
    const path = require("path");
    const types = require("node-sass").types;
    const funcs = {};

    funcs["inline-image($file)"] = function (file, done) {
        file = path.resolve(options.base, file.getValue());

        const ext = file.split(".").pop();

        fs.readFile(file, function (err, data) {
            if (err) {
                return done(err);
            }

            data = new Buffer(data);
            data = data.toString("base64");
            data = "data:image/" + (ext === "svg" ? "svg+xml" : ext) + ";base64," + data;
            data = types.String(data);
            done(data);
        });
    };

    return funcs;
}

gulp.task("assets", function () {
    return gulp.src([
        `./src/assets/**/*.*`],
        { base: `./src/assets/` })
        .pipe(gulp.dest("./dist/"));
});

gulp.task("styles", () => {
    return gulp.src("src/styles/vienna.scss")
        .pipe(sass({
            outputStyle: "compressed",
            functions: sassFunctions(),
            sourceMap: true,
        }))
        .on("error", sass.logError)
        .pipe(autoprefixer())
        .pipe(concat("paperbits.css"))
        .on("error", handleError)
        .pipe(gulp.dest("dist"));
});

gulp.task("fonts", function () {
    return gulp.src("src/styles/fonts/**/*.*")
        .pipe(gulp.dest("dist/fonts"));
});

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
        .pipe(gulp.dest("dist/templates"));
});

gulp.task("build", ["assets", "styles", "fonts", "typescript", "templates"]);


gulp.task("watch", function () {
    gulp.watch(["src/**/*.scss"], ["styles"]).on("error", handleError);
    gulp.watch(["src/**/*.ts"], ["typescript"]).on("error", handleError);
    gulp.watch(["src/**/*.html"], ["templates"]).on("error", handleError);
    gulp.watch(["src/themes/paperbits/**/*.*"], []).on("error", handleError);
});

gulp.task("default", ["build", "watch"]);
