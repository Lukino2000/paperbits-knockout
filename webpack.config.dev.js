const path = require('path');
const webpack = require('webpack');

//const selectedTheme = "paperbits";
const selectedTheme = "hostmeapp";

module.exports = {
    entry: {
        paperbits: ['./src/startup.ts'],
        theme: [`./src/themes/${selectedTheme}/scripts/index.ts`]
    },
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, 'dist/client')
    },
    devtool: 'source-map',
    module: {
        rules: [
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
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()        
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".html", ".scss"] 
    }
};