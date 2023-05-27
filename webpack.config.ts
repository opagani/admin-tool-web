import type { Configuration } from 'webpack';
import type { Logger } from '@zg-rentals/logger-node';
import type { DevConfig } from '@zg-rentals/webpack';

import { DefinePlugin, optimize } from 'webpack';
import { getWorkspaceGraph } from '@zg-rentals/workspace-graph';
import {
  createJsRule,
  createMinimizer,
  createPaths,
  createSvgComponentRule,
  createUrlLoaderRule,
  DevServer,
  htmlGeneratorPlugin,
  TSCheckerPlugin,
} from '@zg-rentals/webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import { getChildLogger } from '@zg-rentals/logger-node';
import { name } from './package.json';
import path from 'path';

export const appName = name.replace('@zg-rentals/', '');

export default function createWebpackConfig({
  mode,
  publicPath,
  buildNumber,
  logger = getChildLogger('createWebpackConfig'),
  api,
  graphqlApi,
  port,
  repoRoot = '../../',
  zgEnv,
  appUrlPrefix,
}: {
  mode: 'development' | 'production';
  publicPath: string;
  buildNumber?: number;
  api: string;
  port?: number;
  repoRoot?: string;
  logger?: Logger;
  zgEnv: string;
  appUrlPrefix: string;
  graphqlApi?: string;
}): Configuration {
  const isDev = mode === 'development';
  const workspaceGraph = getWorkspaceGraph(repoRoot);
  const workspace = workspaceGraph.getWorkspace(appName);
  const paths = createPaths({
    browserEntry: 'app/client',
  });

  let devServer: DevConfig = { config: {}, plugins: [] };

  if (isDev) {
    devServer = DevServer({
      port,
      onlyBrowser: true,
    });
  }

  const config: Configuration = {
    context: process.cwd(),
    mode: mode,
    target: 'web',
    devtool: isDev ? 'cheap-module-source-map' : 'source-map',
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        'styled-components': path.resolve(__dirname, '../../node_modules/styled-components'),
      },
    },
    resolveLoader: {
      modules: [workspace.resolvePath('node_modules'), workspace.resolvePathFromRoot('node_modules')],
    },
    module: {
      strictExportPresence: true,
      rules: [createJsRule({ logger }), createSvgComponentRule({ logger }), createUrlLoaderRule({ logger })],
    },
    optimization: {
      providedExports: true,
      sideEffects: !isDev,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
      usedExports: true,
      minimize: !isDev,
      minimizer: isDev ? [createMinimizer({})] : [],
    },
    plugins: [
      new AssetsPlugin({
        path: paths.nodeOutput,
        filename: 'assets.json',
      }),
      TSCheckerPlugin(),
      ...(isDev ? devServer.plugins : []),
      new DefinePlugin({
        __APP_NAME__: JSON.stringify(appName),
        __ZG_ENV__: JSON.stringify(zgEnv),
        __BUILD_NUMBER__: JSON.stringify(buildNumber),
        __API__: JSON.stringify(api),
        __APP_URL_PREFIX__: JSON.stringify(appUrlPrefix),
        __GRAPHQL_API__: JSON.stringify(graphqlApi),
        __DEV__: JSON.stringify(isDev),
        __PROD__: JSON.stringify(!isDev),
      }),
      new optimize.AggressiveMergingPlugin(),
      htmlGeneratorPlugin({ paths, options: { meta: { 'rp-application-name': appName } } }),
    ],
    entry: {
      client: [...(isDev ? ['react-hot-loader/patch'] : []), paths.browserEntry],
    },
    output: {
      path: paths.browserOutput,
      publicPath,
      pathinfo: true,
      libraryTarget: 'var',
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].[chunkhash:8].js',
    },
    devServer: {
      ...devServer.config,
    },
  };

  logger.debug(config);

  return config;
}
