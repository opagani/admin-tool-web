import { GraphQLClient } from 'graphql-request';
import {
  useLandlordsDataForReportsQuery,
  useReportsQuery,
  useUserActivityDataForReportsQuery,
} from '../../generated-types/graphql';

const graphQLClient = new GraphQLClient(`${__GRAPHQL_API__}/rent-guarantee-graphql/graphql`, {
  credentials: 'include',
});

const graphQLOptions = {
  refetchOnWindowFocus: false,
  enabled: false, // turned off by default, manual refetch is needed
};

export const useReports = (reportType?: string) => {
  const { status, data, error, isFetching, refetch } = useReportsQuery(
    graphQLClient,
    { reportType },
    {
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );

  const values =
    data?.reports?.reportsDetails && data?.reports?.reportsDetails.length > 0
      ? { status, data, error, isFetching, refetch }
      : null;

  return values;
};

export const useLandlordsDataForReports = (methodToInvoke: string, urlParams: string) => {
  const { status, data, error, isFetching, refetch } = useLandlordsDataForReportsQuery(
    graphQLClient,
    { methodToInvoke, urlParams },
    graphQLOptions,
  );

  return { status, data, error, isFetching, refetch };
};

type UrlParams = {
  name: string;
  value?: string;
};

export const useUserActivityDataForReports = (methodToInvoke: string, urlParams: Array<UrlParams>) => {
  const { status, data, error, isFetching, refetch } = useUserActivityDataForReportsQuery(
    graphQLClient,
    { methodToInvoke, urlParams },
    graphQLOptions,
  );

  return { status, data, error, isFetching, refetch };
};
