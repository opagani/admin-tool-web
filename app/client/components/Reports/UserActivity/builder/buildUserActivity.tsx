import React from 'react';
import { Link } from 'react-router-dom';
import type {
  ApplicationActivity,
  ListingActivity,
  UserActivities,
  UserActivity,
  VoucherActivity,
} from '../../../../generated-types/graphql';
import { IconCheckmarkCircle, IconCloseCircle } from '@zillow/constellation';
import { sortByDate } from '../../../../utils/utils';

export const buildColumns = (methodToInvoke: string) => {
  switch (methodToInvoke) {
    case 'getUserActivityOptIns':
    case 'getUserActivityAllEvents':
      return [
        {
          Header: `User Activity Data`,
          columns: [
            {
              Header: 'Event Type',
              id: 'action',
              accessor: 'action',
              show: true,
            },
            {
              Header: 'User Token',
              id: 'userToken',
              accessor: (userActivities: ListingActivity | UserActivity) => (
                <Link to={`/user/${userActivities.userToken}`}>{userActivities.userToken}</Link>
              ),
              show: true,
            },
            {
              Header: 'Listing Alias',
              id: 'idValue',
              accessor: (userActivities: ListingActivity | UserActivity) => (
                <Link to={`/?searchType=listingAlias&searchValue=${userActivities.idValue}`}>
                  {userActivities.idValue}
                </Link>
              ),
              show: true,
            },
            {
              Header: 'Message',
              id: 'message',
              accessor: 'message',
              show: methodToInvoke == 'getUserActivityOptIns' ? false : true,
            },
            {
              Header: `Created Date - ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
              id: 'createdDate',
              sortType: sortByDate,
              accessor: (userActivities: UserActivities) =>
                new Date(userActivities.createdDate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
              show: true,
            },
          ],
        },
      ];
    case 'getApplicationFlagsUserActivityEvents':
      return [
        {
          Header: `User Activity Data`,
          columns: [
            {
              Header: 'Appliation ID',
              id: 'applicationId',
              accessor: (userActivities: ApplicationActivity) => (
                <Link to={`/?searchType=applicationId&searchValue=${userActivities.applicationId}`}>
                  {userActivities.applicationId}
                </Link>
              ),
              show: true,
            },
            {
              Header: 'User Token',
              id: 'userToken',
              accessor: (userActivities: ApplicationActivity) => (
                <Link to={`/user/${userActivities.userToken}`}>{userActivities.userToken}</Link>
              ),
              show: true,
            },
            {
              Header: 'Listing Alias',
              id: 'listingAlias',
              accessor: (userActivities: ApplicationActivity) => (
                <Link to={`/?searchType=listingAlias&searchValue=${userActivities.listingAlias}`}>
                  {userActivities.listingAlias}
                </Link>
              ),
              show: true,
            },
            {
              Header: 'Income Eligible',
              id: 'incomeToRentEligible',
              accessor: (userActivities: ApplicationActivity) =>
                userActivities.incomeToRentEligible ? (
                  <IconCheckmarkCircle size="sm" fontColor="green300" />
                ) : (
                  <IconCloseCircle size="sm" fontColor="red500" />
                ),
              show: true,
              disableSortBy: true,
            },
            {
              Header: `Created Date - ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
              id: 'createdDate',
              sortType: sortByDate,
              accessor: (userActivities: ApplicationActivity) =>
                new Date(userActivities.createdDate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
              show: true,
            },
          ],
        },
      ];
    case 'getRentVoucherCoverageUserActivityEvents':
      return [
        {
          Header: `User Activity Data`,
          columns: [
            {
              Header: 'Appliation ID',
              id: 'applicationId',
              accessor: (userActivities: VoucherActivity) => (
                <Link to={`/?searchType=applicationId&searchValue=${userActivities.applicationId}`}>
                  {userActivities.applicationId}
                </Link>
              ),
              show: true,
            },
            {
              Header: 'User Token',
              id: 'userToken',
              accessor: (userActivities: VoucherActivity) => (
                <Link to={`/user/${userActivities.userToken}`}>{userActivities.userToken}</Link>
              ),
              show: true,
            },
            {
              Header: 'Listing Alias',
              id: 'listingAlias',
              accessor: (userActivities: VoucherActivity) => (
                <Link to={`/?searchType=listingAlias&searchValue=${userActivities.listingAlias}`}>
                  {userActivities.listingAlias}
                </Link>
              ),
              show: true,
            },
            {
              Header: 'Voucher Coverage',
              id: 'voucherToRentCoverage',
              accessor: 'voucherToRentCoverage',
              show: true,
              disableSortBy: true,
            },
            {
              Header: `Created Date - ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
              id: 'createdDate',
              sortType: sortByDate,
              accessor: (userActivities: VoucherActivity) =>
                new Date(userActivities.createdDate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }),
              show: true,
            },
          ],
        },
      ];
    default:
      return [];
  }
};
