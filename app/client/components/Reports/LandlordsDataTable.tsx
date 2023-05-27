import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSortBy, useTable } from 'react-table';
import type { Maybe, RentGuaranteeLandLord, RentGuaranteeLandLordObject } from '../../generated-types/graphql';

import { IconChevronDown, IconChevronUp, Table } from '@zillow/constellation';

interface LandlordsDataTableType {
  rentGuaranteeLandlords: Array<RentGuaranteeLandLordObject>;
}

const LandlordsDataTable = ({ rentGuaranteeLandlords }: LandlordsDataTableType): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        Header: `Landlords Data`,
        columns: [
          {
            Header: 'Landlord User Token',
            accessor: 'landlord[landlordUserToken]',
          },
          {
            Header: 'First Name',
            accessor: 'landlord[firstName]',
          },
          {
            Header: 'Last Name',
            accessor: 'landlord[lastName]',
          },
          {
            Header: 'Email',
            accessor: 'landlord[emails][0]',
          },
          {
            Header: 'Phone',
            accessor: 'landlord[phones][0]',
          },
          {
            Header: 'View Policies',
            id: 'viewPolicies',
            accessor: (RentGuaranteeLandLordObject: { landlord?: Maybe<RentGuaranteeLandLord> | undefined }) => (
              <Link
                to={{
                  pathname: '/',
                  search: `?searchType=landlordUserToken&searchValue=${RentGuaranteeLandLordObject.landlord?.landlordUserToken}`,
                  state: { fromDashboard: true },
                }}
              >
                Policies
              </Link>
            ),
          },
          {
            Header: 'View User History',
            id: 'viewUserHistory',
            accessor: (RentGuaranteeLandLordObject: { landlord?: Maybe<RentGuaranteeLandLord> | undefined }) => (
              <Link
                to={{
                  pathname: `/user/${RentGuaranteeLandLordObject.landlord?.landlordUserToken}`,
                  state: { fromDashboard: true },
                }}
              >
                History
              </Link>
            ),
            disableFilters: true,
          },
        ],
      },
    ],
    [],
  );

  const { allColumns, getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: rentGuaranteeLandlords as Array<RentGuaranteeLandLordObject>,
    },
    useSortBy,
  );

  // Render the UI for your table
  return (
    <Table.Responsive>
      <Table
        aria-label={`Landlords data table`}
        alignments={allColumns.map(() => 'center')}
        size="sm"
        {...getTableProps()}
      >
        <Table.Header>
          {headerGroups.map((headerGroup, id) => (
            <Table.Row {...headerGroup.getHeaderGroupProps()} key={id}>
              {headerGroup.headers.map((column, id) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())} key={id}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <>
                          {' '}
                          <IconChevronDown />
                        </>
                      ) : (
                        <>
                          {' '}
                          <IconChevronUp />
                        </>
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row, id) => {
            prepareRow(row);
            return (
              <Table.Row {...row.getRowProps()} key={id}>
                {row.cells.map((cell, id) => {
                  return (
                    <Table.Cell {...cell.getCellProps()} key={id}>
                      {cell.render('Cell')}
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Table.Responsive>
  );
};

export default LandlordsDataTable;
