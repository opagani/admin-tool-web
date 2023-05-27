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
jest.mock('../../webpack.config');
jest.mock('@zg-rentals/webpack');
jest.mock('@zg-rentals/aws');

import type { Argv } from '../upload';
import { builder, command, handler } from '../upload';
import { yargs } from '@zg-rentals/cli-tools';
import { getCredentials, SecretsManagerClient, uploadDir } from '@zg-rentals/aws';
import { mockGetWorkspaces } from '@zg-rentals/workspace-graph';
import createWebpackConfig from '../../webpack.config';
import { expect } from '@jest/globals';

const { run } = yargs.buildTest<Argv>(command, builder, handler);

afterEach(() => {
  jest.clearAllMocks();
});

describe('upload', () => {
  beforeEach(() => {
    mockGetWorkspaces('/root', {
      '/root': { name: 'root', workspaces: ['apps/*'] },
      '/root/apps/rent-guarantee-admin-web': { name: '@zg-rentals/rent-guarantee-admin-web' },
    });
  });

  test('passes args to getCredentials', async () => {
    (SecretsManagerClient as unknown as jest.Mock).mockImplementation(() => {
      return {
        getSecretValue: jest.fn().mockImplementation(() => {
          return {
            accessKey: 'buzz',
            secretKey: 'lightyear',
          };
        }),
      };
    });
    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run(
      '--repo-root=/root --aws-access-key-id=taco --aws-secret-access-key=bar --aws-session-token=cat --source=. --s3-folder=123',
    );

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(getCredentials).toHaveBeenCalled();
    expect(getCredentials).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        accessKeyId: 'taco',
        secretAccessKey: 'bar',
        sessionToken: 'cat',
      }),
    );
  });

  test('gets s3 secret', async () => {
    const mockGetSecretValue = jest.fn(() => ({
      accessKey: 'buzz',
      secretKey: 'lightyear',
    }));

    (SecretsManagerClient as unknown as jest.Mock).mockImplementation(() => {
      return {
        getSecretValue: mockGetSecretValue,
      };
    });

    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run(
      '--repo-root=/root --aws-access-key-id=taco --aws-secret-access-key=bar --aws-session-token=cat --source=. --s3-folder=123',
    );

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(mockGetSecretValue).toHaveBeenLastCalledWith('development/shared/s3/s3master');
  });

  test('calls uploadDir on source', async () => {
    const mockFinalCredentials = {
      accessKeyId: 'abc',
      secretAccessKey: '123',
    };
    (getCredentials as unknown as jest.Mock)
      .mockImplementation(() => {})
      .mockImplementation(() => mockFinalCredentials);

    const mockGetSecretValue = jest.fn(() => ({
      accessKey: 'buzz',
      secretKey: 'lightyear',
    }));

    (SecretsManagerClient as unknown as jest.Mock).mockImplementation(() => {
      return {
        getSecretValue: mockGetSecretValue,
      };
    });

    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run(
      '--repo-root=/root --aws-access-key-id=taco --aws-secret-access-key=bar --aws-session-token=cat --source=. --s3-folder=123',
    );

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(getCredentials).toHaveBeenCalledTimes(2);
    expect(getCredentials).toHaveBeenLastCalledWith(
      expect.objectContaining({
        accessKeyId: 'buzz',
        secretAccessKey: 'lightyear',
        forceResolveCredentials: true,
      }),
    );
    expect(uploadDir).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filePath: '.',
        options: {
          Bucket: 'nodeassets/123',
        },
      }),
    );
  });

  test("uses webpackconfig's output path as source", async () => {
    (SecretsManagerClient as unknown as jest.Mock).mockImplementation(() => {
      return {
        getSecretValue: jest.fn().mockImplementation(() => {
          return {
            accessKey: 'buzz',
            secretKey: 'lightyear',
          };
        }),
      };
    });
    (createWebpackConfig as unknown as jest.Mock).mockImplementation(() => {
      return {
        output: {
          path: '../dist/client',
        },
      };
    });

    const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});

    await run(
      '--repo-root=/root --aws-access-key-id=taco --aws-secret-access-key=bar --aws-session-token=cat --s3-folder=123',
    );

    expect(chdir).toHaveBeenCalledWith('/root/apps/rent-guarantee-admin-web');
    expect(uploadDir).toHaveBeenCalled();
    expect(uploadDir).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filePath: '../dist/client',
      }),
    );
  });
});
