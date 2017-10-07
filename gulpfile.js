const gulp = require("gulp");
const gutil = require('gulp-util');
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const less = require("gulp-less");
const concat = require("gulp-concat");
const del = require("del");
const path = require('path');
const runSeq = require("run-sequence");
const webpack = require('webpack');
const webpackDevServer = require("webpack-dev-server");

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

gulp.task("fonts", function () {
    return gulp.src("src/styles/fonts/**/*.*")
        .pipe(gulp.dest("dist/client/css/fonts"));
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

gulp.task("webpack-dev", (callback) => {
    var webPackConfig = require("./webpack.config.dev.js");
    webPackConfig.entry.theme = [`./src/themes/${selectedTheme}/scripts/index.ts`];
    webpack(webPackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        
        gutil.log('[webpack-dev]', stats.toString({        
            colors: true,        
            progress: true        
        }));
    
        callback();        
    });
});

gulp.task("webpack-prod", (callback) => {
    var webPackConfig = require("./webpack.config.prod.js");
    webPackConfig.entry.theme = [`./src/themes/${selectedTheme}/scripts/index.ts`];
    webpack(webPackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        
        gutil.log('[webpack-prod]', stats.toString({        
            colors: true,        
            progress: true        
        }));
    
        callback();        
    });
});

gulp.task("watch", function () {
    gulp.watch(["src/**/*.scss"], ["styles", "theme-styles"]).on("error", handleError);
});

gulp.task('server', ["build", "watch"], () => { 
    const webPackConfig = require("./webpack.config.dev.js");
    const options = {
        host: "0.0.0.0",
        contentBase: './dist/client',
        hot: true
    };
    webpackDevServer.addDevServerEntrypoints(webPackConfig, options);
    const compiler = webpack(webPackConfig);
    const server = new webpackDevServer(compiler, options);
    server.listen(8080, 'localhost', function(err) {    
        if(err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
    });
});

gulp.task('build-clean',() => {
    return del(["dist/client/**"]);
});

gulp.task("build-theme", ["theme-assets", "theme-styles", "theme-styles-less", "theme-config"]);

gulp.task("build", (done) => runSeq('build-clean', ["assets", "styles", "fonts", "build-theme", "webpack-dev"], done));

gulp.task("build-prod", (done) => runSeq('build-clean', ["styles", "theme-styles", "webpack-prod"], done));

gulp.task("default", ["server"]);


