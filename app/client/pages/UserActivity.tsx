import * as React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import { useReports, useUserActivityDataForReports } from '../components/Reports/useReports';
import {
  convertFromJSONToCSVForUserActivity,
  convertToLocalISOTime,
  countNumberOfOccurrencesOfDistinctValuesFromAnArrayOfObjects,
} from '../utils/utils';
import type { UserActivities } from '../generated-types/graphql';

import {
  Button,
  Form,
  FormField,
  FormHelp,
  Grid,
  Heading,
  Page,
  PageContent,
  PageTitle,
  Paragraph,
  Select,
  Trigger,
} from '@zillow/constellation';
import UserActivityDataTable from '../components/Reports/UserActivity/UserActivityDataTable';

const UserActivity = (): JSX.Element => {
  const [methodToInvoke, setMethodToInvoke] = React.useState('getUserActivityOptIns');
  const [reportName, setReportName] = React.useState('User activity for opt-ins and opt-outs');
  const [reportDescription, setReportDescription] = React.useState('');
  const [noResultsError, setNoResultsError] = React.useState(false);
  const [downloadReportFilename, setDownloadReportFilename] = React.useState('');
  const [urlParams, setUrlParams] = React.useState([{ name: 'limit', value: '200' }]);
  const reports = useReports('userActivity');
  const { status, data, error, isFetching, refetch } = useUserActivityDataForReports(methodToInvoke, urlParams);

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const targetValue = event.target.selectedOptions[0].dataset.tag?.split('::');
    setMethodToInvoke(targetValue?.[0] as string);
    setReportName(event.target.selectedOptions[0].text);
    setReportDescription(targetValue?.[1] as string);
    setNoResultsError(false);

    // Find paramName and paramDefaultValue
    const result = reports?.data?.reports?.reportsDetails.find(
      ({ methodToInvoke }) => methodToInvoke === targetValue?.[0],
    );

    if (result?.methodParamsDetails?.length) {
      result?.methodParamsDetails?.forEach((methodParamDetail) => {
        if (methodParamDetail?.paramName && methodParamDetail?.paramDefaultValue) {
          const urlParams = [
            { name: methodParamDetail.paramName, value: methodParamDetail?.paramDefaultValue.toString() },
          ];
          setUrlParams(urlParams);
        }
      });
    } else {
      setUrlParams([]);
    }
  };

  const handleOnClick = (event: MouseEvent) => {
    event.preventDefault();
    refetch();
    if (!data) {
      setNoResultsError(true);
    }
  };

  const handleDownloadOnClick = () => {
    setDownloadReportFilename(`${methodToInvoke}-${convertToLocalISOTime()}.csv`);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (event.code === 'Space') {
      event.currentTarget.click();
    }
  };

  const renderPageContent = (): JSX.Element => (
    <>
      <PageTitle heading={<Heading level={3}>Rental Protection Admin</Heading>} />
      <PageContent>
        <Paragraph fontType="bodyHeading">User Activity</Paragraph>
      </PageContent>
      <PageContent>
        <Form>
          <Grid display="grid" gridTemplateColumns={{ default: 'repeat(12, 1fr)', md_lte: 'repeat(6, 1fr)' }} gap="xs">
            <Grid gridColumnEnd="span 5.25">
              <FormField
                control={
                  <Trigger
                    openWith={['mouseEnter']}
                    closeWith={['mouseLeave']}
                    triggered={(props: { isOpen: unknown }) =>
                      props.isOpen ? (
                        <Paragraph fontType="finePrint" marginTop="sm">
                          {reportDescription}
                        </Paragraph>
                      ) : null
                    }
                  >
                    <Select fluid={false} fontType="bodySmall" value={methodToInvoke} onChange={handleOnChange}>
                      {reports?.data?.reports ? (
                        reports.data.reports?.reportsDetails.map((type, id) => {
                          return (
                            <option
                              value={type?.methodToInvoke}
                              data-tag={`${type?.methodToInvoke}::${type?.reportDescription}`}
                              key={id}
                            >
                              {type?.reportName}
                            </option>
                          );
                        })
                      ) : (
                        <option value={methodToInvoke}>{reportName}</option>
                      )}
                    </Select>
                  </Trigger>
                }
                marginRight="xs"
              />
            </Grid>
            <Grid gridColumnEnd="span 0.75">
              <FormField
                control={
                  <Button
                    onClick={(event: MouseEvent) => handleOnClick(event)}
                    disabled={status === 'loading'}
                    fontType="bodySmall"
                    buttonType="primary"
                  >
                    Generate
                  </Button>
                }
              />
            </Grid>
          </Grid>
        </Form>
        <div>
          {status === 'loading' ? (
            'Loading...'
          ) : error instanceof Error ? (
            <span>Error: {error.message}</span>
          ) : (
            <>
              {data?.userActivityDataForReports?.userActivities &&
              data?.userActivityDataForReports?.userActivities.length > 0 ? (
                <>
                  {methodToInvoke === 'getUserActivityOptIns' && (
                    <>
                      <Paragraph fontType="bodySmall" marginTop="sm">
                        Opt-in:{' '}
                        {countNumberOfOccurrencesOfDistinctValuesFromAnArrayOfObjects(
                          data.userActivityDataForReports.userActivities as Array<UserActivities>,
                          'action',
                          'optIn',
                        )}
                      </Paragraph>
                      <Paragraph fontType="bodySmall">
                        Opt-out:{' '}
                        {countNumberOfOccurrencesOfDistinctValuesFromAnArrayOfObjects(
                          data.userActivityDataForReports.userActivities as Array<UserActivities>,
                          'action',
                          'optOut',
                        )}
                      </Paragraph>
                    </>
                  )}

                  <Paragraph margin="xs" style={{ textAlign: 'right' }}>
                    <a
                      href={`data:attachment/csv, ${encodeURI(
                        convertFromJSONToCSVForUserActivity(
                          data.userActivityDataForReports.userActivities as Array<UserActivities>,
                          methodToInvoke,
                        ),
                      )}`}
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
                  <UserActivityDataTable
                    userActivities={data.userActivityDataForReports.userActivities as Array<UserActivities>}
                    methodToInvoke={methodToInvoke}
                  />
                </>
              ) : (
                noResultsError && <FormHelp error>No reports were found</FormHelp>
              )}
              <div>{isFetching ? 'Background Updating...' : ' '}</div>
            </>
          )}
        </div>
        {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
      </PageContent>
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

export default UserActivity;
