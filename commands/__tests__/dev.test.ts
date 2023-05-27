import type Yargs from 'yargs';
import type { WebpackYargsConfig } from '@zg-rentals/webpack';

jest.mock('@zg-rentals/webpack', () => ({
  startWebpackBuild: jest.fn(),
  startWebpackWatch: jest.fn(),
  createWebpackYargs: ({ command, description, options }: WebpackYargsConfig) => ({
    builder: (yargs: typeof Yargs) => {
      Object.keys(options).forEach((key) => {
        yargs.option(key, options[key]);
      });
      return yargs;
    },
    command,
    description,
  }),
}));
jest.mock('../../webpack.config.ts');
jest.mock('@zg-rentals/webpack');
jest.mock('webpack');

import type { Argv } from '../dev';
import { builder, command, handler } from '../dev';
import { yargs } from '@zg-rentals/cli-tools';
import { mockGetWorkspaces } from '@zg-rentals/workspace-graph';
import createWebpackConfig from '../../webpack.config';
import { startWebpackWatch } from '@zg-rentals/webpack';
import webpack from 'webpack';
import { expect } from '@jest/globals';

const { run } = yargs.buildTest<Argv>(command, builder, handler);

afterEach(() => {
  jest.clearAllMocks();
});

describe('dev', () => {
  beforeEach(() => {
    mockGetWorkspaces('/root', {
      '/root': { name: 'root', workspaces: ['apps/*'] },
      '/root/apps/rent-guarantee-admin-web': { name: '@zg-rentals/rent-guarantee-admin-web' },
    });
  });

  test('runs the webpack config', async () => {
    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run('--repo-root=/root');

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(createWebpackConfig).toHaveBeenCalledTimes(1);
  });

  test('passes args to webpack config', async () => {
    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run('--repo-root=/root --mode production --port 4000 --api https://zillow.com');

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(createWebpackConfig).toHaveBeenCalledTimes(1);

    expect(createWebpackConfig).toHaveBeenLastCalledWith(
      expect.objectContaining({
        mode: 'production',
        publicPath: `http://localhost:4000/`,
        api: 'https://zillow.com',
        port: 4000,
      }),
    );
  });

  test('creates the compiler and startWebpackWatch', async () => {
    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run('--repo-root=/root');

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(webpack).toHaveBeenCalledTimes(1);
    expect(startWebpackWatch).toHaveBeenCalledTimes(1);
  });
});
