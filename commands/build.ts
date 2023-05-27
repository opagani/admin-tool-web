import type { Arguments } from 'yargs';
import type { DefaultArgv } from '@zg-rentals/cli-tools';
import { getWorkspaceGraph } from '@zg-rentals/workspace-graph';
import createWebpackConfig, { appName } from '../webpack.config';
import { yargsToCamelCase } from '@zg-rentals/app';
import { createWebpackYargs, startWebpackBuild } from '@zg-rentals/webpack';

export type Argv = DefaultArgv & {
  'zg-env': string;
  'build-number': number;
  'public-path-origin': string;
  api: string;
  'app-url-prefix': string;
  mode: 'development' | 'production';
  'public-path': string;
  'graphql-api': string;
};

const options = {
  'zg-env': {
    default: process.env.ZG_ENV || 'production-docker',
    description: 'Correlates to .env file which will be loaded and set for process.env variables',
  },
  'build-number': {
    default: 0,
    description: 'C/I build number for this command',
  },
  'public-path-origin': {
    default: 'https://nodes3cdn.hotpads.com',
    description:
      'Http protocol and full domain for uploaded assets. Combined with build number and workspace name to create the full public path',
  },
  api: {
    alias: 'api',
    descrption: 'Api endpoint for outgoing java requests',
    default: '',
  },
  'app-url-prefix': {
    default: '/rent-guarantee/adminApp',
    description: 'Basename for BrowserRouter',
  },
  mode: {
    default: 'production',
    description: 'Webpack mode',
  },
  'graphql-api': {
    default: '/rent-guarantee',
    description: 'Api endpoint for outgoing graphql requests',
  },
};

export const { command, description, builder } = createWebpackYargs<Argv>({
  appName,
  command: 'build',
  options,
});

export async function handler(argv: Arguments<Argv>) {
  const args = yargsToCamelCase<Argv>(argv);
  const workspaceGraph = getWorkspaceGraph(args.repoRoot as string);
  const thisWorkspace = workspaceGraph.getWorkspace(appName);

  const { publicPathOrigin, buildNumber } = args;

  args.publicPath = `${publicPathOrigin}/${appName}/${buildNumber}/`;

  process.chdir(thisWorkspace.resolvePath('.'));

  const config = createWebpackConfig(args);

  await startWebpackBuild({
    configs: new Map([['client', config]]),
  });

  return;
}
