const gulp = require("gulp");
const gutil = require('gulp-util');
const typescript = require("typescript");
const typescriptCompiler = require("gulp-typescript");
const del = require("del");
const path = require('path');
const merge = require("merge2");
const runSeq = require("run-sequence");
const webpack = require('webpack');
const webpackDevServer = require("webpack-dev-server");

let selectedTheme = "paperbits";
//let selectedTheme = "hostmeapp";

gulp.task("webpack-dev", (callback) => {
    var webPackConfig = require("./webpack.config.js");
    webpack(webPackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        
        gutil.log('[webpack-dev]', stats.toString({        
            colors: true,        
            progress: true        
        }));
    
        callback();        
    });
});

gulp.task("build-npm", ["build-npm-ts"], () => {
    return gulp.src(["!./src/themes/**/*.*", "./src/**/*.+(html|scss|png|woff|woff2|eot|ttf|svg)"])
        .pipe(gulp.dest("./dist/lib"));
});

gulp.task("build-npm-ts", ["build-clean"], (callback) => {
    const typescriptProject = typescriptCompiler.createProject("./npm-tsconfig.json", {
        typescript: typescript,
        declaration: true,
        rootDir: "./src"
    });

    const tsResult = typescriptProject
        .src()
        .pipe(typescriptProject())

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest("./dist/lib")),
        tsResult.js.pipe(gulp.dest("./dist/lib"))
    ]);
});

gulp.task('server', ["build"], () => {
    const webPackConfig = require("./webpack.config.js");
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

gulp.task('build-clean',(done) => {
    return del(["dist/client/**"], done);
});

gulp.task("build", (done) => runSeq('build-clean', "webpack-dev", done));

gulp.task("default", ["server"]);

/*** PUBLISH FUNCTIONS PACKAGE ***/
gulp.task("webpack-publish", (callback) => {
    var webPackConfig = require("./webpack.config.publish.js");
    webpack(webPackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        
        gutil.log('[webpack-publish]', stats.toString({        
            colors: true,        
            progress: true        
        }));
    
        callback();        
    });
});
gulp.task("webpack-server", (callback) => {
    var webPackConfig = require("./webpack.config.server.js");
    webpack(webPackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        
        gutil.log('[webpack-server]', stats.toString({        
            colors: true,        
            progress: true        
        }));
    
        callback();        
    });
});

gulp.task("publish", () => {
    runSeq("webpack-publish", ["webpack-server"], () => {
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