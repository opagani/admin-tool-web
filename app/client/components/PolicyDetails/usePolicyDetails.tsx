import { GraphQLClient } from 'graphql-request';
import {
  useCancelPolicyMutation,
  usePolicyRelatedActionsDetailsAndHistoryQuery,
  useReinstateDroppedPolicyMutation,
} from '../../generated-types/graphql';

const graphQLClient = new GraphQLClient(`${__GRAPHQL_API__}/rent-guarantee-graphql/graphql`, {
  credentials: 'include',
});

const graphQLOptions = {
  refetchOnWindowFocus: false,
  enabled: false, // turned off by default, manual refetch is needed
};

export const usePolicyRelatedActionsDetailsAndHistory = (policyId: string) => {
  const { status, data, error, isFetching, refetch } = usePolicyRelatedActionsDetailsAndHistoryQuery(
    graphQLClient,
    { policyId, delimiter: '/' },
    graphQLOptions,
  );

  return { status, data, error, isFetching, refetch };
};

export const useCancelPolicy = () => {
  const { status, data, error, mutate } = useCancelPolicyMutation(graphQLClient, {});

  return { status, data, error, mutate };
};

export const useReinstateDroppedPolicy = () => {
  const { status, data, error, mutate } = useReinstateDroppedPolicyMutation(graphQLClient, {});

  return { status, data, error, mutate };
};
