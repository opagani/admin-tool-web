import * as React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import LandlordHistoryTable from '../components/LandlordHistory/LandlordHistoryTable';
import { useLandlordHistory } from '../components/LandlordHistory/useLandlordHistory';

import {
  Heading,
  IconChevronLeftOutline,
  Page,
  PageContent,
  PageTitle,
  Paragraph,
  TextButton,
} from '@zillow/constellation';
import type { LogIdType } from '../generated-types/graphql';

const LandlordHistory = (): JSX.Element => {
  const userToken = useParams<{ userToken: string }>().userToken;
  const { status, data, error, isFetching } = useLandlordHistory('userToken' as LogIdType, userToken);
  const history = useHistory();
  const location = useLocation();

  const onGoBack = () => {
    const state = location.state as Record<string, boolean> | undefined;
    // go back to the search page
    if (state?.fromDashboard) {
      history.goBack();
    } else {
      window.location.href = '/rent-guarantee/adminApp';
    }
  };

  const renderPageContent = (): JSX.Element => (
    <>
      <PageTitle heading={<Heading level={3}>Rental Protection Admin</Heading>} />
      <PageContent>
        <Paragraph fontType="bodyHeading" marginY="xs">
          User History
        </Paragraph>
        <TextButton fontType="body" marginY="xs" icon={<IconChevronLeftOutline />} onClick={onGoBack}>
          Back
        </TextButton>
        <Paragraph fontType="bodyHeading" marginY="xs">
          Irene Landlord ({userToken}) History
        </Paragraph>
      </PageContent>
      <PageContent>
        <div>
          {status === 'loading' ? (
            'Loading...'
          ) : error instanceof Error ? (
            <span>Error: {error.message}</span>
          ) : (
            <>
              {data?.history?.logs && data?.history.logs.length > 0 && (
                <LandlordHistoryTable logs={data.history.logs} />
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

export default LandlordHistory;
