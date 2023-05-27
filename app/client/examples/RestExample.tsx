import React from 'react';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import axios from 'axios';

function Pokemon() {
  const { status, data, error, isFetching } = useQuery('pokemon', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return axios.get('https://pokeapi.co/api/v2/pokemon').then((res) => res.data.results);
  });

  return (
    <div>
      <h1>Pokemons</h1>
      <h3>Data from a Rest Api endpoint</h3>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : error instanceof Error ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data?.map((result: Record<string, unknown>) => (
                <div key={String(result.name)}>{String(result.name)}</div>
              ))}
            </div>
            <div>{isFetching ? 'Background Updating...' : ' '}</div>
          </>
        )}
      </div>
    </div>
  );
}

const RestExample = () => {
  return (
    <div>
      <Pokemon />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};

export default RestExample;
