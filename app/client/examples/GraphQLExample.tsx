import React from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { gql, request } from 'graphql-request';

interface Props {
  postId: number;
  setPostId: (postId: number) => void;
}

const endpoint = 'https://graphqlzero.almansi.me/api';

const queryClient = new QueryClient();

function usePosts() {
  return useQuery('posts', async () => {
    const {
      posts: { data },
    } = await request(
      endpoint,
      gql`
        query {
          posts {
            data {
              id
              title
            }
          }
        }
      `,
    );
    return data as Array<{ id: number; title: string }>;
  });
}

function Posts({ setPostId }: Props) {
  const queryClient = useQueryClient();
  const { status, data, error, isFetching } = usePosts();

  return (
    <div>
      <h1>Posts</h1>
      <h3>Data from a GraphQL endpoint</h3>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : error instanceof Error ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {(data || []).map((post: { id: number; title: string }) => (
                <p key={String(post.id)}>
                  <a
                    onClick={() => setPostId(post.id)}
                    href="#"
                    style={
                      // We can find the existing query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData(['post', post.id])
                        ? {
                            fontWeight: 'bold',
                            color: 'green',
                          }
                        : {}
                    }
                  >
                    {String(post.title)}
                  </a>
                </p>
              ))}
            </div>
            <div>{isFetching ? 'Background Updating...' : ' '}</div>
          </>
        )}
      </div>
    </div>
  );
}

function usePost(postId?: number) {
  return useQuery(
    ['post', postId],
    async () => {
      const { post } = await request(
        endpoint,
        gql`
        query {
          post(id: ${postId}) {
            id
            title
            body
          }
        }
        `,
      );

      return post;
    },
    {
      enabled: !!postId,
    },
  );
}

function Post({ postId, setPostId }: Props) {
  const { status, data, error, isFetching } = usePost(postId);

  return (
    <div>
      <div>
        <a onClick={() => setPostId(-1)} href="#">
          Back
        </a>
      </div>
      {!postId || status === 'loading' ? (
        'Loading...'
      ) : error instanceof Error ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h1>{data.title}</h1>
          <div>
            <p>{data.body}</p>
          </div>
          <div>{isFetching ? 'Background Updating...' : ' '}</div>
        </>
      )}
    </div>
  );
}

const GraphQLExample = () => {
  const [postId, setPostId] = React.useState(-1);

  return (
    <QueryClientProvider client={queryClient}>
      <p>
        As you visit the posts below, you will notice them in a loading state the first time you load them. However,
        after you return to this list and click on any posts you have already visited again, you will see them load
        instantly and background refresh right before your eyes!{' '}
        <strong>(You may need to throttle your network speed to simulate longer loading sequences)</strong>
      </p>
      {postId > -1 ? <Post postId={postId} setPostId={setPostId} /> : <Posts postId={postId} setPostId={setPostId} />}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default GraphQLExample;
