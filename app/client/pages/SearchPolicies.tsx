import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import SearchPoliciesTable from '../components/SearchPolicies/SearchPoliciesTable';
import HistoryTable from '../components/SearchPolicies/HistoryTable';
import { convertFromJSONToCSVForSearchPolicies, convertToLocalISOTime } from '../utils/utils';
import {
  usePolicySearchTypes,
  usePolicyStatuses,
  useSearchPolicies,
  useSearchPoliciesAndHistory,
} from '../components/SearchPolicies/useSearchPolicies';

import {
  Button,
  Form,
  FormField,
  FormHelp,
  Grid,
  Heading,
  Input,
  LoadingMask,
  Page,
  PageContent,
  PageTitle,
  Pagination,
  Paragraph,
  Select,
} from '@zillow/constellation';
import type {
  LogIdType,
  PoliciesAndHistoryQuery,
  SearchPoliciesQuery,
  SortBy,
  SortDir,
} from '../generated-types/graphql';

const SearchPolicies = (): JSX.Element => {
  const PAGE_SIZE = 25;
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);
  const [searchType, setSearchType] = React.useState(params.get('searchType') || 'policyStatus');
  const initialValue = searchType === 'policyStatus' ? 'draft' : '';
  const [searchValue, setSearchValue] = React.useState(params.get('searchValue') || initialValue);
  const [displayName, setDisplayName] = React.useState('Policy Status');
  const [emptyFieldError, setEmptyFieldError] = React.useState(false);
  const [noResultsError, setNoResultsError] = React.useState(false);
  const [downloadReportFilename, setDownloadReportFilename] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(Number(params.get('currentPage')) || 0);
  const [sortBy, setSortBy] = React.useState((params.get('sortBy') as SortBy) || null);
  const [sortDir, setSortDir] = React.useState((params.get('sortDir') as SortDir) || null);
  const policySearchTypes = usePolicySearchTypes();
  const policyStatuses = usePolicyStatuses();
  const { status, data, error, isFetching, refetch } = useSearchPolicies(
    searchType,
    searchValue,
    currentPage as number,
    PAGE_SIZE,
    sortBy,
    sortDir,
  );

  const setSort = (colSortBy: SortBy, colSortDir: SortDir): void => {
    setSortBy(colSortBy);
    setSortDir(colSortDir);
    setCurrentPage(0);
  };

  const {
    status: historyStatus,
    data: historyData,
    error: historyError,
    isFetching: historyIsFetching,
    refetch: historyRefetch,
  } = useSearchPoliciesAndHistory(
    'listingAlias' as LogIdType,
    searchValue,
    currentPage as number,
    PAGE_SIZE,
    sortBy,
    sortDir,
  );

  React.useEffect(() => {
    setSearchType(searchType);
    setSearchValue(searchValue);
    setCurrentPage(currentPage);
    setSortBy(sortBy);
    setSortDir(sortDir);

    const queryObj: Array<Array<string>> | Record<string, string> = {
      searchType,
      searchValue,
      currentPage: currentPage.toString(),
    };
    const params = new URLSearchParams(queryObj);
    if (sortBy) {
      params.append('sortBy', sortBy);
    }
    if (sortDir) {
      params.append('sortDir', sortDir);
    }

    history.push({
      pathname: '/',
      search: `?${params.toString()}`,
    });
  }, [history, searchType, searchValue, currentPage, sortBy, sortDir]);

  // Run this query only once when page renders
  React.useEffect(() => {
    if (searchType === 'listingAlias') {
      historyRefetch();
      if (!historyData) {
        setNoResultsError(true);
      }
    } else {
      refetch();
      if (!data) {
        setNoResultsError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy, sortDir]);

  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setCurrentPage(0);
    setEmptyFieldError(false);
    setNoResultsError(false);
  };

  const handleOnClick = (event: MouseEvent, searchType: string) => {
    event.preventDefault();
    if (!searchValue) {
      setEmptyFieldError(true);
      return;
    }

    if (searchType === 'listingAlias') {
      historyRefetch();
      if (!historyData) {
        setNoResultsError(true);
      }
    } else {
      refetch();
      if (!data) {
        setNoResultsError(true);
      }
    }
  };

  const handleDownloadOnClick = () => {
    setDownloadReportFilename(`${searchType}-${searchValue}-${convertToLocalISOTime()}.csv`);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (event.code === 'Space') {
      event.currentTarget.click();
    }
  };

  const getSearchInput = (): JSX.Element => {
    if (searchType == 'policyStatus' && policyStatuses?.data?.policyStatuses) {
      return (
        <Select
          fontType="bodySmall"
          value={searchValue}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setEmptyFieldError(false);
            setCurrentPage(0);
            setSearchValue(event.target.value);
          }}
        >
          <option hidden disabled value={''}>
            {' '}
            -- select an option --{' '}
          </option>
          {policyStatuses?.data?.policyStatuses?.values.map(
            (
              type: {
                value: string;
                displayName: string;
              },
              id: React.Key | null | undefined,
            ) => {
              return (
                <option value={type?.value} key={id}>
                  {type?.displayName}
                </option>
              );
            },
          )}
        </Select>
      );
    }
    return (
      <Input
        fontType="bodySmall"
        placeholder={`Enter ${searchType}...`}
        value={searchValue}
        onChange={handleOnInputChange}
      />
    );
  };

  const calculateTotalPages = (pageSize: number, totalResults: number): number => {
    return Math.ceil(totalResults / pageSize);
  };

  const renderPoliciesAndHistory = (
    status: string,
    error: Error,
    data: PoliciesAndHistoryQuery | SearchPoliciesQuery,
    isFetching: boolean,
  ): JSX.Element => (
    <PageContent style={{ maxWidth: '100%' }}>
      {error instanceof Error ? (
        <span>There was an error loading results, please try again.</span>
      ) : (
        <LoadingMask loading={status === 'loading' || isFetching} style={{ display: 'block' }}>
          {data?.searchPolicies?.policies && data?.searchPolicies?.policies.length > 0 ? (
            <>
              <Paragraph margin="xs" style={{ textAlign: 'right' }}>
                <a
                  href={`data:application/json,${convertFromJSONToCSVForSearchPolicies(data.searchPolicies.policies)}`}
                  download={downloadReportFilename}
                  role="button"
                  aria-label="Download report as csv file"
                  tabIndex={0}
                  onClick={handleDownloadOnClick}
                  onKeyUp={onKeyUp}
                >
                  download
                </a>
              </Paragraph>
              <SearchPoliciesTable
                policies={data.searchPolicies.policies}
                searchType={displayName}
                searchValue={searchValue}
                setSort={setSort}
                sortBy={sortBy}
                sortDir={sortDir}
              />
              <Pagination
                marginTop="sm"
                currentPageIndex={currentPage}
                totalPages={calculateTotalPages(PAGE_SIZE, data.searchPolicies.totalResults)}
                onPageSelected={(pageIndex: number) => {
                  setCurrentPage(pageIndex);
                }}
              />
            </>
          ) : (
            noResultsError && <FormHelp error>No policies were found</FormHelp>
          )}
          <br />
          <br />
          {data && 'history' in data && data?.history?.logs && data?.history.logs.length > 0 && (
            <HistoryTable logs={data.history.logs} searchValue={searchValue} />
          )}
        </LoadingMask>
      )}
    </PageContent>
  );

  const renderPageContent = (): JSX.Element => (
    <>
      <PageTitle heading={<Heading level={3}>Rental Protection Admin</Heading>} />
      <PageContent>
        <Paragraph fontType="bodyHeading">Search for policies</Paragraph>
      </PageContent>
      <PageContent>
        <Form>
          <Grid display="grid" gridTemplateColumns={{ default: 'repeat(12, 1fr)', md_lte: 'repeat(6, 1fr)' }} gap="xs">
            <Grid gridColumnEnd="span 2">
              <FormField
                control={
                  <Select
                    fontType="bodySmall"
                    value={searchType}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      setSearchType(event.target.value);
                      setDisplayName(event.target.selectedOptions[0].text);
                      setSearchValue('');
                      setCurrentPage(0);
                      setEmptyFieldError(false);
                      setNoResultsError(false);
                    }}
                  >
                    {policySearchTypes ? (
                      policySearchTypes.data.policySearchTypes?.values.map(
                        (
                          type: {
                            value: string | number | ReadonlyArray<string> | undefined;
                            displayName:
                              | boolean
                              | React.ReactChild
                              | React.ReactFragment
                              | React.ReactPortal
                              | null
                              | undefined;
                          },
                          id: React.Key | null | undefined,
                        ) => {
                          return (
                            <option value={type?.value} key={id}>
                              {type?.displayName}
                            </option>
                          );
                        },
                      )
                    ) : (
                      <option value={searchType}>{displayName}</option>
                    )}
                  </Select>
                }
                marginRight="xs"
              />
            </Grid>
            <Grid gridColumnEnd="span 3">
              <FormField control={getSearchInput()} marginRight="xs" />
            </Grid>
            <Grid gridColumnEnd="span 1">
              <FormField
                control={
                  <Button
                    onClick={(event: MouseEvent) => handleOnClick(event, searchType)}
                    disabled={status === 'loading' || historyStatus === 'loading'}
                    fontType="bodySmall"
                    buttonType="primary"
                  >
                    Search
                  </Button>
                }
                error={emptyFieldError}
              />
            </Grid>
          </Grid>
          {emptyFieldError && <FormHelp error>Please enter a search value</FormHelp>}
        </Form>
      </PageContent>
      {searchType === 'listingAlias'
        ? renderPoliciesAndHistory(
            historyStatus,
            historyError as Error,
            historyData as PoliciesAndHistoryQuery,
            historyIsFetching,
          )
        : renderPoliciesAndHistory(status, error as Error, data as SearchPoliciesQuery, isFetching)}
      {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );

  return (
    <Page>
      <Header />
      <Tabs />
      {renderPageContent()}
    </Page>
  );
};

export default SearchPolicies;
