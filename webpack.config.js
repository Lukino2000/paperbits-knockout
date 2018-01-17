const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

const selectedTheme = "paperbits";
//const selectedTheme = "hostmeapp";

const extractSass = new ExtractTextPlugin({
    filename: (resultPath) => {
        return resultPath('./[name].css').replace("scripts", "css");
    },
    allChunks: true,
});

module.exports = {
    entry: {
        "scripts/paperbits":['./src/startup.ts', './src/styles/vienna.scss'], 
        "theme/scripts/theme": [`./src/themes/${selectedTheme}/scripts/index.ts`, `./src/themes/${selectedTheme}/styles/styles.scss`]
    },
    output: {
        filename: './[name].js',
        path: path.resolve(__dirname, 'dist/client')
    },
    devtool: 'source-map',
    module: {
        rules: [
            { // sass / scss loader for webpack
                test: /\.scss$/,
                use: extractSass.extract({        
                    use: [
                        { loader: "css-loader", options: { url: false, minimize: true, sourceMap: true } },
                        { loader: 'postcss-loader', options: { sourceMap: true, options: { plugins: () => [autoprefixer] } } },
                        { loader: "sass-loader", options: { sourceMap: true } }
                    ],
                    fallback: "style-loader"
                }),
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'main-tsconfig.json'
                },
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: "html-loader?exportAsEs6Default"
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    plugins: [
        //new CleanWebpackPlugin(['dist/client']),
        extractSass,      
        /**
         * Plugin: CopyWebpackPlugin
         * Description: Copy files and directories in webpack.
         *
         * Copies project static assets.
         *
         * See: https://www.npmjs.com/package/copy-webpack-plugin
         */
        new CopyWebpackPlugin([
            { from: 'src/assets' },     
            { from: 'src/styles/fonts', to: 'css/fonts' },        
            { from: `src/themes/${selectedTheme}/assets`, to: "theme"},
            { from: `src/themes/${selectedTheme}/config.json`}      
        ]),
        //new webpack.optimize.ModuleConcatenationPlugin(),   
        new webpack.HotModuleReplacementPlugin()      
        /**
         * Webpack plugin to optimize a JavaScript file for faster initial load
         * by wrapping eagerly-invoked functions.
         *
         * See: https://github.com/vigneshshanmugam/optimize-js-plugin
         */
        // new OptimizeJsPlugin({            
        //     sourceMap: false
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     ie8: false,        
        //     ecma: 5,        
        //     mangle: false, 
        //     output: { 
        //         comments: false,
        //         beautify: false
        //     } 
        // })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".html", ".scss"] 
    }
};