import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import fs from 'fs';
import { promisify } from 'util';

const __DEV__ = process.env.NODE_ENV !== 'production';
const paths = {
  enties: path.resolve(__dirname, '../entries'),
  dist: path.resolve(__dirname, '../dist'),
};

const readdir = promisify(fs.readdir);

export default async (): Promise<Configuration> => ({
  devtool: __DEV__ ? 'source-map' : 'nosources-source-map',
  entry: (await readdir(paths.enties))
    .filter((file) => /\.tsx?$/.test(file) && !/^_/.test(file))
    .reduce<Record<string, string>>((acc, file) => {
      acc[path.parse(file).name] = path.join(paths.enties, file);
      return acc;
    }, {}),
  output: {
    path: paths.dist,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      memoryLimit: 4096,
      useTypescriptIncrementalApi: false,
      workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
          {
            loader: 'eslint-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.json\.tsx?$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]',
            },
          },
          'val-loader',
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: __DEV__ ? '[path]___[name]__[local]___[hash:base64:5]' : '[hash:base64:16]',
              },
              sourceMap: __DEV__,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|gif|webp|svg)$/i,
        use: [
          {
            loader: 'file-laoder',
            options: {
              outputPath: 'assets',
            },
          },
        ],
      },
    ],
  },
});
