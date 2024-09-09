import {merge} from 'webpack-merge';
import common from './webpack.common.mjs';
import path from 'node:path';
import process from 'node:process'

const localProxy = {
    target: {
        host: 'localhost',
        protocol: 'http:',
        port: 8081
    },
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

export default merge(common, {
    mode: 'development',
    devServer: {
        allowedHosts: 'auto',
        static: [
            {directory: path.join(process.cwd(), 'public'), watch: false},
            {directory: path.join(process.cwd(), 'node_modules'), publicPath: '/node_modules', watch: false}
        ],
        hot: true,
        proxy: [
            {context: ['/api', '/node-b2b', '/node-sage', '/sage'], ...localProxy}
        ],
        watchFiles: 'src/**/*',
    },
    devtool: 'eval-source-map',
    plugins: []
});
