import type { GraphQLClient } from 'graphql-request';
import type { UseMutationOptions, UseQueryOptions } from 'react-query';
import { useMutation, useQuery } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
};

export type Activities = {
  __typename?: 'Activities';
  userActivities?: Maybe<Array<UserActivities>>;
};

export type Application = {
  __typename?: 'Application';
  id: Scalars['String'];
};

export type ApplicationActivity = {
  __typename?: 'ApplicationActivity';
  applicationId: Scalars['String'];
  incomeToRentEligible: Scalars['Boolean'];
  incomeUpdatedDate: Scalars['Float'];
  listingAlias: Scalars['String'];
  createdDate: Scalars['Float'];
  userToken: Scalars['String'];
};

export type ApplicationEligibility = {
  __typename?: 'ApplicationEligibility';
  applicationId?: Maybe<Scalars['String']>;
  applicationEligibilityStatus?: Maybe<Scalars['String']>;
};

export type CancelPolicyResponse = {
  __typename?: 'CancelPolicyResponse';
  success: Scalars['Boolean'];
  httpStatus: Scalars['Int'];
  error?: Maybe<ErrorResponse>;
};

export type ErrorResponse = {
  __typename?: 'ErrorResponse';
  message?: Maybe<Scalars['String']>;
};

export type History = {
  __typename?: 'History';
  logs: Array<Maybe<HistoryType>>;
};

export type HistoryForPolicyRelatedActions = {
  __typename?: 'HistoryForPolicyRelatedActions';
  logs: Array<Maybe<HistoryForPolicyRelatedActionsType>>;
};

export type HistoryForPolicyRelatedActionsType = {
  __typename?: 'HistoryForPolicyRelatedActionsType';
  policyId: Scalars['String'];
  action: Scalars['String'];
  createdDate: Scalars['Float'];
  message: Scalars['String'];
  source: Scalars['String'];
  sourceId: Scalars['String'];
};

export type HistoryType = {
  __typename?: 'HistoryType';
  idType: Scalars['String'];
  idValue: Scalars['String'];
  action: Scalars['String'];
  createdDate: Scalars['Float'];
  userToken: Scalars['String'];
  message?: Maybe<Scalars['String']>;
};

export type Landlord = {
  __typename?: 'Landlord';
  id?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
};

export type Landlords = {
  __typename?: 'Landlords';
  rentGuaranteeLandlords: Array<RentGuaranteeLandLordObject>;
};

export type Lease = {
  __typename?: 'Lease';
  id?: Maybe<Scalars['Int']>;
  monthlyRentUsd?: Maybe<Scalars['Int']>;
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
  securityDeposit?: Maybe<Scalars['Int']>;
};

export type LeaseLockBinder = {
  __typename?: 'LeaseLockBinder';
  id: Scalars['String'];
  issueDate: LocalDateType;
  effectiveDate?: Maybe<LocalDateType>;
  expirationDate?: Maybe<LocalDateType>;
  cancelDate?: Maybe<LocalDateType>;
  binderStatus: Scalars['String'];
};

export type LeaseLockCertificate = {
  __typename?: 'LeaseLockCertificate';
  id: Scalars['String'];
  issueDate: LocalDateType;
  effectiveDate?: Maybe<LocalDateType>;
  expirationDate?: Maybe<LocalDateType>;
  cancelDate?: Maybe<LocalDateType>;
  certificateStatus: Scalars['String'];
};

export type ListingActivity = UserActionActivity & {
  __typename?: 'ListingActivity';
  idType: Scalars['String'];
  idValue: Scalars['String'];
  action: Scalars['String'];
  createdDate: Scalars['Float'];
  userToken: Scalars['String'];
  message?: Maybe<Scalars['String']>;
};

export type LocalDateTimeType = {
  __typename?: 'LocalDateTimeType';
  date?: Maybe<LocalDateType>;
  time?: Maybe<TimeType>;
};

export type LocalDateType = {
  __typename?: 'LocalDateType';
  year?: Maybe<Scalars['Int']>;
  month?: Maybe<Scalars['Int']>;
  day?: Maybe<Scalars['Int']>;
};

export enum LogIdType {
  ListingAlias = 'listingAlias',
  UserToken = 'userToken',
}

export type MethodParamsDetails = {
  __typename?: 'MethodParamsDetails';
  paramName: Scalars['String'];
  paramDataType: Scalars['String'];
  paramDefaultValue: Scalars['Int'];
};

export type MonthlyPremiumPayments = {
  __typename?: 'MonthlyPremiumPayments';
  sequenceNumber: Scalars['Int'];
  invoiceDate: Scalars['String'];
  totalDueAmount: Scalars['Float'];
  premiumAmount: Scalars['Float'];
  stampingFeeAmount?: Maybe<Scalars['Float']>;
  surplusLinesTaxAmount?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelPolicy?: Maybe<CancelPolicyResponse>;
  reinstateDroppedPolicy?: Maybe<ReinstateDroppedPolicyResponse>;
};

export type MutationCancelPolicyArgs = {
  policyId: Scalars['String'];
  caseNumber: Scalars['String'];
  note: Scalars['String'];
};

export type MutationReinstateDroppedPolicyArgs = {
  policyId: Scalars['String'];
  caseNumber: Scalars['String'];
  note: Scalars['String'];
};

export enum PaymentChargeStatus {
  Failed = 'FAILED',
  Other = 'OTHER',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Disputed = 'DISPUTED',
  Succeeded = 'SUCCEEDED',
  Unknown = 'UNKNOWN',
}

export enum PaymentPayoutStatus {
  Paid = 'PAID',
  Pending = 'PENDING',
  InTransit = 'IN_TRANSIT',
  Canceled = 'CANCELED',
  Failed = 'FAILED',
  Unknown = 'UNKNOWN',
}

export type Payments = {
  __typename?: 'Payments';
  id?: Maybe<Scalars['Int']>;
  termType?: Maybe<Scalars['String']>;
  firstExpectedPaymentDate?: Maybe<LocalDateType>;
  finalExpectedPaymentDate?: Maybe<LocalDateType>;
  firstSuccessfulPaymentDate?: Maybe<LocalDateType>;
  mostRecentSuccessfulPaymentDate?: Maybe<LocalDateType>;
  rentTermsCancelledDate?: Maybe<LocalDateType>;
  daysDelinquent?: Maybe<Scalars['Int']>;
};

export type Policies = {
  __typename?: 'Policies';
  policies: Array<Maybe<Policy>>;
  totalResults: Scalars['Int'];
};

export type Policy = {
  __typename?: 'Policy';
  createdDate: Scalars['Float'];
  updatedDate: Scalars['Float'];
  listingAlias: Scalars['String'];
  isActive: Scalars['Boolean'];
  policyStatus: Scalars['String'];
  applicationId: Application;
  leaseId: Lease;
  paymentId?: Maybe<Payments>;
  policyId: Scalars['String'];
  leaseTermStartDate?: Maybe<Scalars['Date']>;
  leaseTermEndDate?: Maybe<Scalars['Date']>;
  policyTermStartDate?: Maybe<Scalars['Date']>;
  policyTermEndDate?: Maybe<Scalars['Date']>;
  landlordUserToken?: Maybe<Scalars['String']>;
  renterIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type PolicyDetails = {
  __typename?: 'PolicyDetails';
  policyId: Scalars['String'];
  property?: Maybe<Property>;
  lease?: Maybe<Lease>;
  payments?: Maybe<Payments>;
  landlords: Array<Landlord>;
  applicationEligibility: ApplicationEligibility;
  renters: Array<Renter>;
  leaseLockBinder?: Maybe<LeaseLockBinder>;
  leaseLockCertificate?: Maybe<LeaseLockCertificate>;
  quote?: Maybe<Quote>;
  premiumTransactions?: Maybe<Array<Maybe<PremiumTransaction>>>;
  policyStatus?: Maybe<Scalars['String']>;
  isCancellable: Scalars['Boolean'];
  isEligibleToReinstate: Scalars['Boolean'];
  monthlyPremiumPayments?: Maybe<Array<Maybe<MonthlyPremiumPayments>>>;
};

export type PolicySearchType = {
  __typename?: 'PolicySearchType';
  value: Scalars['String'];
  displayName: Scalars['String'];
};

export type PolicySearchTypes = {
  __typename?: 'PolicySearchTypes';
  values: Array<PolicySearchType>;
};

export type PolicyStatus = {
  __typename?: 'PolicyStatus';
  value: Scalars['String'];
  displayName: Scalars['String'];
};

export type PolicyStatuses = {
  __typename?: 'PolicyStatuses';
  values: Array<PolicyStatus>;
};

export enum PremiumPaidBy {
  Passthrough = 'PASSTHROUGH',
  Direct = 'DIRECT',
}

export type PremiumTransaction = {
  __typename?: 'PremiumTransaction';
  transactionId?: Maybe<Scalars['String']>;
  transactionType?: Maybe<PremiumPaidBy>;
  premiumAmountInCents?: Maybe<Scalars['Float']>;
  transactionCreatedDate?: Maybe<LocalDateType>;
  transactionUpdatedDate?: Maybe<LocalDateType>;
  chargeId?: Maybe<Scalars['String']>;
  chargeStatus?: Maybe<PaymentChargeStatus>;
  chargeDate?: Maybe<LocalDateTimeType>;
  payoutStatus?: Maybe<PaymentPayoutStatus>;
  formattedChargeDate?: Maybe<Scalars['String']>;
  formattedTransactionCreatedDate?: Maybe<Scalars['String']>;
  formattedTransactionUpdatedDate?: Maybe<Scalars['String']>;
};

export type PremiumTransactionFormattedChargeDateArgs = {
  delimiter?: Maybe<Scalars['String']>;
  includeTime?: Maybe<Scalars['Boolean']>;
};

export type PremiumTransactionFormattedTransactionCreatedDateArgs = {
  delimiter?: Maybe<Scalars['String']>;
};

export type PremiumTransactionFormattedTransactionUpdatedDateArgs = {
  delimiter?: Maybe<Scalars['String']>;
};

export type Property = {
  __typename?: 'Property';
  listingAlias: Scalars['String'];
  street: Scalars['String'];
  unit?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  state: Scalars['String'];
  zip: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  searchPolicies?: Maybe<Policies>;
  history?: Maybe<History>;
  policySearchTypes?: Maybe<PolicySearchTypes>;
  policyStatuses?: Maybe<PolicyStatuses>;
  expandedPolicyDetails?: Maybe<PolicyDetails>;
  historyForPolicyRelatedActions?: Maybe<HistoryForPolicyRelatedActions>;
  reports?: Maybe<Reports>;
  landlordsDataForReports?: Maybe<Landlords>;
  userActivityDataForReports?: Maybe<Activities>;
};

export type QuerySearchPoliciesArgs = {
  searchType: Scalars['String'];
  searchValue: Scalars['String'];
  pageSize: Scalars['Int'];
  fromIndex: Scalars['Int'];
  sortBy?: Maybe<SortBy>;
  sortDir?: Maybe<SortDir>;
};

export type QueryHistoryArgs = {
  logIdType: LogIdType;
  logIdValue: Scalars['String'];
};

export type QueryExpandedPolicyDetailsArgs = {
  policyId: Scalars['String'];
};

export type QueryHistoryForPolicyRelatedActionsArgs = {
  policyId: Scalars['String'];
};

export type QueryReportsArgs = {
  reportType?: Maybe<Scalars['String']>;
};

export type QueryLandlordsDataForReportsArgs = {
  methodToInvoke: Scalars['String'];
  urlParams?: Maybe<Scalars['String']>;
};

export type QueryUserActivityDataForReportsArgs = {
  methodToInvoke: Scalars['String'];
  urlParams?: Maybe<Array<UrlParams>>;
};

export type Quote = {
  __typename?: 'Quote';
  quoteId: Scalars['Float'];
  premium?: Maybe<Scalars['Float']>;
  coverage?: Maybe<Scalars['Float']>;
  firstMonthStampingFee?: Maybe<Scalars['Float']>;
  firstMonthSurplusLines?: Maybe<Scalars['Float']>;
  firstMonthTotal?: Maybe<Scalars['Float']>;
  recurringMonthSurplusLines?: Maybe<Scalars['Float']>;
  recurringMonthTotal?: Maybe<Scalars['Float']>;
};

export type ReinstateDroppedPolicyResponse = {
  __typename?: 'ReinstateDroppedPolicyResponse';
  success: Scalars['Boolean'];
  httpStatus: Scalars['Int'];
  error?: Maybe<ErrorResponse>;
};

export type RentGuaranteeLandLord = {
  __typename?: 'RentGuaranteeLandLord';
  landlordUserToken: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  emails?: Maybe<Array<Maybe<Scalars['String']>>>;
  phones?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type RentGuaranteeLandLordObject = {
  __typename?: 'RentGuaranteeLandLordObject';
  landlord?: Maybe<RentGuaranteeLandLord>;
};

export type Renter = {
  __typename?: 'Renter';
  renterId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  creditCheckEligibleFlag?: Maybe<Scalars['Boolean']>;
  incomeToRentEligibleFlag?: Maybe<Scalars['Boolean']>;
};

export type Report = {
  __typename?: 'Report';
  reportName: Scalars['String'];
  reportDescription: Scalars['String'];
  methodToInvoke: Scalars['String'];
  methodParamsDetails?: Maybe<Array<Maybe<MethodParamsDetails>>>;
};

export type Reports = {
  __typename?: 'Reports';
  reportsDetails: Array<Report>;
};

export enum SortBy {
  CreatedDate = 'createdDate',
  UpdatedDate = 'updatedDate',
  PolicyStartDate = 'policyStartDate',
  PolicyEndDate = 'policyEndDate',
}

export enum SortDir {
  Asc = 'asc',
  Desc = 'desc',
}

export type TimeType = {
  __typename?: 'TimeType';
  hour?: Maybe<Scalars['Int']>;
  minute?: Maybe<Scalars['Int']>;
  second?: Maybe<Scalars['Int']>;
  nano?: Maybe<Scalars['Int']>;
};

export type UrlParams = {
  name: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type UserActionActivity = {
  idType: Scalars['String'];
  idValue: Scalars['String'];
  action: Scalars['String'];
  createdDate: Scalars['Float'];
  userToken: Scalars['String'];
  message?: Maybe<Scalars['String']>;
};

export type UserActivities = UserActivity | ListingActivity | ApplicationActivity | VoucherActivity;

export type UserActivity = UserActionActivity & {
  __typename?: 'UserActivity';
  idType: Scalars['String'];
  idValue: Scalars['String'];
  action: Scalars['String'];
  createdDate: Scalars['Float'];
  userToken: Scalars['String'];
  message?: Maybe<Scalars['String']>;
};

export type VoucherActivity = {
  __typename?: 'VoucherActivity';
  applicationId: Scalars['String'];
  voucherToRentCoverage: Scalars['String'];
  listingAlias: Scalars['String'];
  createdDate: Scalars['Float'];
  updatedDate: Scalars['Float'];
  userToken: Scalars['String'];
};

export type _Service = {
  __typename?: '_Service';
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars['String']>;
};

export type HistoryFragment = { __typename?: 'History' } & {
  logs: Array<
    Maybe<
      { __typename?: 'HistoryType' } & Pick<
        HistoryType,
        'idType' | 'idValue' | 'action' | 'userToken' | 'message' | 'createdDate'
      >
    >
  >;
};

export type LandlordHistoryQueryVariables = Exact<{
  searchType: LogIdType;
  searchValue: Scalars['String'];
}>;

export type LandlordHistoryQuery = { __typename?: 'Query' } & {
  history?: Maybe<{ __typename?: 'History' } & HistoryFragment>;
};

export type CancelPolicyFragment = { __typename?: 'CancelPolicyResponse' } & Pick<
  CancelPolicyResponse,
  'success' | 'httpStatus'
> & { error?: Maybe<{ __typename?: 'ErrorResponse' } & Pick<ErrorResponse, 'message'>> };

export type CancelPolicyMutationVariables = Exact<{
  policyId: Scalars['String'];
  caseNumber: Scalars['String'];
  note: Scalars['String'];
}>;

export type CancelPolicyMutation = { __typename?: 'Mutation' } & {
  cancelPolicy?: Maybe<{ __typename?: 'CancelPolicyResponse' } & CancelPolicyFragment>;
};

export type PolicyDetailsFragment = { __typename?: 'PolicyDetails' } & Pick<
  PolicyDetails,
  'policyId' | 'policyStatus' | 'isCancellable' | 'isEligibleToReinstate'
> & {
    property?: Maybe<
      { __typename?: 'Property' } & Pick<Property, 'listingAlias' | 'street' | 'city' | 'state' | 'zip'>
    >;
    lease?: Maybe<
      { __typename?: 'Lease' } & Pick<Lease, 'id' | 'monthlyRentUsd' | 'startDate' | 'endDate' | 'securityDeposit'>
    >;
    payments?: Maybe<
      { __typename?: 'Payments' } & Pick<Payments, 'id' | 'termType' | 'daysDelinquent'> & {
          firstExpectedPaymentDate?: Maybe<
            { __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>
          >;
          finalExpectedPaymentDate?: Maybe<
            { __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>
          >;
          firstSuccessfulPaymentDate?: Maybe<
            { __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>
          >;
          mostRecentSuccessfulPaymentDate?: Maybe<
            { __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>
          >;
          rentTermsCancelledDate?: Maybe<
            { __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>
          >;
        }
    >;
    landlords: Array<{ __typename?: 'Landlord' } & Pick<Landlord, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>>;
    applicationEligibility: { __typename?: 'ApplicationEligibility' } & Pick<
      ApplicationEligibility,
      'applicationId' | 'applicationEligibilityStatus'
    >;
    renters: Array<
      { __typename?: 'Renter' } & Pick<
        Renter,
        | 'renterId'
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'phone'
        | 'creditCheckEligibleFlag'
        | 'incomeToRentEligibleFlag'
      >
    >;
    leaseLockBinder?: Maybe<
      { __typename?: 'LeaseLockBinder' } & Pick<LeaseLockBinder, 'id' | 'binderStatus'> & {
          issueDate: { __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>;
          effectiveDate?: Maybe<{ __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>>;
          expirationDate?: Maybe<{ __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>>;
          cancelDate?: Maybe<{ __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>>;
        }
    >;
    leaseLockCertificate?: Maybe<
      { __typename?: 'LeaseLockCertificate' } & Pick<LeaseLockCertificate, 'id' | 'certificateStatus'> & {
          issueDate: { __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>;
          effectiveDate?: Maybe<{ __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>>;
          expirationDate?: Maybe<{ __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>>;
          cancelDate?: Maybe<{ __typename?: 'LocalDateType' } & Pick<LocalDateType, 'year' | 'month' | 'day'>>;
        }
    >;
    quote?: Maybe<
      { __typename?: 'Quote' } & Pick<
        Quote,
        | 'quoteId'
        | 'premium'
        | 'coverage'
        | 'firstMonthStampingFee'
        | 'firstMonthSurplusLines'
        | 'firstMonthTotal'
        | 'recurringMonthSurplusLines'
        | 'recurringMonthTotal'
      >
    >;
    premiumTransactions?: Maybe<
      Array<
        Maybe<
          { __typename?: 'PremiumTransaction' } & Pick<
            PremiumTransaction,
            | 'transactionId'
            | 'transactionType'
            | 'premiumAmountInCents'
            | 'chargeId'
            | 'chargeStatus'
            | 'payoutStatus'
            | 'formattedChargeDate'
            | 'formattedTransactionCreatedDate'
            | 'formattedTransactionUpdatedDate'
          >
        >
      >
    >;
    monthlyPremiumPayments?: Maybe<
      Array<
        Maybe<
          { __typename?: 'MonthlyPremiumPayments' } & Pick<
            MonthlyPremiumPayments,
            | 'sequenceNumber'
            | 'invoiceDate'
            | 'totalDueAmount'
            | 'premiumAmount'
            | 'stampingFeeAmount'
            | 'surplusLinesTaxAmount'
          >
        >
      >
    >;
  };

export type HistoryForRelatedActionsFragment = { __typename?: 'HistoryForPolicyRelatedActions' } & {
  logs: Array<
    Maybe<
      { __typename?: 'HistoryForPolicyRelatedActionsType' } & Pick<
        HistoryForPolicyRelatedActionsType,
        'policyId' | 'action' | 'createdDate' | 'message' | 'source' | 'sourceId'
      >
    >
  >;
};

export type PolicyRelatedActionsDetailsAndHistoryQueryVariables = Exact<{
  policyId: Scalars['String'];
  delimiter?: Maybe<Scalars['String']>;
}>;

export type PolicyRelatedActionsDetailsAndHistoryQuery = { __typename?: 'Query' } & {
  expandedPolicyDetails?: Maybe<{ __typename?: 'PolicyDetails' } & PolicyDetailsFragment>;
  historyForPolicyRelatedActions?: Maybe<
    { __typename?: 'HistoryForPolicyRelatedActions' } & HistoryForRelatedActionsFragment
  >;
};

export type ReinstateDroppedPolicyFragment = { __typename?: 'ReinstateDroppedPolicyResponse' } & Pick<
  ReinstateDroppedPolicyResponse,
  'success' | 'httpStatus'
> & { error?: Maybe<{ __typename?: 'ErrorResponse' } & Pick<ErrorResponse, 'message'>> };

export type ReinstateDroppedPolicyMutationVariables = Exact<{
  policyId: Scalars['String'];
  caseNumber: Scalars['String'];
  note: Scalars['String'];
}>;

export type ReinstateDroppedPolicyMutation = { __typename?: 'Mutation' } & {
  reinstateDroppedPolicy?: Maybe<{ __typename?: 'ReinstateDroppedPolicyResponse' } & ReinstateDroppedPolicyFragment>;
};

export type ReportsFragment = { __typename?: 'Reports' } & {
  reportsDetails: Array<
    { __typename?: 'Report' } & Pick<Report, 'reportName' | 'reportDescription' | 'methodToInvoke'> & {
        methodParamsDetails?: Maybe<
          Array<
            Maybe<
              { __typename?: 'MethodParamsDetails' } & Pick<
                MethodParamsDetails,
                'paramName' | 'paramDataType' | 'paramDefaultValue'
              >
            >
          >
        >;
      }
  >;
};

export type ReportsQueryVariables = Exact<{
  reportType?: Maybe<Scalars['String']>;
}>;

export type ReportsQuery = { __typename?: 'Query' } & { reports?: Maybe<{ __typename?: 'Reports' } & ReportsFragment> };

export type LandlordFragment = { __typename?: 'Landlords' } & {
  rentGuaranteeLandlords: Array<
    { __typename?: 'RentGuaranteeLandLordObject' } & {
      landlord?: Maybe<
        { __typename?: 'RentGuaranteeLandLord' } & Pick<
          RentGuaranteeLandLord,
          'landlordUserToken' | 'firstName' | 'lastName' | 'emails' | 'phones'
        >
      >;
    }
  >;
};

export type LandlordsDataForReportsQueryVariables = Exact<{
  methodToInvoke: Scalars['String'];
  urlParams?: Maybe<Scalars['String']>;
}>;

export type LandlordsDataForReportsQuery = { __typename?: 'Query' } & {
  landlordsDataForReports?: Maybe<{ __typename?: 'Landlords' } & LandlordFragment>;
};

export type ListingActivityFragment = { __typename: 'ListingActivity' } & Pick<
  ListingActivity,
  'idType' | 'idValue' | 'action' | 'createdDate' | 'userToken' | 'message'
>;

export type UserActivityFragment = { __typename: 'UserActivity' } & Pick<
  UserActivity,
  'idType' | 'idValue' | 'action' | 'createdDate' | 'userToken' | 'message'
>;

export type ApplicationActivityFragment = { __typename: 'ApplicationActivity' } & Pick<
  ApplicationActivity,
  'applicationId' | 'incomeToRentEligible' | 'incomeUpdatedDate' | 'listingAlias' | 'createdDate' | 'userToken'
>;

export type VoucherActivityFragment = { __typename: 'VoucherActivity' } & Pick<
  VoucherActivity,
  'applicationId' | 'voucherToRentCoverage' | 'listingAlias' | 'createdDate' | 'userToken'
>;

export type UserActivityDataForReportsQueryVariables = Exact<{
  methodToInvoke: Scalars['String'];
  urlParams?: Maybe<Array<UrlParams> | UrlParams>;
}>;

export type UserActivityDataForReportsQuery = { __typename?: 'Query' } & {
  userActivityDataForReports?: Maybe<
    { __typename?: 'Activities' } & {
      userActivities?: Maybe<
        Array<
          | ({ __typename?: 'UserActivity' } & UserActivityFragment)
          | ({ __typename?: 'ListingActivity' } & ListingActivityFragment)
          | ({ __typename?: 'ApplicationActivity' } & ApplicationActivityFragment)
          | ({ __typename?: 'VoucherActivity' } & VoucherActivityFragment)
        >
      >;
    }
  >;
};

export type PolicySearchTypesFragment = { __typename?: 'PolicySearchTypes' } & {
  values: Array<{ __typename?: 'PolicySearchType' } & Pick<PolicySearchType, 'value' | 'displayName'>>;
};

export type PolicySearchTypesQueryVariables = Exact<{ [key: string]: never }>;

export type PolicySearchTypesQuery = { __typename?: 'Query' } & {
  policySearchTypes?: Maybe<{ __typename?: 'PolicySearchTypes' } & PolicySearchTypesFragment>;
};

export type PolicyStatusesFragment = { __typename?: 'PolicyStatuses' } & {
  values: Array<{ __typename?: 'PolicyStatus' } & Pick<PolicyStatus, 'value' | 'displayName'>>;
};

export type PolicyStatusesQueryVariables = Exact<{ [key: string]: never }>;

export type PolicyStatusesQuery = { __typename?: 'Query' } & {
  policyStatuses?: Maybe<{ __typename?: 'PolicyStatuses' } & PolicyStatusesFragment>;
};

export type PoliciesFragment = { __typename?: 'Policies' } & Pick<Policies, 'totalResults'> & {
    policies: Array<
      Maybe<
        { __typename?: 'Policy' } & Pick<
          Policy,
          | 'createdDate'
          | 'updatedDate'
          | 'listingAlias'
          | 'isActive'
          | 'policyStatus'
          | 'policyId'
          | 'leaseTermStartDate'
          | 'leaseTermEndDate'
          | 'policyTermStartDate'
          | 'policyTermEndDate'
          | 'landlordUserToken'
          | 'renterIds'
        > & {
            applicationId: { __typename?: 'Application' } & Pick<Application, 'id'>;
            leaseId: { __typename?: 'Lease' } & Pick<Lease, 'id'>;
            paymentId?: Maybe<{ __typename?: 'Payments' } & Pick<Payments, 'id'>>;
          }
      >
    >;
  };

export type SearchPoliciesQueryVariables = Exact<{
  searchType: Scalars['String'];
  searchValue: Scalars['String'];
  pageSize: Scalars['Int'];
  fromIndex: Scalars['Int'];
  sortBy?: Maybe<SortBy>;
  sortDir?: Maybe<SortDir>;
}>;

export type SearchPoliciesQuery = { __typename?: 'Query' } & {
  searchPolicies?: Maybe<{ __typename?: 'Policies' } & PoliciesFragment>;
};

export type PoliciesAndHistoryQueryVariables = Exact<{
  searchType: LogIdType;
  searchValue: Scalars['String'];
  pageSize: Scalars['Int'];
  fromIndex: Scalars['Int'];
  sortBy?: Maybe<SortBy>;
  sortDir?: Maybe<SortDir>;
}>;

export type PoliciesAndHistoryQuery = { __typename?: 'Query' } & {
  searchPolicies?: Maybe<{ __typename?: 'Policies' } & PoliciesFragment>;
  history?: Maybe<{ __typename?: 'History' } & HistoryFragment>;
};

export const HistoryFragmentDoc = `
    fragment history on History {
  logs {
    idType
    idValue
    action
    userToken
    message
    createdDate
  }
}
    `;
export const CancelPolicyFragmentDoc = `
    fragment cancelPolicy on CancelPolicyResponse {
  success
  httpStatus
  error {
    message
  }
}
    `;
export const PolicyDetailsFragmentDoc = `
    fragment policyDetails on PolicyDetails {
  policyId
  property {
    listingAlias
    street
    city
    state
    zip
  }
  lease {
    id
    monthlyRentUsd
    startDate
    endDate
    securityDeposit
  }
  payments {
    id
    termType
    firstExpectedPaymentDate {
      year
      month
      day
    }
    finalExpectedPaymentDate {
      year
      month
      day
    }
    firstSuccessfulPaymentDate {
      year
      month
      day
    }
    mostRecentSuccessfulPaymentDate {
      year
      month
      day
    }
    rentTermsCancelledDate {
      year
      month
      day
    }
    daysDelinquent
  }
  landlords {
    id
    firstName
    lastName
    email
    phone
  }
  applicationEligibility {
    applicationId
    applicationEligibilityStatus
  }
  renters {
    renterId
    firstName
    lastName
    email
    phone
    creditCheckEligibleFlag
    incomeToRentEligibleFlag
  }
  leaseLockBinder {
    id
    issueDate {
      year
      month
      day
    }
    effectiveDate {
      year
      month
      day
    }
    expirationDate {
      year
      month
      day
    }
    cancelDate {
      year
      month
      day
    }
    binderStatus
  }
  leaseLockCertificate {
    id
    issueDate {
      year
      month
      day
    }
    effectiveDate {
      year
      month
      day
    }
    expirationDate {
      year
      month
      day
    }
    cancelDate {
      year
      month
      day
    }
    certificateStatus
  }
  quote {
    quoteId
    premium
    coverage
    firstMonthStampingFee
    firstMonthSurplusLines
    firstMonthTotal
    recurringMonthSurplusLines
    recurringMonthTotal
  }
  premiumTransactions {
    transactionId
    transactionType
    premiumAmountInCents
    chargeId
    chargeStatus
    payoutStatus
    formattedChargeDate(delimiter: $delimiter)
    formattedTransactionCreatedDate(delimiter: $delimiter)
    formattedTransactionUpdatedDate(delimiter: $delimiter)
  }
  monthlyPremiumPayments {
    sequenceNumber
    invoiceDate
    totalDueAmount
    premiumAmount
    stampingFeeAmount
    surplusLinesTaxAmount
  }
  policyStatus
  isCancellable
  isEligibleToReinstate
}
    `;
export const HistoryForRelatedActionsFragmentDoc = `
    fragment historyForRelatedActions on HistoryForPolicyRelatedActions {
  logs {
    policyId
    action
    createdDate
    message
    source
    sourceId
  }
}
    `;
export const ReinstateDroppedPolicyFragmentDoc = `
    fragment reinstateDroppedPolicy on ReinstateDroppedPolicyResponse {
  success
  httpStatus
  error {
    message
  }
}
    `;
export const ReportsFragmentDoc = `
    fragment reports on Reports {
  reportsDetails {
    reportName
    reportDescription
    methodToInvoke
    methodParamsDetails {
      paramName
      paramDataType
      paramDefaultValue
    }
  }
}
    `;
export const LandlordFragmentDoc = `
    fragment landlord on Landlords {
  rentGuaranteeLandlords {
    landlord {
      landlordUserToken
      firstName
      lastName
      emails
      phones
    }
  }
}
    `;
export const ListingActivityFragmentDoc = `
    fragment listingActivity on ListingActivity {
  __typename
  idType
  idValue
  action
  createdDate
  userToken
  message
}
    `;
export const UserActivityFragmentDoc = `
    fragment userActivity on UserActivity {
  __typename
  idType
  idValue
  action
  createdDate
  userToken
  message
}
    `;
export const ApplicationActivityFragmentDoc = `
    fragment applicationActivity on ApplicationActivity {
  __typename
  applicationId
  incomeToRentEligible
  incomeUpdatedDate
  listingAlias
  createdDate
  userToken
}
    `;
export const VoucherActivityFragmentDoc = `
    fragment voucherActivity on VoucherActivity {
  __typename
  applicationId
  voucherToRentCoverage
  listingAlias
  createdDate
  userToken
}
    `;
export const PolicySearchTypesFragmentDoc = `
    fragment policySearchTypes on PolicySearchTypes {
  values {
    value
    displayName
  }
}
    `;
export const PolicyStatusesFragmentDoc = `
    fragment policyStatuses on PolicyStatuses {
  values {
    value
    displayName
  }
}
    `;
export const PoliciesFragmentDoc = `
    fragment policies on Policies {
  policies {
    createdDate
    updatedDate
    listingAlias
    isActive
    policyStatus
    applicationId {
      id
    }
    leaseId {
      id
    }
    paymentId {
      id
    }
    policyId
    leaseTermStartDate
    leaseTermEndDate
    policyTermStartDate
    policyTermEndDate
    landlordUserToken
    renterIds
  }
  totalResults
}
    `;
export const LandlordHistoryDocument = `
    query LandlordHistory($searchType: LogIdType!, $searchValue: String!) {
  history(logIdType: $searchType, logIdValue: $searchValue) {
    ...history
  }
}
    ${HistoryFragmentDoc}`;
export const useLandlordHistoryQuery = <TData = LandlordHistoryQuery, TError = unknown>(
  client: GraphQLClient,
  variables: LandlordHistoryQueryVariables,
  options?: UseQueryOptions<LandlordHistoryQuery, TError, TData>,
) =>
  useQuery<LandlordHistoryQuery, TError, TData>(
    ['LandlordHistory', variables],
    fetcher<LandlordHistoryQuery, LandlordHistoryQueryVariables>(client, LandlordHistoryDocument, variables),
    options,
  );
useLandlordHistoryQuery.getKey = (variables: LandlordHistoryQueryVariables) => ['LandlordHistory', variables];

export const CancelPolicyDocument = `
    mutation CancelPolicy($policyId: String!, $caseNumber: String!, $note: String!) {
  cancelPolicy(policyId: $policyId, caseNumber: $caseNumber, note: $note) {
    ...cancelPolicy
  }
}
    ${CancelPolicyFragmentDoc}`;
export const useCancelPolicyMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<CancelPolicyMutation, TError, CancelPolicyMutationVariables, TContext>,
) =>
  useMutation<CancelPolicyMutation, TError, CancelPolicyMutationVariables, TContext>(
    (variables?: CancelPolicyMutationVariables) =>
      fetcher<CancelPolicyMutation, CancelPolicyMutationVariables>(client, CancelPolicyDocument, variables)(),
    options,
  );
export const PolicyRelatedActionsDetailsAndHistoryDocument = `
    query PolicyRelatedActionsDetailsAndHistory($policyId: String!, $delimiter: String) {
  expandedPolicyDetails(policyId: $policyId) {
    ...policyDetails
  }
  historyForPolicyRelatedActions(policyId: $policyId) {
    ...historyForRelatedActions
  }
}
    ${PolicyDetailsFragmentDoc}
${HistoryForRelatedActionsFragmentDoc}`;
export const usePolicyRelatedActionsDetailsAndHistoryQuery = <
  TData = PolicyRelatedActionsDetailsAndHistoryQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: PolicyRelatedActionsDetailsAndHistoryQueryVariables,
  options?: UseQueryOptions<PolicyRelatedActionsDetailsAndHistoryQuery, TError, TData>,
) =>
  useQuery<PolicyRelatedActionsDetailsAndHistoryQuery, TError, TData>(
    ['PolicyRelatedActionsDetailsAndHistory', variables],
    fetcher<PolicyRelatedActionsDetailsAndHistoryQuery, PolicyRelatedActionsDetailsAndHistoryQueryVariables>(
      client,
      PolicyRelatedActionsDetailsAndHistoryDocument,
      variables,
    ),
    options,
  );
usePolicyRelatedActionsDetailsAndHistoryQuery.getKey = (
  variables: PolicyRelatedActionsDetailsAndHistoryQueryVariables,
) => ['PolicyRelatedActionsDetailsAndHistory', variables];

export const ReinstateDroppedPolicyDocument = `
    mutation ReinstateDroppedPolicy($policyId: String!, $caseNumber: String!, $note: String!) {
  reinstateDroppedPolicy(
    policyId: $policyId
    caseNumber: $caseNumber
    note: $note
  ) {
    ...reinstateDroppedPolicy
  }
}
    ${ReinstateDroppedPolicyFragmentDoc}`;
export const useReinstateDroppedPolicyMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    ReinstateDroppedPolicyMutation,
    TError,
    ReinstateDroppedPolicyMutationVariables,
    TContext
  >,
) =>
  useMutation<ReinstateDroppedPolicyMutation, TError, ReinstateDroppedPolicyMutationVariables, TContext>(
    (variables?: ReinstateDroppedPolicyMutationVariables) =>
      fetcher<ReinstateDroppedPolicyMutation, ReinstateDroppedPolicyMutationVariables>(
        client,
        ReinstateDroppedPolicyDocument,
        variables,
      )(),
    options,
  );
export const ReportsDocument = `
    query Reports($reportType: String) {
  reports(reportType: $reportType) {
    ...reports
  }
}
    ${ReportsFragmentDoc}`;
export const useReportsQuery = <TData = ReportsQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: ReportsQueryVariables,
  options?: UseQueryOptions<ReportsQuery, TError, TData>,
) =>
  useQuery<ReportsQuery, TError, TData>(
    ['Reports', variables],
    fetcher<ReportsQuery, ReportsQueryVariables>(client, ReportsDocument, variables),
    options,
  );
useReportsQuery.getKey = (variables?: ReportsQueryVariables) => ['Reports', variables];

export const LandlordsDataForReportsDocument = `
    query LandlordsDataForReports($methodToInvoke: String!, $urlParams: String) {
  landlordsDataForReports(methodToInvoke: $methodToInvoke, urlParams: $urlParams) {
    ...landlord
  }
}
    ${LandlordFragmentDoc}`;
export const useLandlordsDataForReportsQuery = <TData = LandlordsDataForReportsQuery, TError = unknown>(
  client: GraphQLClient,
  variables: LandlordsDataForReportsQueryVariables,
  options?: UseQueryOptions<LandlordsDataForReportsQuery, TError, TData>,
) =>
  useQuery<LandlordsDataForReportsQuery, TError, TData>(
    ['LandlordsDataForReports', variables],
    fetcher<LandlordsDataForReportsQuery, LandlordsDataForReportsQueryVariables>(
      client,
      LandlordsDataForReportsDocument,
      variables,
    ),
    options,
  );
useLandlordsDataForReportsQuery.getKey = (variables: LandlordsDataForReportsQueryVariables) => [
  'LandlordsDataForReports',
  variables,
];

export const UserActivityDataForReportsDocument = `
    query UserActivityDataForReports($methodToInvoke: String!, $urlParams: [UrlParams!]) {
  userActivityDataForReports(
    methodToInvoke: $methodToInvoke
    urlParams: $urlParams
  ) {
    userActivities {
      ...listingActivity
      ...userActivity
      ...applicationActivity
      ...voucherActivity
    }
  }
}
    ${ListingActivityFragmentDoc}
${UserActivityFragmentDoc}
${ApplicationActivityFragmentDoc}
${VoucherActivityFragmentDoc}`;
export const useUserActivityDataForReportsQuery = <TData = UserActivityDataForReportsQuery, TError = unknown>(
  client: GraphQLClient,
  variables: UserActivityDataForReportsQueryVariables,
  options?: UseQueryOptions<UserActivityDataForReportsQuery, TError, TData>,
) =>
  useQuery<UserActivityDataForReportsQuery, TError, TData>(
    ['UserActivityDataForReports', variables],
    fetcher<UserActivityDataForReportsQuery, UserActivityDataForReportsQueryVariables>(
      client,
      UserActivityDataForReportsDocument,
      variables,
    ),
    options,
  );
useUserActivityDataForReportsQuery.getKey = (variables: UserActivityDataForReportsQueryVariables) => [
  'UserActivityDataForReports',
  variables,
];

export const PolicySearchTypesDocument = `
    query PolicySearchTypes {
  policySearchTypes {
    ...policySearchTypes
  }
}
    ${PolicySearchTypesFragmentDoc}`;
export const usePolicySearchTypesQuery = <TData = PolicySearchTypesQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: PolicySearchTypesQueryVariables,
  options?: UseQueryOptions<PolicySearchTypesQuery, TError, TData>,
) =>
  useQuery<PolicySearchTypesQuery, TError, TData>(
    ['PolicySearchTypes', variables],
    fetcher<PolicySearchTypesQuery, PolicySearchTypesQueryVariables>(client, PolicySearchTypesDocument, variables),
    options,
  );
usePolicySearchTypesQuery.getKey = (variables?: PolicySearchTypesQueryVariables) => ['PolicySearchTypes', variables];

export const PolicyStatusesDocument = `
    query PolicyStatuses {
  policyStatuses {
    ...policyStatuses
  }
}
    ${PolicyStatusesFragmentDoc}`;
export const usePolicyStatusesQuery = <TData = PolicyStatusesQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: PolicyStatusesQueryVariables,
  options?: UseQueryOptions<PolicyStatusesQuery, TError, TData>,
) =>
  useQuery<PolicyStatusesQuery, TError, TData>(
    ['PolicyStatuses', variables],
    fetcher<PolicyStatusesQuery, PolicyStatusesQueryVariables>(client, PolicyStatusesDocument, variables),
    options,
  );
usePolicyStatusesQuery.getKey = (variables?: PolicyStatusesQueryVariables) => ['PolicyStatuses', variables];

export const SearchPoliciesDocument = `
    query SearchPolicies($searchType: String!, $searchValue: String!, $pageSize: Int!, $fromIndex: Int!, $sortBy: SortBy, $sortDir: SortDir) {
  searchPolicies(
    searchType: $searchType
    searchValue: $searchValue
    pageSize: $pageSize
    fromIndex: $fromIndex
    sortBy: $sortBy
    sortDir: $sortDir
  ) {
    ...policies
  }
}
    ${PoliciesFragmentDoc}`;
export const useSearchPoliciesQuery = <TData = SearchPoliciesQuery, TError = unknown>(
  client: GraphQLClient,
  variables: SearchPoliciesQueryVariables,
  options?: UseQueryOptions<SearchPoliciesQuery, TError, TData>,
) =>
  useQuery<SearchPoliciesQuery, TError, TData>(
    ['SearchPolicies', variables],
    fetcher<SearchPoliciesQuery, SearchPoliciesQueryVariables>(client, SearchPoliciesDocument, variables),
    options,
  );
useSearchPoliciesQuery.getKey = (variables: SearchPoliciesQueryVariables) => ['SearchPolicies', variables];

export const PoliciesAndHistoryDocument = `
    query PoliciesAndHistory($searchType: LogIdType!, $searchValue: String!, $pageSize: Int!, $fromIndex: Int!, $sortBy: SortBy, $sortDir: SortDir) {
  searchPolicies(
    searchType: "listingAlias"
    searchValue: $searchValue
    pageSize: $pageSize
    fromIndex: $fromIndex
    sortBy: $sortBy
    sortDir: $sortDir
  ) {
    ...policies
  }
  history(logIdType: $searchType, logIdValue: $searchValue) {
    ...history
  }
}
    ${PoliciesFragmentDoc}
${HistoryFragmentDoc}`;
export const usePoliciesAndHistoryQuery = <TData = PoliciesAndHistoryQuery, TError = unknown>(
  client: GraphQLClient,
  variables: PoliciesAndHistoryQueryVariables,
  options?: UseQueryOptions<PoliciesAndHistoryQuery, TError, TData>,
) =>
  useQuery<PoliciesAndHistoryQuery, TError, TData>(
    ['PoliciesAndHistory', variables],
    fetcher<PoliciesAndHistoryQuery, PoliciesAndHistoryQueryVariables>(client, PoliciesAndHistoryDocument, variables),
    options,
  );
usePoliciesAndHistoryQuery.getKey = (variables: PoliciesAndHistoryQueryVariables) => ['PoliciesAndHistory', variables];
