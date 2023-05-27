import { GraphQLClient } from 'graphql-request';
import type { LogIdType } from '../../generated-types/graphql';
import { useLandlordHistoryQuery } from '../../generated-types/graphql';

const graphQLClient = new GraphQLClient(`${__GRAPHQL_API__}/rent-guarantee-graphql/graphql`, {
  credentials: 'include',
});

export const useLandlordHistory = (searchType: LogIdType, searchValue: string) => {
  const { status, data, error, isFetching, refetch } = useLandlordHistoryQuery(
    graphQLClient,
    { searchType, searchValue },
    {
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );

  return { status, data, error, isFetching, refetch };
};
