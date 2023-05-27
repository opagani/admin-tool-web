import * as React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserOktaAuth } from '@zg-rentals/auth-datarouter';
import { convertCentsToDollarCurrency, formatToUTC } from '../utils/utils';
import { api } from '../utils/api';
import Header from '../components/Header';
import Tabs from '../components/Tabs';
import { CancelPolicyModal } from '../components/PolicyDetails/CancelPolicyModal';
import PolicyDetailsHistoryTable from '../components/PolicyDetails/PolicyDetailsHistoryTable';
import { usePolicyRelatedActionsDetailsAndHistory } from '../components/PolicyDetails/usePolicyDetails';
import { convertObjectToDateFormat, formatPhoneNumber } from '../utils/utils';
import type { LocalDateType, MonthlyPremiumPayments, PremiumTransaction } from '../generated-types/graphql';

import {
  Flex,
  Grid,
  Heading,
  IconChevronLeftOutline,
  Page,
  PageContent,
  PageTitle,
  Paragraph,
  Text,
  TextButton,
  Trigger,
} from '@zillow/constellation';
import { ReinstateDroppedPolicyModal } from '../components/PolicyDetails/ReinstateDroppedPolicyModal';
import PremiumScheduleTable from '../components/PolicyDetails/PaymentScheduleTable';
import PremiumTransactionTable from '../components/PolicyDetails/PremiumTransactionTable';

const getPolicyColor = (policyStatus: string) => {
  switch (policyStatus) {
    case 'expired':
      return 'red';
    case 'active':
      return 'green';
    default:
      return 'black';
  }
};

const PolicyDetails = (): JSX.Element => {
  const { policyId } = useParams<{ policyId: string }>();
  const { status, data, error, isFetching, refetch } = usePolicyRelatedActionsDetailsAndHistory(policyId);
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const propertyDisplayNameMap = {
    listingAlias: 'Listing Alias',
    street: 'Street address',
    unit: 'Unit',
    city: 'City',
    state: 'State',
    zip: 'Zip',
  };

  const leaseDisplayNameMap = {
    id: 'Lease Id',
    monthlyRentUsd: 'Rent',
    startDate: 'Lease Start',
    endDate: 'Lease End',
    securityDeposit: 'Security Deposit',
  };

  const paymentsDisplayNameMap = {
    id: 'Payment Id',
    termType: 'Term Type',
    firstExpectedPaymentDate: 'First expected payment date',
    finalExpectedPaymentDate: 'Final expected payment date',
    firstSuccessfulPaymentDate: 'First successful payment date',
    mostRecentSuccessfulPaymentDate: 'Most recent successful payment date',
    rentTermsCancelledDate: 'Payment schedule cancel date',
    daysDelinquent: 'Days delinquent',
  };

  const applicationEligibilityDisplayNameMap = {
    applicationId: 'Application Id',
    applicationEligibilityStatus: 'Screening Result',
  };

  const policyStatusDisplayNameMap = {
    policyStatus: 'Status',
  };

  const leaseLockBinderDisplayNameMap = {
    id: 'Binder Id',
    issueDate: 'Issue Date',
    effectiveDate: 'Effective Date',
    expirationDate: 'Expiration Date',
    cancelDate: 'Cancel Date',
    binderStatus: 'Status',
  };

  const leaseLockCertificateDisplayNameMap = {
    id: 'Certificate Id',
    issueDate: 'Issue Date',
    effectiveDate: 'Effective Date',
    expirationDate: 'Expiration Date',
    cancelDate: 'Cancel Date',
    certificateStatus: 'Status',
  };

  const quoteDisplayNameMap = {
    quoteId: 'Quote Id',
    premium: 'Premium',
    coverage: 'Coverage',
    firstMonthStampingFee: 'First Month Stamping Fee',
    firstMonthSurplusLines: 'First Month Surplus Fee',
    firstMonthTotal: 'First Month Total',
    recurringMonthSurplusLines: 'Recurring Month Surplus Lines',
    recurringMonthTotal: 'Recurring Month Total',
  };

  const orderedKeys = [
    'property',
    'renters',
    'applicationEligibility',
    'lease',
    'payments',
    'policyStatus',
    'landlords',
    'leaseLockBinder',
    'leaseLockCertificate',
    'quote',
    'premiumTransactions',
    'monthlyPremiumPayments',
  ];

  const onGoBack = () => {
    const state = location.state as Record<string, boolean> | undefined;
    // go back to the search page
    if (state?.fromDashboard) {
      history.goBack();
    } else {
      window.location.href = '/rent-guarantee/adminApp';
    }
  };

  const shouldFormatDate = (keyName: string): boolean => {
    return [
      'firstExpectedPaymentDate',
      'finalExpectedPaymentDate',
      'firstSuccessfulPaymentDate',
      'mostRecentSuccessfulPaymentDate',
      'rentTermsCancelledDate',
      'issueDate',
      'effectiveDate',
      'expirationDate',
      'cancelDate',
    ].includes(keyName);
  };
  const buildGridLayout = (
    propertyObj: Record<string, unknown>,
    key: string,
    value: string | number | Date | null | Record<string, unknown>,
    index: string | number,
    color: 'red' | 'green' | 'black' = 'black',
  ) => (
    <Grid key={index} display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="xs" marginY="sm">
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 3' }}>
        <Text fontType="bodySmallHeading">{propertyObj[key]}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 9' }}>
        <Text fontType="bodySmall" style={{ color }}>
          {value}
        </Text>
      </Grid>
    </Grid>
  );

  const buildPaymentsGridLayout = (
    propertyObj: Record<string, unknown>,
    key: string,
    value: string | number | null | Record<string, unknown>,
    index: string | number,
  ) => (
    <Grid key={index} display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="xs" marginY="sm">
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 3' }}>
        <Text fontType="bodySmallHeading">{propertyObj[key]}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 9' }}>
        <Text fontType="bodySmall">{value}</Text>
      </Grid>
    </Grid>
  );

  const buildRenterOrOwnerGridLayout = (key: string, obj: Record<string, unknown>, index: number) => (
    <Grid key={index} display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="xs" marginY="sm">
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 3' }}>
        <Text fontType="bodySmallHeading">{index === 0 ? (key === 'renters' ? 'Renter(s)' : 'Owner(s)') : null}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 4', md: 'span 3' }}>
        <Text fontType="bodySmall">{obj.firstName}</Text> <Text fontType="bodySmall">{obj.lastName}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 4', md: 'span 3' }}>
        <Text fontType="bodySmall">{obj.email}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 4', md: 'span 3' }}>
        <Text fontType="bodySmall">{formatPhoneNumber(obj.phone as string)}</Text>
      </Grid>
    </Grid>
  );

  const buildLeaseLockBinderOrCertificateGridLayout = (
    propertyObj: Record<string, unknown>,
    key: string,
    value: string | number | null | Record<string, unknown>,
    index: number,
  ) => (
    <Grid key={index} display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="xs" marginY="sm">
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 3' }}>
        <Text fontType="bodySmallHeading">
          {index === 0 ? (key === 'id' && propertyObj[key] === 'Binder Id' ? 'Binder' : 'Certificate') : null}
        </Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 3' }}>
        <Text fontType="bodySmallHeading">{propertyObj[key]}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 6' }}>
        {shouldFormatDate(key) && value ? (
          <Text fontType="bodySmall">{convertObjectToDateFormat(value as LocalDateType)}</Text>
        ) : (
          <Text fontType="bodySmall">{value}</Text>
        )}
      </Grid>
    </Grid>
  );

  const buildQuoteGridLayout = (
    propertyObj: Record<string, unknown>,
    key: string,
    value: string | number | null | Record<string, unknown>,
    index: number,
  ) => (
    <Grid key={index} display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="xs" marginY="sm">
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 3' }}>
        <Text fontType="bodySmallHeading">{index === 0 ? 'Quote' : null}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 3' }}>
        <Text fontType="bodySmallHeading">{propertyObj[key]}</Text>
      </Grid>
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 6' }}>
        <Text fontType="bodySmall">{key !== 'quoteId' && value ? convertCentsToDollarCurrency(value) : value} </Text>
      </Grid>
    </Grid>
  );

  const buildMonthlyPremiumPaymentsGridLayout = (premiumPayments: Array<MonthlyPremiumPayments>, index: number) => (
    <Grid
      key={index}
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gap="xs"
      marginY="sm"
      paddingTop={index !== 0 ? 'sm' : null}
    >
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 12' }} paddingTop="xs">
        <PremiumScheduleTable monthlyPremiumPayments={premiumPayments} />
      </Grid>
    </Grid>
  );

  const buildMonthlyPremiumTransactionsGridLayout = (premiumTransactions: Array<PremiumTransaction>, index: number) => (
    <Grid
      key={index}
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gap="xs"
      marginY="sm"
      paddingTop={index !== 0 ? 'sm' : null}
    >
      <Grid gridColumnEnd={{ default: 'span 12', md: 'span 12' }} paddingTop="xs">
        <PremiumTransactionTable premiumTransactions={premiumTransactions} />
      </Grid>
    </Grid>
  );

  const RenderPageContent = (): JSX.Element => {
    return (
      <>
        <PageTitle heading={<Heading level={3}>Rental Protection Admin</Heading>} />
        <PageContent>
          <Paragraph fontType="bodyHeading" marginY="xs">
            Policy Information
          </Paragraph>
          <TextButton fontType="body" marginY="xs" icon={<IconChevronLeftOutline />} onClick={onGoBack}>
            Back
          </TextButton>
          <Flex display="flex" flexDirection="column">
            <Flex display="flex" justifyContent="space-between" marginBottom="xs">
              <Paragraph fontType="bodyHeading" marginY="xs">
                Policy #{policyId}
              </Paragraph>
              {data?.expandedPolicyDetails?.isCancellable && (
                <BrowserOktaAuth
                  authUrl={api.auth.check}
                  signInUrl={api.auth.redirect(window.location.href)}
                  oneOfRequiredRoles={['admin', 'customerCareAdmin']}
                  notAuthorized=" "
                >
                  <Trigger
                    triggered={(props: JSX.IntrinsicAttributes & { close: () => void }, close: () => void) => (
                      <CancelPolicyModal {...props} close={close} />
                    )}
                  >
                    <TextButton marginY="xs">Cancel Policy</TextButton>
                  </Trigger>
                </BrowserOktaAuth>
              )}
              {data?.expandedPolicyDetails?.isEligibleToReinstate && (
                <BrowserOktaAuth
                  authUrl={api.auth.check}
                  signInUrl={api.auth.redirect(window.location.href)}
                  oneOfRequiredRoles={['admin', 'customerCareAdmin']}
                  notAuthorized=" "
                >
                  <Trigger
                    triggered={(props: JSX.IntrinsicAttributes & { close: () => void }, close: () => void) => (
                      <ReinstateDroppedPolicyModal {...props} close={close} />
                    )}
                  >
                    <TextButton marginY="xs">Reinstate Policy</TextButton>
                  </Trigger>
                </BrowserOktaAuth>
              )}
            </Flex>
          </Flex>

          <div>
            {status === 'loading' ? (
              'Loading...'
            ) : error instanceof Error ? (
              <span>Error: {error.message}</span>
            ) : (
              <>
                {data?.expandedPolicyDetails &&
                  orderedKeys.map((key, index) => (
                    <div key={index}>
                      {key === 'property' &&
                        data?.expandedPolicyDetails?.property &&
                        Object.entries(data?.expandedPolicyDetails?.property).map(([key, value], index) =>
                          buildGridLayout(propertyDisplayNameMap, key, value, index),
                        )}
                      {key === 'renters' &&
                        data?.expandedPolicyDetails?.renters &&
                        data?.expandedPolicyDetails?.renters.length > 0 &&
                        data.expandedPolicyDetails.renters.map((obj, index) =>
                          buildRenterOrOwnerGridLayout(key, obj, index),
                        )}
                      {key === 'applicationEligibility' &&
                        data?.expandedPolicyDetails?.applicationEligibility &&
                        Object.entries(data?.expandedPolicyDetails?.applicationEligibility).map(
                          ([key, value], index) => {
                            if (key === 'applicationEligibilityStatus') {
                              value === 'ELIGIBLE' ? (value = 'approved') : (value = 'unapproved');
                            }

                            return buildGridLayout(applicationEligibilityDisplayNameMap, key, value, index);
                          },
                        )}
                      {key === 'lease' &&
                        data?.expandedPolicyDetails?.lease &&
                        Object.entries(data?.expandedPolicyDetails?.lease).map(([key, value], index) => {
                          if (shouldFormatDate(key) && value) {
                            return buildGridLayout(
                              leaseDisplayNameMap,
                              key,
                              new Date(value as number).toLocaleString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              }),
                              index,
                            );
                          } else if (['monthlyRentUsd', 'securityDeposit'].includes(key)) {
                            return buildGridLayout(
                              leaseDisplayNameMap,
                              key,
                              convertCentsToDollarCurrency(value as number),
                              index,
                            );
                          } else if (['startDate', 'endDate'].includes(key)) {
                            return buildGridLayout(leaseDisplayNameMap, key, formatToUTC(value as Date), index);
                          } else {
                            return buildGridLayout(leaseDisplayNameMap, key, value, index);
                          }
                        })}
                      {key === 'payments' &&
                        data?.expandedPolicyDetails?.payments &&
                        Object.entries(data?.expandedPolicyDetails?.payments).map(([key, value], index) => {
                          if (shouldFormatDate(key) && value) {
                            return buildPaymentsGridLayout(
                              paymentsDisplayNameMap,
                              key,
                              convertObjectToDateFormat(value as LocalDateType),
                              index,
                            );
                          } else {
                            return buildPaymentsGridLayout(paymentsDisplayNameMap, key, value, index);
                          }
                        })}
                      {key === 'policyStatus' &&
                        data?.expandedPolicyDetails?.policyStatus &&
                        buildGridLayout(
                          policyStatusDisplayNameMap,
                          key,
                          data.expandedPolicyDetails.policyStatus.toLowerCase(),
                          key,
                          getPolicyColor(data.expandedPolicyDetails.policyStatus.toLowerCase()),
                        )}
                      {key === 'landlords' &&
                        data?.expandedPolicyDetails?.landlords &&
                        data?.expandedPolicyDetails?.landlords.length > 0 &&
                        data.expandedPolicyDetails.landlords.map((obj, index) =>
                          buildRenterOrOwnerGridLayout(key, obj, index),
                        )}
                      {key === 'leaseLockBinder' &&
                        data?.expandedPolicyDetails?.leaseLockBinder &&
                        Object.entries(data?.expandedPolicyDetails?.leaseLockBinder).map(([key, value], index) => {
                          return buildLeaseLockBinderOrCertificateGridLayout(
                            leaseLockBinderDisplayNameMap,
                            key,
                            value,
                            index,
                          );
                        })}
                      {key === 'leaseLockCertificate' &&
                        data?.expandedPolicyDetails?.leaseLockCertificate &&
                        Object.entries(data?.expandedPolicyDetails?.leaseLockCertificate).map(([key, value], index) => {
                          return buildLeaseLockBinderOrCertificateGridLayout(
                            leaseLockCertificateDisplayNameMap,
                            key,
                            value,
                            index,
                          );
                        })}
                      {key === 'quote' &&
                        data?.expandedPolicyDetails?.quote &&
                        Object.entries(data?.expandedPolicyDetails?.quote).map(([key, value], index) => {
                          return buildQuoteGridLayout(quoteDisplayNameMap, key, value, index);
                        })}
                      {key === 'premiumTransactions' &&
                        data?.expandedPolicyDetails?.premiumTransactions &&
                        data?.expandedPolicyDetails?.premiumTransactions.length > 0 &&
                        buildMonthlyPremiumTransactionsGridLayout(
                          data?.expandedPolicyDetails?.premiumTransactions as Array<PremiumTransaction>,
                          index,
                        )}
                      {key === 'monthlyPremiumPayments' &&
                        data?.expandedPolicyDetails?.monthlyPremiumPayments &&
                        data?.expandedPolicyDetails?.monthlyPremiumPayments.length > 0 &&
                        buildMonthlyPremiumPaymentsGridLayout(
                          data?.expandedPolicyDetails?.monthlyPremiumPayments as Array<MonthlyPremiumPayments>,
                          index,
                        )}
                    </div>
                  ))}
                <br />
                <br />
                {data?.historyForPolicyRelatedActions?.logs &&
                  data?.historyForPolicyRelatedActions?.logs.length > 0 && (
                    <PolicyDetailsHistoryTable logs={data.historyForPolicyRelatedActions.logs} />
                  )}
                <div>{isFetching ? 'Background Updating...' : ' '}</div>
              </>
            )}
          </div>
          {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
        </PageContent>
      </>
    );
  };

  return (
    <Page>
      <Header />
      <Tabs />
      {RenderPageContent()}
    </Page>
  );
};

export default PolicyDetails;
