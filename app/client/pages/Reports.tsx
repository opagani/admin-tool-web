import * as React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import LandlordsDataTable from '../components/Reports/LandlordsDataTable';
import { useLandlordsDataForReports, useReports } from '../components/Reports/useReports';
import { convertFromJSONToCSVForLandlordReports, convertToLocalISOTime } from '../utils/utils';

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

const Reports = (): JSX.Element => {
  const [methodToInvoke, setMethodToInvoke] = React.useState('getLandlordsOptedOutWithinTwoDaysAfterOptIn');
  const [reportName, setReportName] = React.useState('Landlords who opt out within 2 days after opt in');
  const [reportDescription, setReportDescription] = React.useState('');
  const [noResultsError, setNoResultsError] = React.useState(false);
  const [downloadReportFilename, setDownloadReportFilename] = React.useState('');
  const [urlParams, setUrlParams] = React.useState('actionLookBackDays=14');
  const reports = useReports();
  const { status, data, error, isFetching, refetch } = useLandlordsDataForReports(methodToInvoke, urlParams);

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

    const params = new URLSearchParams();

    if (result?.methodParamsDetails?.length) {
      result?.methodParamsDetails?.forEach((methodParamDetail) => {
        if (methodParamDetail?.paramName && methodParamDetail?.paramDefaultValue) {
          params.append(methodParamDetail.paramName, methodParamDetail?.paramDefaultValue.toString());
        }
      });
      setUrlParams(params.toString());
    } else {
      setUrlParams('');
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
        <Paragraph fontType="bodyHeading">Run dynamic reports</Paragraph>
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
              {data?.landlordsDataForReports?.rentGuaranteeLandlords &&
              data?.landlordsDataForReports?.rentGuaranteeLandlords.length > 0 ? (
                <>
                  <Paragraph margin="xs" style={{ textAlign: 'right' }}>
                    <a
                      href={`data:application/json,${convertFromJSONToCSVForLandlordReports(
                        data.landlordsDataForReports.rentGuaranteeLandlords,
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
                  <LandlordsDataTable rentGuaranteeLandlords={data.landlordsDataForReports.rentGuaranteeLandlords} />
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

export default Reports;
