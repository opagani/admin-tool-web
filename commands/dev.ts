import type { DefaultArgv } from '@zg-rentals/cli-tools';
import type { Arguments } from 'yargs';
import createWebpackConfig, { appName } from '../webpack.config';
import { createWebpackYargs, startWebpackWatch } from '@zg-rentals/webpack';
import { yargsToCamelCase } from '@zg-rentals/app';
import { getWorkspaceGraph } from '@zg-rentals/workspace-graph';
import webpack from 'webpack';

export type Argv = DefaultArgv & {
  'zg-env': string;
  'public-path': string;
  api: string;
  'app-url-prefix': string;
  mode: 'development' | 'production';
  port: number;
  'graphql-api': string;
};

const options = {
  'zg-env': {
    default: process.env.ZG_ENV || 'local',
    description: 'Correlates to .env file which will be loaded and set for process.env variables',
  },
  api: {
    alias: 'api',
    descrption: 'Api endpoint for outgoing java requests',
    default: 'https://comet1.testpads.net',
  },
  'app-url-prefix': {
    default: '/rent-guarantee/adminApp',
    description: 'Basename for BrowserRouter',
  },
  mode: {
    default: 'development',
    description: 'Webpack mode',
  },
  port: {
    default: 3001,
    description: 'Port to run the dev server on',
  },
  'graphql-api': {
    default: 'https://comet1.testpads.net/rent-guarantee',
    description: 'Api endpoint for outgoing graphql requests',
  },
};

export const { command, description, builder } = createWebpackYargs<Argv>({
  appName,
  command: 'dev',
  options,
});

export async function handler(argv: Arguments<Argv>) {
  const args = yargsToCamelCase<Argv>(argv);
  const workspaceGraph = getWorkspaceGraph(args.repoRoot as string);
  const thisWorkspace = workspaceGraph.getWorkspace(appName);

  process.chdir(thisWorkspace.resolvePath('.'));

  args.publicPath = `http://localhost:${argv.port}/`;

  const config = createWebpackConfig(args);
  const compiler = webpack(config);

  await startWebpackWatch({
    compilers: new Map([['client', compiler]]),
    configs: new Map([['client', config]]),
    devServerPort: argv.port,
  });
}
