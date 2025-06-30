import {merge} from 'webpack-merge';
import common from './webpack.common.mjs';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';
import TerserPlugin from 'terser-webpack-plugin';


export default merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {ecma: 8},
                    compress: {ecma: 5, warnings: false, inline: 2},
                    mangle: {safari10: true},
                    output: {ecma: 5, comments: false, ascii_only: true}
                },
                parallel: true,
                extractComments: false,
                // cache: true,
            })
        ],
    },
    output: {
        clean: true,
        filename: "[name].[contenthash:8].js",
    },
    plugins: [
        new WebpackManifestPlugin({}),
    ]
});
