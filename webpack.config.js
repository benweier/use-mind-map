const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const HTMLPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, 'public', 'index.html'),
  filename: 'index.html',
  chunks: ['main'],
  inject: 'body',
  scriptLoading: 'module',
  minify: {
    removeComments: true,
    collapseWhitespace: true,
  },
})

// const CSSExtractConfig = new MiniCssExtractPlugin({
//   filename: '[name].[chunkhash].css',
//   chunkFilename: '[id].css',
//   experimentalUseImportModule: true,
// })

const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
})

module.exports = (env,argv) => {
  const isProduction = argv.mode === 'production'

  const plugins = [HTMLPluginConfig, DefinePluginConfig, new WebpackManifestPlugin()]

  if (!isProduction) {
    plugins.push(new ReactRefreshPlugin())
  }

  return {
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      plugins: [new TsConfigPathsPlugin()],
      fallback: {
        fs: false,
        path: false,
        os: false,
        module: false,
        util: false,
      },
      alias: {
        "react-redux": "react-redux/es/next",
      },
    },
    output: {
      module: isProduction,
      asyncChunks: true,
      chunkFormat: isProduction ? 'module' : 'array-push',
      chunkLoading: isProduction ? 'import' : 'jsonp',
      clean: true,
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: '[fullhash:8].[chunkhash].js',
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: false,
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        maxSize: 200000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncSize: 200000,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          vendors: {
            test: /node_modules/,
            priority: -10,
            reuseExistingChunk: true,
            usedExports: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            usedExports: true,
          },
        },
      },
    },
    devServer: {
      compress: false,
      port: 8080,
      hot: true,
      server: 'spdy',
      static: {
        directory: path.join(__dirname, 'public'),
      },
      historyApiFallback: true,
      open: true,
      watchFiles: ['src/**/*.{ts|tsx}', 'public/**/*'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        // {
        //   test: /\.css$/i,
        //   use: [
        //     'style-loader',
        //     MiniCssExtractPlugin.loader,
        //     {
        //       loader: 'css-loader',
        //       options: {
        //         modules: true,
        //         importLoaders: 1,
        //       },
        //     },
        //     {
        //       loader: 'postcss-loader',
        //       options: {
        //         postcssOptions: {
        //           plugins: [
        //             [
        //               'postcss-preset-env',
        //               {
        //                 stage: 2,
        //               }
        //             ],
        //           ],
        //         },
        //       },
        //     },
        //   ],
        // },
        {
          test: /\.(svg|ttf|woff|woff2|png|jpg|jpeg|gif|webm)$/i,
          type: 'asset',
        },
      ],
    },
    plugins,
    mode: env,
    experiments: {
      outputModule: isProduction,
      layers: true,
    },
  }
}
