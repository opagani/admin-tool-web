import { GraphQLClient } from 'graphql-request';
import type { LogIdType ,
  Maybe,
  SortBy,
  SortDir} from '../../generated-types/graphql';
import {
  usePoliciesAndHistoryQuery,
  usePolicySearchTypesQuery,
  usePolicyStatusesQuery,
  useSearchPoliciesQuery,
} from '../../generated-types/graphql';

const graphQLClient = new GraphQLClient(`${__GRAPHQL_API__}/rent-guarantee-graphql/graphql`, {
  credentials: 'include',
});

const graphQLOptions = {
  refetchOnWindowFocus: false,
  enabled: false,
};

export const useSearchPolicies = (
  searchType: string,
  searchValue: string,
  currentPage: number,
  pageSize: number,
  sortBy: Maybe<SortBy>,
  sortDir: Maybe<SortDir>,
) => {
  const fromIndex = currentPage * pageSize;
  const { status, data, error, isFetching, refetch } = useSearchPoliciesQuery(
    graphQLClient,
    { searchType, searchValue, fromIndex, pageSize, sortBy, sortDir },
    graphQLOptions,
  );
  return { status, data, error, isFetching, refetch };
};

export const useSearchPoliciesAndHistory = (
  searchType: LogIdType,
  searchValue: string,
  currentPage: number,
  pageSize: number,
  sortBy: Maybe<SortBy>,
  sortDir: Maybe<SortDir>,
) => {
  const fromIndex = currentPage * pageSize;
  const { status, data, error, isFetching, refetch } = usePoliciesAndHistoryQuery(
    graphQLClient,
    { searchType, searchValue, fromIndex, pageSize, sortBy, sortDir },
    graphQLOptions,
  );

  return { status, data, error, isFetching, refetch };
};

export const usePolicySearchTypes = () => {
  const { status, data, error, isFetching, refetch } = usePolicySearchTypesQuery(
    graphQLClient,
    {},
    {
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );

  const values =
    data?.policySearchTypes?.values && data?.policySearchTypes?.values.length > 0
      ? { status, data, error, isFetching, refetch }
      : null;

  return values;
};

export const usePolicyStatuses = () => {
  const { status, data, error, isFetching, refetch } = usePolicyStatusesQuery(
    graphQLClient,
    {},
    {
      refetchOnWindowFocus: false,
      enabled: true,
    },
  );

  const values =
    data?.policyStatuses?.values && data?.policyStatuses?.values.length > 0
      ? { status, data, error, isFetching, refetch }
      : null;

  return values;
};
