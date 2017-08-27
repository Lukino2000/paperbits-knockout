const gulp = require("gulp");
const sass = require("gulp-sass");
const sassInlineImage = require("sass-inline-image");
const less = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const webserver = require("gulp-webserver");
const uglify = require("gulp-uglify");
const filter = require("gulp-filter");
const typescript = require("typescript");
const typescriptCompiler = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const browserify = require("browserify");
const buffer = require("vinyl-buffer");
const source = require("vinyl-source-stream");
const del = require("del");
const tsify = require("tsify");
const runSeq = require("run-sequence");
const stringify = require("stringify");


//let selectedTheme = "paperbits";
let selectedTheme = "hostmeapp";

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
        .pipe(gulp.dest("./dist/client"));
});

gulp.task("styles", () => {
    return gulp.src("src/styles/vienna.scss")
        .pipe(sass({
            outputStyle: "compressed",
            functions: sassFunctions(),
            sourceMap: true,
        }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(concat("paperbits.css"))
        .on("error", handleError)
        .pipe(gulp.dest("dist/client/css"));
});

gulp.task("fonts", function () {
    return gulp.src("src/styles/fonts/**/*.*")
        .pipe(gulp.dest("dist/client/css/fonts"));
});

gulp.task("typescript", function () {
    const typescriptProject = typescriptCompiler.createProject("tsconfig.json", {
        typescript: typescript
    });

    return browserify({ debug: true, entries: ["src/startup.ts"] })
        .transform(stringify, {
            appliesTo: { includeExtensions: ['.html'] },
            global: true
        })
        .plugin(tsify, { typescript: require("typescript") })
        .bundle()
        .on("error", handleError)
        .pipe(source("paperbits.js"))
        // .pipe(buffer())
        // .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest("./dist/client/scripts"));

});

gulp.task("serve", ["build", "build-theme", "watch"], function () {
    return gulp.src("dist/client")
        .pipe(webserver({
            port: "80",
            livereload: true,
            fallback: "index.html",
            open: false
        }));
});

gulp.task("theme-assets", function () {
    return gulp.src([
        `src/themes/${selectedTheme}/assets/**/*.*`],
        { base: `src/themes/${selectedTheme}/assets/` })
        .pipe(gulp.dest("dist/client"));
});

gulp.task("theme-config", () => {
    return gulp.src(`src/themes/${selectedTheme}/config.json`)
        .pipe(gulp.dest("dist/client"));
});

gulp.task("theme-typescript", function () {
    const typescriptProject = typescriptCompiler.createProject("tsconfig.json", {
        typescript: typescript
    });

    return browserify({ debug: true, entries: [`src/themes/${selectedTheme}/scripts/index.ts`] })
        .transform(stringify, {
            appliesTo: { includeExtensions: ['.html'] },
            global: true
        })
        .plugin(tsify, { typescript: require("typescript") })
        .bundle()
        .on("error", handleError)
        .pipe(source("theme.js"))
        // .pipe(buffer())
        // .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest("./dist/client/scripts"));

});

gulp.task("theme-styles-less", function () {
    return gulp.src(`src/themes/${selectedTheme}/styles/styles.less`)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .on("error", handleError)
        .pipe(concat("theme.css"))
        .pipe(gulp.dest("dist/client/css"));
});

gulp.task("theme-styles", () => {
    return gulp.src(`src/themes/${selectedTheme}/styles/styles.scss`)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed",
            functions: sassFunctions()
        })
            .on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(concat("style.css"))
        .pipe(sourcemaps.write())
        .on("error", handleError)
        .pipe(gulp.dest("dist/client/css"));
});

// var packages = ["slate", "common", "knockout"];
var packages = [];

gulp.task("dependencies", (cb) => {
    return del(["node_modules/@paperbits/**"]).then(() => {
        let promises = packages.map(package => {
            return new Promise((resolve) => {
                console.log(`Updating dependency ${package}...`);

                gulp.src([
                    `../paperbits-${package}/dist/**/*.*`,
                    `../paperbits-${package}/package.json`])
                    .pipe(gulp.dest(`node_modules/@paperbits/${package}`))
                    .on("end", resolve);
            });
        });

        return Promise.all(promises);
    });
});

gulp.task("dependencies-and-compile", (done) => {
    runSeq("dependencies", "typescript", done);
});

gulp.task("watch-dependencies", function () {
    let packageContentPaths = packages.map(package => `../paperbits-${package}/dist/**/*.*`);

    gulp
        .watch(packageContentPaths, ["dependencies-and-compile"])
        .on("error", handleError);
});

gulp.task("build", ["assets", "styles", "fonts", "typescript"]);

gulp.task("build-theme", ["theme-assets", "theme-styles", "theme-styles-less", "theme-config", "theme-typescript"]);

gulp.task("watch", ["watch-dependencies"], function () {
    gulp.watch(["src/**/*.scss"], ["styles", "theme-styles"]).on("error", handleError);
    gulp.watch(["src/**/*.ts", "src/**/*.html"], ["typescript"]).on("error", handleError);
    gulp.watch(["src/themes/paperbits/**/*.*"], ["build-theme"]).on("error", handleError);
});


gulp.task("default", ["build", "build-theme", "watch"]);




/*** CLOUD FUNCTIONS PACKAGE ***/

gulp.task("cloud-clean", (done) => {
    return del(["dist/server/**", "tmp/**"], done);
});

gulp.task("cloud-typescript", function () {
    const typescriptProject = typescriptCompiler.createProject("tsconfig.publishing.json", {
        typescript: typescript
    });

    const tsResult = typescriptProject
        .src()
        .pipe(typescriptProject())

    return tsResult
        .js
        .pipe(gulp.dest("dist/server"));
});

gulp.task("cloud-theme-assets", function () {
    return gulp.src([
        `src/themes/${selectedTheme}/assets/**/*.*`],
        { base: `src/themes/${selectedTheme}/assets/` })
        .pipe(gulp.dest("dist/server/assets"));
});

gulp.task("cloud-theme-scss", () => {
    return gulp.src(`src/themes/${selectedTheme}/styles/styles.scss`)
        //.pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "compressed",
            functions: sassFunctions()
        }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(concat("style.css"))
        //.pipe(sourcemaps.write())
        .on("error", handleError)
        .pipe(gulp.dest("dist/server/assets/css"));
});

gulp.task("cloud-theme-typescript", function () {
    const typescriptProject = typescriptCompiler.createProject("tsconfig.json", {
        typescript: typescript
    });

    return browserify({ debug: true, entries: [`src/themes/${selectedTheme}/scripts/index.ts`] })
        .transform(stringify, {
            appliesTo: { includeExtensions: ['.html'] },
            global: true
        })
        .plugin(tsify, { typescript: require("typescript") })
        .bundle()
        .on("error", handleError)
        .pipe(source("theme.js"))
        .pipe(buffer())
        .pipe(uglify({ mangle: false }))
        .pipe(gulp.dest("./dist/server/assets/scripts"));
});

gulp.task("cloud-theme-config", () => {
    return gulp.src(`src/themes/${selectedTheme}/config.publishing.json`)
        .pipe(gulp.dest("dist/server"));
});

gulp.task("cloud", [
    // files required for publishing
    "cloud-typescript",

    // theme-specific files
    "cloud-theme-assets",
    "cloud-theme-scss",
    "cloud-theme-typescript",
    "cloud-theme-config"]);

gulp.task("publish", () => {
    runSeq("cloud-clean", "cloud", () => {
        const publishing = require("./dist/server/src.node/startup.js");
        const publishPromise = publishing.publish();

        publishPromise.then((result) => {
            console.log("DONE");
            process.exit();
        });

        publishPromise.catch((error) => {
            console.log(error);
            process.exit();
        });
    });
});