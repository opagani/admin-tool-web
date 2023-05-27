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

import type { Argv } from '../build';
import { builder, command, handler } from '../build';
import { yargs } from '@zg-rentals/cli-tools';
import { mockGetWorkspaces } from '@zg-rentals/workspace-graph';
import createWebpackConfig from '../../webpack.config';
import { startWebpackBuild } from '@zg-rentals/webpack';
import { expect } from '@jest/globals';

const { run } = yargs.buildTest<Argv>(command, builder, handler);

afterEach(() => {
  jest.clearAllMocks();
});

describe('build', () => {
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

    await run('--repo-root=/root --build-number 7 --mode development --public-path-origin https://hotpads.com');

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(createWebpackConfig).toHaveBeenCalledTimes(1);

    expect(createWebpackConfig).toHaveBeenLastCalledWith(
      expect.objectContaining({
        buildNumber: 7,
        mode: 'development',
        publicPath: `https://hotpads.com/rent-guarantee-admin-web/7/`,
      }),
    );
  });

  test('starts the webpack build', async () => {
    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run('--repo-root=/root');

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(startWebpackBuild).toHaveBeenCalledTimes(1);
  });
});
