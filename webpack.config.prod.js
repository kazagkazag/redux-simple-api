const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: "ReactSimpleAPI",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    optimization: {
        minimize: true
    },
    externals: {
        axios: "axios",
        shortid: "shortid",
        redux: "redux"
    }
};
