import type { Arguments } from 'yargs';
import type { DefaultArgv } from '@zg-rentals/cli-tools';
import { getCredentials, getS3Client, SecretsManagerClient, uploadDir } from '@zg-rentals/aws';
import { getWorkspaceGraph } from '@zg-rentals/workspace-graph';
import { yargsToCamelCase } from '@zg-rentals/app';
import createWebpackConfig, { appName } from '../webpack.config';
import { createWebpackYargs } from '@zg-rentals/webpack';

export type Argv = DefaultArgv & {
  'zg-env': string;
  'public-path-origin': string;
  'app-url-prefix': string;
  api: string;
  mode: 'development' | 'production';
  'public-path': string;
  'graphql-api': string;
  source: string | undefined;
  's3-bucket': string;
  's3-folder': string | undefined;
  'aws-access-key-id': string | undefined;
  'aws-secret-access-key': string | undefined;
  'aws-session-token': string | undefined;
};

const options = {
  'zg-env': {
    default: process.env.ZG_ENV || 'production-docker',
    description: 'Correlates to .env file which will be loaded and set for process.env variables',
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
  'graphql-api': {
    default: 'http://localhost:4000',
    description: 'Api endpoint for outgoing graphql requests',
  },
  mode: {
    default: 'production',
    description: 'Webpack mode',
  },
  source: {
    description: 'Path to folder that should be uploaded',
  },
  's3-bucket': {
    default: 'nodeassets',
    demandOption: true,
    description: 'Top level bucket of s3 to upload files to. Comprises first part of s3 path',
  },
  's3-folder': {
    default: `${appName}/${process.env.BUILD_NUMBER}`,
    description: 'Folder to upload source to in s3. Level below s3-bucket.',
  },
  'aws-access-key-id': {
    default: process.env.AWS_ACCESS_KEY_ID,
    demandOption: true,
    description: 'AWS_ACCESS_KEY_ID for AWS SecretManager',
  },
  'aws-secret-access-key': {
    default: process.env.AWS_SECRET_ACCESS_KEY,
    demandOption: true,
    description: 'AWS_SECRET_ACCESS_KEY for AWS SecretManager',
  },
  'aws-session-token': {
    description: 'AWS_SESSION_TOKEN for AWS SecretManager',
  },
};

export const { command, description, builder } = createWebpackYargs<Argv>({
  appName,
  command: 'upload',
  options,
});

export async function handler(argv: Arguments<Argv>) {
  const { awsSessionToken, awsSecretAccessKey, awsAccessKeyId, s3Bucket, s3Folder, ...args } =
    yargsToCamelCase<Argv>(argv);

  let { source } = argv;

  args.publicPath = '';
  args.graphqlApi = '';

  const config = createWebpackConfig(args);

  source = source || config.output?.path || '';

  if (!source || !s3Folder) {
    throw new Error('missing source or destination folder');
  }

  const workspaceGraph = getWorkspaceGraph(args.repoRoot);
  const thisWorkspace = workspaceGraph.getWorkspace(appName);

  process.chdir(thisWorkspace.resolvePath('.'));

  const credentials = await getCredentials({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
    sessionToken: awsSessionToken,
  });

  const secretManager = new SecretsManagerClient({ credentials });

  const { accessKey, secretKey } = await secretManager.getSecretValue<{ accessKey: string; secretKey: string }>(
    'development/shared/s3/s3master',
  );

  const s3Credentials = await getCredentials({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    sessionToken: '',
    forceResolveCredentials: true,
  });

  const getClient = async () => {
    return await getS3Client({ credentials: s3Credentials });
  };

  await uploadDir({
    getClient,
    filePath: source,
    options: {
      Bucket: `${s3Bucket}/${s3Folder}`,
    },
  });
}
